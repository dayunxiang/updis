/*
* id 菜单主键id
*  parentColumn 父级字段
*/
export function toTree(data, parentColumn) {
  data.forEach(function(item) {
    delete item.children
  })
  var map = {}
  data.forEach(function(item) {
    map[item.id] = item
  })
  var val = []
  data.forEach(function(item) {
    var parent = map[item[parentColumn]]
    if (parent) {
      (parent.children || (parent.children = [])).push(item)
    } else {
      val.push(item)
    }
  })
  return val
}
