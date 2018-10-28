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
 * TODO: 获取跟点最接近的检查井
 * @param {*} point 
 * @param {*} cy 
 */
export function getNearestNodeOfPoint(point, cy) {
  
}


export function getNodeSubcatchmentMap() {

}


/**
 * 查询地块下游管道
 */
export function getDescendantConduitsOfSubcatchment(feature, cy) {
  if(feature['geometry']['type'] !== 'Polygon') {
    console.warn('输入的feature不合法：feature的类型应该为Polygon')
    return []
  }
}

/**
 * 查询地块下游地块
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
}

/**
 * 查询排口上游管道
 */
export function getAncestorConduitsOfOutfall(feature, cy) {
  if(feature['geometry']['type'] !== 'Point') {
    console.warn('输入的feature不合法：feature的类型应该为Point')
    return []
  }
}

/**
 * 查询排口上游地块
 * 
 */
export function getAncestorSubcatchmentsOfOutfall(feature, cy, nodeSubcatchmentMap) {
  if(feature['geometry']['type'] !== 'Point') {
    console.warn('输入的feature不合法：feature的类型应该为Point')
    return []
  }

  let outfallNode = cy.elements(`node[id = "${feature['properties']['name']}"]`)
  console.log('outfallNode: ', outfallNode)

  // TODO: 得到排水口所有上游的检查井

  // TODO: 根据检查井得到对应的地块
}