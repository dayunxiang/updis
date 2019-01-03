import {
  calcAllSubcatchmentNearestNode,
  getAncestorConduitsOfOutfall,
  getAncestorSubcatchmentsOfOutfall,
  getNearestNodeOfPoint
} from '../src/utils/mapUtil'

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
  const geojsonMap = JSON.parse(fs.readFileSync('/Users/hm20160509/codes/1.working/updis/UpdisWeb/tests/data.json'))

  const geojson = {
    'type': 'FeatureCollection',
    'features': []
  }

  for (const layer in geojsonMap) {
    const newFeatures = JSON.parse(JSON.stringify(geojsonMap[layer]['features']))
    _.each(newFeatures, feature => {
      feature['businessType'] = layer
    })
    geojson['features'] = geojson['features'].concat(newFeatures)
  }
  return geojson
}

const geojson = loadGeoJSON()

const cy = mapUtil.geojson2cytoscape(geojson)
// console.log(cy)

// 计算id=3的点的
const desc = cy.nodes('node[id="3"]').successors().nodes('[businessType="JUNCTIONS"]')
console.log(desc)

const subcatchmentFeature = {
  'type': 'Feature',
  'id': '9',
  'geometry': {
    'type': 'Polygon',
    'coordinates': [
      [
        [
          104109.281,
          41395.625
        ],
        [
          104102.549,
          41397.303
        ],
        [
          104098.228,
          41398.363
        ],
        [
          104093.932,
          41399.402
        ],
        [
          104085.324,
          41401.448
        ],
        [
          104076.696,
          41403.448
        ],
        [
          104068.05,
          41405.406
        ],
        [
          104062.275,
          41406.69
        ],
        [
          104056.493,
          41407.956
        ],
        [
          104052.151,
          41408.896
        ],
        [
          104046.356,
          41410.134
        ],
        [
          104042.004,
          41411.054
        ],
        [
          104037.649,
          41411.965
        ],
        [
          104035.896,
          41412.328
        ],
        [
          104025.527,
          41404.251
        ],
        [
          104028.37,
          41403.671
        ],
        [
          104035.607,
          41402.175
        ],
        [
          104041.388,
          41400.964
        ],
        [
          104047.161,
          41399.738
        ],
        [
          104052.925,
          41398.498
        ],
        [
          104058.68,
          41397.242
        ],
        [
          104064.426,
          41395.97
        ],
        [
          104073.027,
          41394.029
        ],
        [
          104077.32,
          41393.043
        ],
        [
          104084.462,
          41391.377
        ],
        [
          104088.74,
          41390.363
        ],
        [
          104094.435,
          41388.993
        ],
        [
          104097.278,
          41388.301
        ],
        [
          104100.158,
          41387.593
        ],
        [
          104120.374,
          41382.451
        ],
        [
          104114.828,
          41389.038
        ],
        [
          104109.281,
          41395.625
        ]
      ]
    ]
  },
  'properties': {
    'name': '0',
    'raingage': '01-04-2',
    'Width': '20',
    'area': 'Y-197',
    'Slope': '29.382',
    'outlet': 'é¨éè®¡1',
    'CurbLen': '0.5',
    'Imperv': '0.09'
  }
}
const conduits = mapUtil.getDescendantConduitsOfSubcatchment(subcatchmentFeature, cy)
console.log('conduits: ', conduits)

const outfalls = mapUtil.getDescendantOutfallsOfSubcatchment(subcatchmentFeature, cy)
console.log('outfalls: ', outfalls)

// let outfallFeature = {
//   "type": "Feature",
//   "id": "0",
//   "geometry": {
//     "type": "Point",
//     "coordinates": [
//       100488.642,
//       42747.81
//     ]
//   },
//   "properties": {
//     "name": "HDOUT",
//     "Elevation": "8",
//     "Stage": "NO",
//     "Type": "FREE"
//   }
// }
//
// let point = [42746.952, 100546.398]
// let node = getNearestNodeOfPoint(point, cy)
//
// let conduits = getAncestorConduitsOfOutfall(outfallFeature, cy)
// let subcatchmentNearestNodes = calcAllSubcatchmentNearestNode(geojson, cy)
// let subcatchments = getAncestorSubcatchmentsOfOutfall(outfallFeature, geojson, cy, subcatchmentNearestNodes)
// console.log(conduits, subcatchments)
