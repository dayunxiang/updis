const _ = require('lodash')
const fs = require('fs')
const mapUtil = require('../src/utils/mapUtil')

function loadGeoJSON() {
  const geojsonMap = JSON.parse(fs.readFileSync('./20181026东坑水GIS.json', 'utf-8'))

  const geojson = {
    'type': 'FeatureCollection',
    'features': []
  }

  const map = {
    '东坑水地块信息': 'SUBCATCHMENTS',
    '东坑水排口': 'OUTFALLS',
    '污水-排口': 'OUTFALLS',
    '污水-检查井': 'JUNCTIONS',
    '雨水-排口': 'OUTFALLS',
    '雨水-检查井': 'JUNCTIONS',
    '雨水-管道': 'CONDUITS',
    '污水-管道': 'CONDUITS'
  }

  for (const layer in geojsonMap) {
    const newFeatures = JSON.parse(JSON.stringify(geojsonMap[layer]['features']))
    _.each(newFeatures, feature => {
      feature['businessType'] = map[layer]
    })
    geojson['features'] = geojson['features'].concat(newFeatures)
  }
  return geojson
}

const geojson = loadGeoJSON()
fs.writeFileSync(
  '/Users/hm20160509/codes/1.working/updis/UpdisWeb/tests/20181026东坑水GIS.sz.json',
  JSON.stringify(geojson, null, 2))
