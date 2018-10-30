const _ = require('lodash')
const fs = require('fs');
import {
    geojson2cytoscape,
    getDescendantConduitsOfSubcatchment,
    getDescendantSubcatchmentsOfSubcatchment,
    getDescendantOutfallsOfSubcatchment,
    getAncestorConduitsOfOutfall,
    getOutfallAncestorSubcatchments } from '../src/utils/mapUtil'


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
console.log(geojson)
fs.writeFileSync('/Users/haomo/codes/1.working/updis/UpdisWeb/tests/geojson.json',
    JSON.stringify(geojson, null, 2))

test("测试GeoJSON转Cytoscape对象", () => {
    console.log('测试开始')
    let cy = geojson2cytoscape(geojson)
    // console.log(cy)
    console.log(cy.nodes()[0].descendants())
    console.log('测试结束')
})


test("测试查询地块下游管道", () => {

})

test("测试查询地块下游排口", () => {

})

test("测试查询排口上游管道", () => {

})

test("测试查询排口上游地块", () => {

})
