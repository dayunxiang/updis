import cytoscape from 'cytoscape'
import _ from 'lodash'

const inside = require('point-in-polygon');

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
          businessType: feature['properties']['businessType'] || 'JUNCTIONS',
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
 * 获取地块的中心. TODO: 测试
 * @param {*} feature geojson里面对应的feature
 * @param {*} cy cytoscape对象
 */
export function getCenterPointOfSubcatchment(feature) {
  if(feature['geometry']['type'] !== 'Polygon') {
    console.warn('输入的feature不合法：feature的类型应该为Polygon')
    return []
  }

  var center = feature['geometry']['coordinates'][0].reduce(function (x,y) {
		return [x[0] + y[0]/coord.length, x[1] + y[1]/coord.length]
	}, [0,0])
	return center;
}


/**
 * 判断一个点是否在一个多边形内. TODO: 需要测试
 * @param {*} node cytoscape里的node对象
 * @param {*} feature geojson里的feature对象
 */
export function isNodeInPolygon(node, feature) {
  if(feature['geometry']['type'] !== 'Polygon') {
    console.warn('输入的feature不合法：feature的类型应该为Polygon')
    return []
  }

  return inside([node.position().x, node.position().y], feature['geometry']['coordinates'][0])
}


/**
 * 获取跟点最接近的检查井. TODO: 需要测试
 * @param {*} point [x, y] 格式的点
 * @param {*} cy
 */
export function getNearestNodeOfPoint(point, cy) {
  let minDistance = Infinity
  let nearestNode = null
  let nodeDistance = 0
  for(let i=0;i<cy.nodes().length;i++) {
    nodeDistance = (point[0]-cy.nodes()[i].position('x'))**2 + (point[1]-cy.nodes()[i].position('y'))**2
    if(nodeDistance < minDistance) {
      nearestNode = cy.nodes()[i]
    }
  }

  return nearestNode.data()
}


/**
 * 查询地块下游管道
 */
export function getDescendantConduitsOfSubcatchment(feature, cy) {
  if(feature['geometry']['type'] !== 'Polygon') {
    console.warn('输入的feature不合法：feature的类型应该为Polygon')
    return []
  }

  let subcatchmentCenterPoint = getCenterPointOfSubcatchment(feature)
  let nearestJunctionNode = getNearestNodeOfPoint(subcatchmentCenterPoint, cy)

  return _.map(nearestJunctionNode.successors().edges(), edge => {
    return edge.data()
  })
}

/**
 * TODO: 查询地块下游地块. 暂时不实现
 */
export function getDescendantSubcatchmentsOfSubcatchment(feature, cy) {
  if(feature['geometry']['type'] !== 'Polygon') {
    console.warn('输入的feature不合法：feature的类型应该为Polygon')
    return []
  }
}

/**
 * 查询地块下游排口
 */
export function getDescendantOutfallsOfSubcatchment(feature, cy) {
  if(feature['geometry']['type'] !== 'Polygon') {
    console.warn('输入的feature不合法：feature的类型应该为Polygon')
    return []
  }

  let subcatchmentCenterPoint = getCenterPointOfSubcatchment(feature)
  let nearestJunctionNode = getNearestNodeOfPoint(subcatchmentCenterPoint, cy)

  return _.map(nearestJunctionNode.successors().nodes('[businessType="OUTFALLS"]'), node => {
    return node.data()
  })
}

/**
 * 查询排口上游管道
 */
export function getAncestorConduitsOfOutfall(feature, cy) {
  if(feature['geometry']['type'] !== 'Point') {
    console.warn('输入的feature不合法：feature的类型应该为Point')
    return []
  }

  let outfallNode = cy.nodes(`[id="${feature.properties.name}"]`)

  return _.map(outfallNode.predecessors().edges(), edge => {
    return edge.data()
  })
}


/**
 * 计算得到所有地块最近点的字典. TODO: 还需要测试
 * @param geojson
 * @param cy
 */
export function calcAllSubcatchmentNearestNode(geojson, cy) {
  let allSubcatchments = _.reject(geojson['features'], feature => {
    return feature['geometry']['type'] !== 'Polygon'
  })

  let map = {}
  _.each(allSubcatchments, subcatchment => {
    let centerPoint = getCenterPointOfSubcatchment(subcatchment)
    map[subcatchment['properties']['name']] = getNearestNodeOfPoint(centerPoint, cy)['properties']['name']
  })

  return map
}


/**
 * 查询排口上游地块
 * @param {*} outfallFeature
 * @param {*} geojson
 * @param {*} cy
 * @param {*} nodeSubcatchmentMap
 */
export function getAncestorSubcatchmentsOfOutfall(outfallFeature, geojson, cy, nodeSubcatchmentMap) {
  if(feature['geometry']['type'] !== 'Point') {
    console.warn('输入的feature不合法：feature的类型应该为Point')
    return []
  }

  let outfallNode = cy.nodes(`[id="${feature.properties.name}"]`)

  // 得到排水口所有上游的检查井
  let allPredecessorNodes = outfallNode.predecessors().nodes()

  // TODO: 根据检查井得到对应的地块
}
