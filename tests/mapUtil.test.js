const _ = require('lodash')
const fs = require('fs')
import {
  geojson2cytoscape,
  getDescendantConduitsOfSubcatchment,
  getDescendantSubcatchmentsOfSubcatchment,
  getDescendantOutfallsOfSubcatchment,
  getAncestorConduitsOfOutfall,
  getAncestorSubcatchmentsOfOutfall,
  calcAllSubcatchmentNearestNode,
  getNearestNodeOfPoint,
  calcLineRotateAngle
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
// fs.writeFileSync('/Users/apple/Desktop/文档/项目/深圳城市规划设计院/updis/tests/geojson.json',
//   JSON.stringify(geojson, null, 2))
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
      "properties": {
        "name": "01-02-1",
        "raingage": "1",
        "outlet": "Y-439",
        "area": "6.33",
        "Imperv": "20",
        "Width": "251.692",
        "Slope": "0.5",
        "CurbLen": "0"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              22.75725656957984,
              113.954869340079
            ],
            [
              22.757567230325527,
              113.95123079481344
            ],
            [
              22.755543650844004,
              113.95086342694627
            ],
            [
              22.755408670699993,
              113.95098523040976
            ],
            [
              22.755379373526942,
              113.95277850790993
            ],
            [
              22.755437632264467,
              113.95288180777337
            ],
            [
              22.75558805029761,
              113.95288980510661
            ],
            [
              22.75566725291926,
              113.95289778819553
            ],
            [
              22.75574550312752,
              113.95291325791513
            ],
            [
              22.755822225959715,
              113.9529360975505
            ],
            [
              22.75589681865052,
              113.95296612275145
            ],
            [
              22.75596871362076,
              113.9530030999181
            ],
            [
              22.75603736965497,
              113.9530467560795
            ],
            [
              22.75610225350911,
              113.95309675002977
            ],
            [
              22.75616287632223,
              113.95315271061956
            ],
            [
              22.756218766112003,
              113.95321419832081
            ],
            [
              22.75626950417956,
              113.95328074351983
            ],
            [
              22.756314707175907,
              113.95335184682448
            ],
            [
              22.756354008711412,
              113.95342695019983
            ],
            [
              22.756387131717798,
              113.95350548438226
            ],
            [
              22.7566293124962,
              113.95415314849059
            ],
            [
              22.756667577896884,
              113.95424540077755
            ],
            [
              22.756712090328314,
              113.9543342903209
            ],
            [
              22.75676260825992,
              113.95441930579749
            ],
            [
              22.756818855091293,
              113.95449998510745
            ],
            [
              22.75688049140439,
              113.95457585747803
            ],
            [
              22.7569471876512,
              113.95464651032498
            ],
            [
              22.757018551667176,
              113.95471153210681
            ],
            [
              22.7570941920979,
              113.95477055988985
            ],
            [
              22.757173682322946,
              113.9548232604972
            ],
            [
              22.75721512665293,
              113.95484630013463
            ],
            [
              22.75725656957984,
              113.954869340079
            ]
          ]
        ]
      },
      "businessType": "SUBCATCHMENTS"
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
    },
    businessType:'OUTFALLS'
  }
  //查找出地块最近的点
  let subcatchmentNearestNodes = calcAllSubcatchmentNearestNode(geojson, cy)
  let subcatchments = getAncestorSubcatchmentsOfOutfall(feature, geojson, cy, subcatchmentNearestNodes)
  console.log(subcatchmentNearestNodes);
})

test("测试calcLineRotateAngle", () => {
  console.log(calcLineRotateAngle([[0, 0], [1, 1]]))
  console.log(calcLineRotateAngle([[0, 0], [1, -1]]))
  console.log(calcLineRotateAngle([[0, 0], [0, 1]]))
  console.log(calcLineRotateAngle([[0, 0], [0, -1]]))
})

