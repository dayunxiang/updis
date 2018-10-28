import cytoscape from 'cytoscape'
import _ from 'lodash'

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
 */
export function getOutfallAncestorSubcatchments(feature, cy) {
  if(feature['geometry']['type'] !== 'Point') {
    console.warn('输入的feature不合法：feature的类型应该为Point')
    return []
  }
}