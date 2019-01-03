import cytoscape from 'cytoscape'
import _ from 'lodash'
import BMap from 'BMap'

const inside = require('point-in-polygon')

/**
 * 将GeoJSON转换为cytoscape的拓扑
 * @param geojson
 */
export function geojson2cytoscape(geojson) {
  const elements = []
  // 增加点
  _.each(geojson['features'], feature => {
    if (feature['geometry']['type'] === 'Point') {
      elements.push({
        data: {
          id: feature['properties']['name'],
          businessType: feature['businessType'] || 'JUNCTIONS',
          position: {
            x: feature['geometry']['coordinates'][1],
            y: feature['geometry']['coordinates'][0]
          },
          properties: feature
        }
      })
    }
  })
  // @TODO: 增加线
  _.each(geojson['features'], feature => {
    if (feature['geometry']['type'] === 'LineString') {
      elements.push({
        data: {
          id: feature['properties']['name'],
          businessType: feature['properties']['businessType'] || 'CONDUITS',
          source: feature['properties']['fromnode'],
          target: feature['properties']['tonode'],
          properties: feature
        }
      })
    }
    // @TODO: 未来要支持
    // if (feature['geometry']['type'] === 'MultiLineString') {
    // }
    // if (feature['geometry']['type'] === 'MultiPoint') {
    // }
  })

  const cy = cytoscape({
    container: undefined,
    elements: elements
  })
  return cy
}

/**
 * 获取地块的中心. 测试
 * @param {*} feature geojson里面对应的feature
 */
export function getCenterPointOfSubcatchment(feature) {
  if (feature['geometry']['type'] !== 'Polygon') {
    console.warn('输入的feature不合法：feature的类型应该为Polygon')
    return []
  }

  const coord = feature['geometry']['coordinates'][0]
  const center = coord.reduce(function(x, y) {
    return [x[0] + y[0] / coord.length, x[1] + y[1] / coord.length]
  }, [0, 0])
  return [center[1], center[0]]
}

/**
 * 判断一个点是否在一个多边形内. 需要测试
 * @param {*} node cytoscape里的node对象
 * @param {*} feature geojson里的feature对象
 */
export function isNodeInPolygon(node, feature) {
  if (feature['geometry']['type'] !== 'Polygon') {
    console.warn('输入的feature不合法：feature的类型应该为Polygon')
    return []
  }

  return inside([node.position().x, node.position().y], feature['geometry']['coordinates'][0])
}

/**
 * 获取跟点最接近的检查井. @TODO: 需要支持conduitType
 * @param {*} point [x, y] 格式的点
 * @param {*} cy
 * @param {*} conduitType 管道类型
 */
export function getNearestNodeOfPoint(point, cy, conduitType) {
  let minDistance = Infinity
  let nearestNode = null
  let nodeDistance = 0
  for (let i = 0; i < cy.nodes().length; i++) {
    nodeDistance = (point[0] - cy.nodes()[i].data().position.x) ** 2 + (point[1] - cy.nodes()[i].data().position.y) ** 2
    // 判断点对应的导管类型。
    if (conduitType) {
      const edges = cy.nodes()[i].connectedEdges()
      if (!edges.length) {
        continue
      }
      if (edges[0].data()['properties']['properties']['leixing'] === conduitType) {
        if (nodeDistance < minDistance) {
          nearestNode = cy.nodes()[i]
          minDistance = nodeDistance
        }
      }
    } else {
      if (nodeDistance < minDistance) {
        nearestNode = cy.nodes()[i]
        minDistance = nodeDistance
      }
    }
  }

  return nearestNode.data()
}

/**
 * 查询地块下游管道.
 * @param feature
 * @param cy
 * @param conduitType 管道类型包括 污水检查井和雨水检查井两种
 * @returns {Array}
 */
export function getDescendantConduitsOfSubcatchment(feature, cy, conduitType) {
  if (feature['geometry']['type'] !== 'Polygon') {
    console.warn('输入的feature不合法：feature的类型应该为Polygon')
    return []
  }

  const subcatchmentCenterPoint = getCenterPointOfSubcatchment(feature)
  const nearestJunctionNodeData = getNearestNodeOfPoint(subcatchmentCenterPoint, cy, conduitType)

  return _.map(cy.nodes(`[id="${nearestJunctionNodeData['id']}"]`).successors().edges(), edge => {
    return edge.data()
  })
}

/**
 * TODO: 查询地块下游地块. 暂时不实现
 */
export function getDescendantSubcatchmentsOfSubcatchment(feature, cy) {
  if (feature['geometry']['type'] !== 'Polygon') {
    console.warn('输入的feature不合法：feature的类型应该为Polygon')
    return []
  }
}

/**
 * 查询地块下游排口
 * @param feature
 * @param cy
 * @param conduitType
 * @returns {Array}
 */
export function getDescendantOutfallsOfSubcatchment(feature, cy, conduitType) {
  if (feature['geometry']['type'] !== 'Polygon') {
    console.warn('输入的feature不合法：feature的类型应该为Polygon')
    return []
  }

  const subcatchmentCenterPoint = getCenterPointOfSubcatchment(feature)
  const nearestJunctionNodeData = getNearestNodeOfPoint(subcatchmentCenterPoint, cy, conduitType)

  return _.map(cy.nodes(`[id="${nearestJunctionNodeData['id']}"]`).successors().nodes('[businessType="OUTFALLS"]'), node => {
    return node.data()
  })
}

/**
 * 查询排口上游管道
 */
export function getAncestorConduitsOfOutfall(feature, cy) {
  if (feature['geometry']['type'] !== 'Point') {
    console.warn('输入的feature不合法：feature的类型应该为Point')
    return []
  }

  const outfallNode = cy.nodes(`[id="${feature.properties.name}"]`)

  return _.map(outfallNode.predecessors().edges(), edge => {
    return edge.data()
  })
}

/**
 * 计算得到所有地块最近点的字典.
 * @param geojson
 * @param cy
 */
export function calcAllSubcatchmentNearestNode(geojson, cy) {
  const allSubcatchments = _.reject(geojson['features'], feature => {
    return feature['geometry']['type'] !== 'Polygon'
  })

  const map = {}
  _.each(allSubcatchments, subcatchment => {
    const centerPoint = getCenterPointOfSubcatchment(subcatchment)
    map[subcatchment['properties']['name']] = getNearestNodeOfPoint(centerPoint, cy)['id']
  })

  return map
}

/**
 * 根据名称查找geojson的feature
 * @param name
 * @param geojson
 */
export function findFeatureByName(name, geojson) {
  let ret = null
  _.each(geojson['features'], feature => {
    if (feature['properties']['name'] === name) {
      ret = feature
      return 0
    }
  })
  return ret
}

/**
 * 查询排口上游地块
 * @param {*} outfallFeature
 * @param {*} geojson
 * @param {*} cy
 * @param {*} subcatchmentNearestNodes
 */
export function getAncestorSubcatchmentsOfOutfall(outfallFeature, geojson, cy, subcatchmentNearestNodes) {
  if (outfallFeature['geometry']['type'] !== 'Point') {
    console.warn('输入的feature不合法：feature的类型应该为Point')
    return []
  }

  const outfallNode = cy.nodes(`[id="${outfallFeature.properties.name}"]`)

  // 得到排水口所有上游的检查井
  const allPredecessorNodes = outfallNode.predecessors().nodes()

  // 根据检查井得到对应的地块
  const ancestorSubcatchmentFeatures = []
  for (const subcatchmentName in subcatchmentNearestNodes) {
    if (allPredecessorNodes.filter(`[id="${subcatchmentNearestNodes[subcatchmentName]}"]`).length) {
      ancestorSubcatchmentFeatures.push(findFeatureByName(subcatchmentName, geojson))
    }
  }

  return ancestorSubcatchmentFeatures
}

/**
 * 计算无向线的角度。这个角度以css transform rotate里的值为标准。 范围为 +/- 90°
 * @param line [[x1, y1], [x2, y2]]
 */
export function calcLineRotateAngle(line) {
  const delta_x = line[1][0] - line[0][0]
  const delta_y = line[1][1] - line[0][1]
  if (!delta_x && delta_y > 0) {
    return 270
  }

  if (!delta_x && delta_y < 0) {
    return 90
  }

  return 360 - Math.atan(delta_y / delta_x) / Math.PI * 180
}

/**
 * 判断检查井是否在空间范围内
 * @param junctionShape 检查井shape元素
 * @param rangeShape 空间范围shape元素
 * @returns {boolean}
 */
export function isJunctionInRange(junctionShape, rangeShape) {
  const coordinate = junctionShape.properties.geometry.coordinates
  const point = new BMap.Point(coordinate[1], coordinate[0])

  const overlays = _.map(rangeShape.properties.geometry.coordinates[0], item => {
    return new BMap.Point(item[1] + 0.005363, item[0] - 0.00402) // 转换到百度地图的结果有偏移，这里做矫正。
  })
  return BMapLib.GeoUtils.isPointInPolygon(point, new BMap.Polygon(overlays))
}

/**
 * 判断排口是否在空间范围内
 * @param outfallShape
 * @param rangeShape
 * @returns {Boolean|*}
 */
export function isOutfallInRange(outfallShape, rangeShape) {
  const coordinate = outfallShape.properties.geometry.coordinates
  const point = new BMap.Point(coordinate[1], coordinate[0])

  const overlays = _.map(rangeShape.properties.geometry.coordinates[0], item => {
    return new BMap.Point(item[1] + 0.005363, item[0] - 0.00402) // 转换到百度地图的结果有偏移，这里做矫正。
  })
  return BMapLib.GeoUtils.isPointInPolygon(point, new BMap.Polygon(overlays))
}

/**
 * 判断地块是否在空间范围内
 * @param subcatchmentShape
 * @param rangeShape
 */
export function isSubcatchmentInRange(subcatchmentShape, rangeShape) {
  const reversedCoordinate = getCenterPointOfSubcatchment(subcatchmentShape.properties)
  const point = new BMap.Point(reversedCoordinate[0], reversedCoordinate[1])

  const overlays = _.map(rangeShape.properties.geometry.coordinates[0], item => {
    return new BMap.Point(item[1] + 0.005363, item[0] - 0.00402) // 转换到百度地图的结果有偏移，这里做矫正。
  })
  return BMapLib.GeoUtils.isPointInPolygon(point, new BMap.Polygon(overlays))
}

/**
 * 判断公司是否在空间范围内
 * @param companyShape
 * @param rangeShape
 */
export function isCompanyInRange(companyShape, rangeShape) {
  const reversedCoordinate = getCenterPointOfSubcatchment(companyShape.properties)
  const point = new BMap.Point(reversedCoordinate[0], reversedCoordinate[1])

  const overlays = _.map(rangeShape.properties.geometry.coordinates[0], item => {
    return new BMap.Point(item[1] + 0.005363, item[0] - 0.00402) // 转换到百度地图的结果有偏移，这里做矫正。
  })
  return BMapLib.GeoUtils.isPointInPolygon(point, new BMap.Polygon(overlays))
}

/**
 * 判断管线是否在空间范围内
 * @param conduitShape
 * @param rangeShape
 */
export function isConduitInRange(conduitShape, rangeShape) {
  const coordinate1 = conduitShape.properties.geometry.coordinates[0]
  const coordinate2 = conduitShape.properties.geometry.coordinates[1]
  const point1 = new BMap.Point(coordinate1[1], coordinate1[0])
  const point2 = new BMap.Point(coordinate2[1], coordinate2[0])

  const overlays = _.map(rangeShape.properties.geometry.coordinates[0], item => {
    return new BMap.Point(item[1] + 0.005363, item[0] - 0.00402) // 转换到百度地图的结果有偏移，这里做矫正。
  })
  return BMapLib.GeoUtils.isPointInPolygon(point1, new BMap.Polygon(overlays)) ||
    BMapLib.GeoUtils.isPointInPolygon(point2, new BMap.Polygon(overlays))
}
