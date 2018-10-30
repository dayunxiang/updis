const _ = require('lodash')
const fs = require('fs')
const mapUtil = require('../src/utils/mapUtil')
// const geojson2cytoscape
//   getDescendantConduitsOfSubcatchment,
//   getDescendantSubcatchmentsOfSubcatchment,
//   getDescendantOutfallsOfSubcatchment,
//   getAncestorConduitsOfOutfall,
//   getOutfallAncestorSubcatchments } from '../src/utils/mapUtil'

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

let geojson = loadGeoJSON()

let cy = mapUtil.geojson2cytoscape(geojson)
// console.log(cy)

// 计算id=3的点的
let desc = cy.nodes('node[id="3"]').successors().nodes('[businessType="JUNCTIONS"]')

console.log(desc)

