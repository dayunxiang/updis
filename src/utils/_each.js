export default function _each(object, callback) {
  var type = (function() {
    switch (object.constructor) {
      case Object:
        return 'Object'
        break
      case Array:
        return 'Array'
        break
      case NodeList:
        return 'NodeList'
        break
      default:
        return 'null'
        break
    }
  })()
  if (type === 'Array' || type === 'NodeList') {
    // 由于存在类数组NodeList, 所以不能直接调用every方法
    [].every.call(object, function(v, i) {
      return callback.call(v, i, v) !== false
    })
  }
  // 为对象格式时,返回:key, value
  else if (type === 'Object') {
    for (var i in object) {
      if (callback.call(object[i], i, object[i]) === false) {
        break
      }
    }
  }
}
