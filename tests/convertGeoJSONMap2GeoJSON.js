const _ = require('lodash')
const fs = require('fs')
const mapUtil = require('../src/utils/mapUtil')

function loadGeoJSON() {
    let geojsonMap = JSON.parse(fs.readFileSync('/Users/haomo/codes/1.working/updis/UpdisWeb/tests/data.json'));
  
    let geojson = {
      "type": "FeatureCollection",
      "features": []
    }
  
    for(let layer in geojsonMap) {
      let newFeatures = JSON.parse(JSON.stringify(geojsonMap[layer]['features']))
      _.each(newFeatures, feature => {
        feature['businessType'] = layer
      })
      geojson['features'] = geojson['features'].concat(newFeatures)
    }
    return geojson
  }