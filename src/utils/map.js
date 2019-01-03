/**
 * 计算多边形面积
 * @param polygon
 * @returns {number}
 */
export function getArea(polygon) {
  // 检查类型：既不是百度类型的范围又不是数组类型的数据，直接返回0
  if (!(polygon instanceof BMap.Polygon) && !(polygon instanceof Array)) {
    return 0
  }

  // 如果是百度类型的，得到点集合，不是的话，另说。
  var pts = new Array()
  if (polygon instanceof BMap.Polygon) {
    pts = polygon.getPath()
  }

  // 判断数组的长度，如果是小于3的话，不构成面，无法计算面积
  if (pts.length < 3) {
    return 0
  }

  var totalArea = 0// 初始化总面积
  var LowX = 0.0
  var LowY = 0.0
  var MiddleX = 0.0
  var MiddleY = 0.0
  var HighX = 0.0
  var HighY = 0.0
  var AM = 0.0
  var BM = 0.0
  var CM = 0.0
  var AL = 0.0
  var BL = 0.0
  var CL = 0.0
  var AH = 0.0
  var BH = 0.0
  var CH = 0.0
  var CoefficientL = 0.0
  var CoefficientH = 0.0
  var ALtangent = 0.0
  var BLtangent = 0.0
  var CLtangent = 0.0
  var AHtangent = 0.0
  var BHtangent = 0.0
  var CHtangent = 0.0
  var ANormalLine = 0.0
  var BNormalLine = 0.0
  var CNormalLine = 0.0
  var OrientationValue = 0.0
  var AngleCos = 0.0
  var Sum1 = 0.0
  var Sum2 = 0.0
  var Count2 = 0
  var Count1 = 0
  var Sum = 0.0
  var Radius = 6378137.0// ,WGS84椭球半径
  var Count = pts.length
  for (var i = 0; i < Count; i++) {
    if (i == 0) {
      LowX = pts[Count - 1].lng * Math.PI / 180
      LowY = pts[Count - 1].lat * Math.PI / 180
      MiddleX = pts[0].lng * Math.PI / 180
      MiddleY = pts[0].lat * Math.PI / 180
      HighX = pts[1].lng * Math.PI / 180
      HighY = pts[1].lat * Math.PI / 180
    } else if (i == Count - 1) {
      LowX = pts[Count - 2].lng * Math.PI / 180
      LowY = pts[Count - 2].lat * Math.PI / 180
      MiddleX = pts[Count - 1].lng * Math.PI / 180
      MiddleY = pts[Count - 1].lat * Math.PI / 180
      HighX = pts[0].lng * Math.PI / 180
      HighY = pts[0].lat * Math.PI / 180
    } else {
      LowX = pts[i - 1].lng * Math.PI / 180
      LowY = pts[i - 1].lat * Math.PI / 180
      MiddleX = pts[i].lng * Math.PI / 180
      MiddleY = pts[i].lat * Math.PI / 180
      HighX = pts[i + 1].lng * Math.PI / 180
      HighY = pts[i + 1].lat * Math.PI / 180
    }
    AM = Math.cos(MiddleY) * Math.cos(MiddleX)
    BM = Math.cos(MiddleY) * Math.sin(MiddleX)
    CM = Math.sin(MiddleY)
    AL = Math.cos(LowY) * Math.cos(LowX)
    BL = Math.cos(LowY) * Math.sin(LowX)
    CL = Math.sin(LowY)
    AH = Math.cos(HighY) * Math.cos(HighX)
    BH = Math.cos(HighY) * Math.sin(HighX)
    CH = Math.sin(HighY)
    CoefficientL = (AM * AM + BM * BM + CM * CM) / (AM * AL + BM * BL + CM * CL)
    CoefficientH = (AM * AM + BM * BM + CM * CM) / (AM * AH + BM * BH + CM * CH)
    ALtangent = CoefficientL * AL - AM
    BLtangent = CoefficientL * BL - BM
    CLtangent = CoefficientL * CL - CM
    AHtangent = CoefficientH * AH - AM
    BHtangent = CoefficientH * BH - BM
    CHtangent = CoefficientH * CH - CM
    AngleCos = (AHtangent * ALtangent + BHtangent * BLtangent + CHtangent * CLtangent) / (Math.sqrt(AHtangent * AHtangent + BHtangent * BHtangent + CHtangent * CHtangent) * Math.sqrt(ALtangent * ALtangent + BLtangent * BLtangent + CLtangent * CLtangent))
    AngleCos = Math.acos(AngleCos)
    ANormalLine = BHtangent * CLtangent - CHtangent * BLtangent
    BNormalLine = 0 - (AHtangent * CLtangent - CHtangent * ALtangent)
    CNormalLine = AHtangent * BLtangent - BHtangent * ALtangent
    if (AM != 0) { OrientationValue = ANormalLine / AM } else if (BM != 0) { OrientationValue = BNormalLine / BM } else { OrientationValue = CNormalLine / CM }
    if (OrientationValue > 0) {
      Sum1 += AngleCos
      Count1++
    } else {
      Sum2 += AngleCos
      Count2++
    }
  }

  var tempSum1, tempSum2
  tempSum1 = Sum1 + (2 * Math.PI * Count2 - Sum2)
  tempSum2 = (2 * Math.PI * Count1 - Sum1) + Sum2
  if (Sum1 > Sum2) {
    if ((tempSum1 - (Count - 2) * Math.PI) < 1) { Sum = tempSum1 } else { Sum = tempSum2 }
  } else {
    if ((tempSum2 - (Count - 2) * Math.PI) < 1) { Sum = tempSum2 } else { Sum = tempSum1 }
  }
  totalArea = (Sum - (Count - 2) * Math.PI) * Radius * Radius

  return totalArea // 返回总面积
}
