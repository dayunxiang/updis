const _ = require('lodash')
const fs = require('fs')
import {
  geojson2cytoscape,
  getDescendantConduitsOfSubcatchment,
  getDescendantSubcatchmentsOfSubcatchment,
  getDescendantOutfallsOfSubcatchment,
  getAncestorConduitsOfOutfall,
  getAncestorSubcatchmentsOfOutfall,
  calcAllSubcatchmentNearestNode
} from '../src/utils/mapUtil'


function loadGeoJSON() {
  let geojsonMap = JSON.parse(fs.readFileSync('/Users/apple/Desktop/文档/项目/深圳城市规划设计院/updis/tests/data.json'))

  let geojson = {
    "type": "FeatureCollection",
    "features": []
  }

  for (let layer in geojsonMap) {
    let newFeatures = JSON.parse(JSON.stringify(geojsonMap[layer]['features']))
    _.each(newFeatures, feature => {
      feature['businessType'] = layer
    })
    geojson['features'] = geojson['features'].concat(newFeatures)
  }
  return geojson
}


let geojson = loadGeoJSON()
// console.log(geojson)
fs.writeFileSync('/Users/apple/Desktop/文档/项目/深圳城市规划设计院/updis/tests/geojson.json',
  JSON.stringify(geojson, null, 2))
let cy = geojson2cytoscape(geojson)

test("测试GeoJSON转Cytoscape对象", () => {
  console.log('测试开始')
  console.log('测试结束')
})


test("测试查询地块下游管道", () => {
  let feature = {
    "type": "Feature",
    "id": "5",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            104011.75,
            41407.034
          ],
          [
            104008.003,
            41407.788
          ],
          [
            103985.798,
            41412.075
          ],
          [
            103980.302,
            41413.122
          ],
          [
            103974.444,
            41414.23
          ],
          [
            103970.045,
            41415.057
          ],
          [
            103964.175,
            41416.156
          ],
          [
            103956.829,
            41417.525
          ],
          [
            103948.001,
            41419.16
          ],
          [
            103937.686,
            41421.063
          ],
          [
            103912.591,
            41425.678
          ],
          [
            103911.655,
            41425.851
          ],
          [
            103904.555,
            41317.523
          ],
          [
            103960.838,
            41313.834
          ],
          [
            103953.767,
            41238.263
          ],
          [
            103988.67,
            41234.997
          ],
          [
            104005.054,
            41249.296
          ],
          [
            104011.332,
            41397.175
          ],
          [
            104011.75,
            41407.034
          ]
        ]
      ]
    },
    "properties": {
      "name": "01-02-3",
      "raingage": "2",
      "Width": "118.",
      "area": "6                                   1.41",
      "Slope": "723                                 0.5",
      "outlet": "Y-19",
      "CurbLen": "0",
      "Imperv": "75"
    }
  }
  let conduits = getDescendantConduitsOfSubcatchment(feature, cy)
})

test("测试查询地块下游排口", () => {
  let feature = {
    "type": "Feature",
    "id": "3",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            104396.999,
            42470.347
          ],
          [
            104023.43,
            42511.529
          ],
          [
            103982.153,
            42286.144
          ],
          [
            103994.441,
            42270.864
          ],
          [
            104178.775,
            42264.412
          ],
          [
            104189.498,
            42270.73
          ],
          [
            104190.583,
            42287.503
          ],
          [
            104191.542,
            42296.329
          ],
          [
            104193.269,
            42305.036
          ],
          [
            104195.751,
            42313.56
          ],
          [
            104198.968,
            42321.834
          ],
          [
            104202.895,
            42329.795
          ],
          [
            104207.503,
            42337.383
          ],
          [
            104212.756,
            42344.539
          ],
          [
            104218.615,
            42351.209
          ],
          [
            104225.034,
            42357.341
          ],
          [
            104231.964,
            42362.889
          ],
          [
            104239.353,
            42367.811
          ],
          [
            104247.143,
            42372.067
          ],
          [
            104255.275,
            42375.627
          ],
          [
            104322.284,
            42401.529
          ],
          [
            104331.835,
            42405.64
          ],
          [
            104341.051,
            42410.455
          ],
          [
            104349.879,
            42415.948
          ],
          [
            104358.271,
            42422.089
          ],
          [
            104366.178,
            42428.841
          ],
          [
            104373.557,
            42436.168
          ],
          [
            104380.365,
            42444.027
          ],
          [
            104386.564,
            42452.375
          ],
          [
            104392.119,
            42461.165
          ],
          [
            104394.559,
            42465.756
          ],
          [
            104396.999,
            42470.347
          ]
        ]
      ]
    },
    "properties": {
      "name": "01-02-1",
      "raingage": "1",
      "Width": "251.692",
      "area": "6.33",
      "Slope": "0.5",
      "outlet": "Y-439",
      "CurbLen": "0",
      "Imperv": "20"
    }
  }

  let outfalls = getDescendantOutfallsOfSubcatchment(feature, cy)
  console.log(outfalls);
})

test("测试查询排口上游管道", () => {
  let feature = {
      "type": "Feature",
      "properties": {
        "name": "WSCLC",
        "Elevation": "9",
        "Type": "FREE",
        "Stage": "NO"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          22.760309343371674,
          113.91681078161338
        ]
      }
    }
  let conduits = getAncestorConduitsOfOutfall(feature, cy)
  console.log(conduits)
})

test("测试查询排口上游地块", () => {
  let feature = {
    "type": "Feature",
    "properties": {
      "name": "WSCLC",
      "Elevation": "9",
      "Type": "FREE",
      "Stage": "NO"
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        22.760309343371674,
        113.91681078161338
      ]
    }
  }

  let subcatchmentNearestNodes = calcAllSubcatchmentNearestNode(geojson, cy)
  let subcatchments = getAncestorSubcatchmentsOfOutfall(feature, geojson, cy, subcatchmentNearestNodes)
  console.log(geojson);
})
