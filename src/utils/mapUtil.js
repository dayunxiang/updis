import cytoscape from 'cytoscape'
import _ from 'lodash'

/**
 * 将GeoJSON转换为cytoscape的拓扑
 * @param geojson
 */

export default function geojson2cytoscape(geojson) {
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

