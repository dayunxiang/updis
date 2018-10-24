import request from '@/utils/request'
import requestjrs from '@/utils/request_jrs'
import requestcrawling from '@/utils/request_crawling'
import requestAuth from '@/utils/request_auth'
import _ from 'lodash'

const commonApi = {}

/**
 * 新建一条信息
 * @param tableName：表名
 * @param params：参数
 */
commonApi.create = function(tableName, params, requestHeaders) {
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
  }
  return request(tableName + '/new', {
    method: 'post',
    headers: requestHeaders ? _.merge(headers, requestHeaders) : headers,
    data: params,
    transformRequest: function(obj) {
      var str = []
      // 删除空值的属性
      obj = _.omitBy(obj, function(value) {
        // return !value
        return value === null
      })
      for (var p in obj) {
        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
      }
      console.debug(str.join('&'))
      return str.join('&')
    }
  })
}

/**
 * 新建一条信息
 * @param url：url
 * @param params：参数
 */
commonApi.jrsPost = function(url, params) {
  return requestjrs(url, {
    method: 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    data: params,
    transformRequest: function(obj) {
      var str = []
      // 删除空值的属性
      obj = _.omitBy(obj, function(value) {
        return !value
      })
      for (var p in obj) {
        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
      }
      return str.join('&')
    }
  })
}
/**
 * 删除一条信息
 */
commonApi.delete = function(tableName, id, requestHeaders) {
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
  }
  return request(tableName + '/' + id + '/delete', {
    method: 'post',
    headers: requestHeaders ? _.merge(headers, requestHeaders) : headers,
    transformRequest: function(obj) {
      var str = []
      // 删除空值的属性
      obj = _.omitBy(obj, function(value) {
        return !value
      })
      for (var p in obj) {
        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
      }
      return str.join('&')
    }
  })
}
/**
 * 批量删除信息
 */
commonApi.batchDelete = function(tableName, ids, requestHeaders) {
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
  }
  return request(tableName + '/delete/batch', {
    method: 'post',
    headers: requestHeaders ? _.merge(headers, requestHeaders) : headers,
    data: { ids: JSON.stringify(ids) },
    transformRequest: function(obj) {
      var str = []
      // 删除空值的属性
      obj = _.omitBy(obj, function(value) {
        return !value
      })
      for (var p in obj) {
        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
      }
      return str.join('&')
    }
  })
}
// 过滤
commonApi.getAll = function(tableName, params) {
  return request(tableName, {
    method: 'get',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    params: params,
    transformRequest: function(obj) {
      var str = []
      // 删除空值的属性
      obj = _.omitBy(obj, function(value) {
        return !value
      })
      for (var p in obj) {
        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
      }
      return str.join('&')
    }
  })
}
/**
 * 编辑一条信息
 * @param tableName：表名
 * @param id：这一条记录的id
 * @param params：参数
 */
commonApi.edit = function(tableName, id, params, requestHeaders) {
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
  }
  return request(tableName + '/' + id + '/edit?', {
    method: 'post',
    headers: requestHeaders ? _.merge(headers, requestHeaders) : headers,
    data: params,
    transformRequest: function(obj) {
      var str = []
      // 删除空值的属性
      obj = _.omitBy(obj, function(value) {
        // return !value
        return value === null
      })
      for (var p in obj) {
        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
      }
      return str.join('&')
    }
  })
}

/**
 * 公文流转签批公文获取上级领导
 * @param roleName
 * @param departmentId
 * @returns {Promise}
 * @desc 科员-->部门负责人-->主管院领导-->常务副检察长-->检察长
 */
commonApi.getLeader = function(roleName, departmentId) {
  if (roleName === '部门负责人') {
    return new Promise(function(resolve, reject) {
      requestAuth('roles', {
        params: {
          filters: {
            'role': {
              'name': {
                equalTo: '主管院领导'
              }
            }
          }
        }
      }).then(function(roleRes) {
        requestAuth('hm_users', {
          params: {
            filters: {
              'hm_user': {
                'role_id': {
                  equalTo: roleRes.data[0].id
                }
              }
            }
          }
        }).then(function(userRes) {
          resolve(userRes.data[0])
        })
      })
    })
  } else if (roleName === '主管院领导') {
    return new Promise(function(resolve, reject) {
      requestAuth('roles', {
        params: {
          filters: {
            'role': {
              'name': {
                equalTo: '常务副检察长'
              }
            }
          }
        }
      }).then(function(roleRes) {
        requestAuth('hm_users', {
          params: {
            filters: {
              'hm_user': {
                'role_id': {
                  equalTo: roleRes.data[0].id
                }
              }
            }
          }
        }).then(function(userRes) {
          resolve(userRes.data[0])
        })
      })
    })
  } else if (roleName === '常务副检察长') {
    return new Promise(function(resolve, reject) {
      requestAuth('roles', {
        params: {
          filters: {
            'role': {
              'name': {
                equalTo: '检察长'
              }
            }
          }
        }
      }).then(function(roleRes) {
        requestAuth('hm_users', {
          params: {
            filters: {
              'hm_user': {
                'role_id': {
                  equalTo: roleRes.data[0].id
                }
              }
            }
          }
        }).then(function(userRes) {
          resolve(userRes.data[0])
        })
      })
    })
  } else {
    return new Promise(function(resolve, reject) {
      requestAuth('hm_users', {
        params: {
          filters: {
            'hm_user': {
              'department_id': {
                equalTo: departmentId
              }
            }
          },
          includes: {
            'role': {
              includes: ['role_id']
            }
          }
        }
      }).then(function(res) {
        let person = {}
        _.each(res.data, function(item) {
          if (item.includes.role && item.includes.role.name === '部门负责人') {
            person = item.superior
          }
        })
        resolve(person)
      })
    })
  }
}

/**
 * 获取用户角色
 */
commonApi.getUserRole = function(roleId) {
  return requestAuth('roles', {
    params: {
      filters: {
        'role': {
          'id': {
            equalTo: roleId
          }
        }
      }
    }
  })
}
/**
 * 获取用户部门
 */
commonApi.getUserDepartment = function(department_id) {
  return requestAuth('departments', {
    params: {
      filters: {
        'department': {
          'id': {
            equalTo: department_id
          }
        }
      }
    }
  })
}
/**
 * 获取字段列表
 */
commonApi.getHmDicts = function(type, department_id) {
  return requestAuth('hm_dicts', {
    params: {
      filters: {
        'hm_dict': {
          'type': { equalTo: '部门类型' },
          'key': { equalTo: department_id }
        }
      }
    }
  })
}
// commonApi.getLeader = function(userId) {
//   if (userId) {
//     return request('get_person_in_charge', {
//       params: {
//         userId: userId
//       }
//     })
//   } else {
//     return commonApi.getCurrentUserIdTotoken().then(function(tokenRes) {
//       return request('get_person_in_charge', {
//         params: {
//           userId: tokenRes.data[0].userId
//         }
//       })
//     })
//   }
// }

/**
 * 调用tentop服务器登录接口，获取cookie
 */
commonApi.getCookie = function(url, username, password, email) {
  return requestcrawling(url, {
    params: {
      username: username,
      password: password,
      email: email
    }
  })
}

/**
 * 获取当前用户id，根据token
 */
// commonApi.getCurrentUserIdTotoken = function() {
//   return request('cc_tokens', {
//     params: {
//       filters: {
//         'cc_token': {
//           'tokens': {
//             equalTo: localStorage.getItem('token')
//           }
//         }
//       }
//     }
//   })
// }

/**
 * 获取用户信息
 * @param userId: 用户Id
 */
// commonApi.getUserInfo = function(userId) {
//   if (userId) {
//     return request('cc_users', {
//       params: {
//         filters: {
//           'cc_user': {
//             id: {
//               equalTo: userId
//             }
//           }
//         },
//         includes: {
//           'cc_department': {
//             includes: ['department_logo']
//           }
//         }
//       }
//     })
//   } else {
//     return commonApi.getCurrentUserIdTotoken().then(function(tokenRes) {
//       return request('cc_users', {
//         params: {
//           filters: {
//             'cc_user': {
//               id: {
//                 equalTo: tokenRes.data[0].userId
//               }
//             }
//           },
//           includes: {
//             'cc_department': {
//               includes: ['department_logo']
//             }
//           }
//         }
//       })
//     })
//   }
// }

/*
* 获取组织，部门，人员
* */
commonApi.getDepartment = function() {
  return requestAuth('departments', {
    params: {
      filters: {},
      includes: {
        'organization': {
          includes: ['organization_id']
        }
      },
      refers: {
        'hm_user': {
          includes: ['department_id']
        }
      }
    }
  })
}
/*
*通过token查询登录人信息
* */
commonApi.getRegisterInfo = function() {
  return requestAuth('auth_tokens', {
    params: {
      includes: {
        'hm_user': {
          includes: ['user_id']
        }
      },
      filters: {
        'auth_token': {
          'token': {
            equalTo: getCookie('Admin-Token')
          }
        }
      }
    }
  })
}

/*
*新接口通过token查询登录人信息
* */
commonApi.getNewRegisterInfo = function() {
  return request('auth_tokens', {
    params: {
      includes: {
        'hm_user': {
          includes: ['user_id']
        }
      },
      filters: {
        'auth_token': {
          'token': {
            equalTo: getCookie('Admin-Token')
          }
        }
      }
    }
  })
}
/*
* 获取角色对应的菜单
* params id 角色ID
*/
commonApi.getRole = function(id) {
  return requestAuth('role_menus', {
    params: {
      pageSize: 10000,
      includes: {
        'menu': {
          includes: ['menu_id']
        }
      },
      filters: {
        'role_menu': {
          'role_id': {
            equalTo: id
          }
        }
      }
    }
  })
}

/*
* 获取本地的token
* */

function getCookie(cname) {
  var name = cname + '='
  var ca = document.cookie.split(';')
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i]
    while (c.charAt(0) === ' ') c = c.substring(1)
    if (c.indexOf(name) !== -1) return c.substring(name.length, c.length)
  }
  return ''
}

/*
* 根据用户id获取用户信息
* */
commonApi.getUserDetail = function(userId) {
  return requestAuth('hm_users/' + userId, {
    headers: { 'X-Auth-Token': getCookie('Admin-Token') }
  })
}

/**
 * 获取用户详细信息，包括角色及部门
 */
commonApi.getUserInfo = function(userId) {
  return requestAuth('hm_users', {
    params: {
      includes: {
        'role': {
          includes: ['role_id']
        },
        'department': {
          includes: ['department_id']
        }
      },
      filters: {
        'hm_user': {
          'id': {
            equalTo: userId
          }
        }
      }
    }
  })
}

/**
* 获取用户表中所有人员
* */
commonApi.getAllUers = function() {
  return requestAuth('hm_users', {
    params: {
      pageNo: 1,
      pageSize: 1000
    }
  })
}

/**
 * 发起视频会议预约任务
 */
commonApi.orderVideo = function(appointment_time, join_people, room_number) {
  return request('/socketMeetingReminding ', {
    method: 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    data: {
      appointment_time,
      join_people,
      room_number
    },
    transformRequest: function(obj) {
      var str = []
      // 删除空值的属性
      obj = _.omitBy(obj, function(value) {
        return !value
      })
      for (var p in obj) {
        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
      }
      return str.join('&')
    }
  })
}

/**
 * 通过部门id，获取人员部门树形结构
 */
commonApi.getTree = function(params) {
  return request('return_department_people', {
    method: 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    data: {
      departmentId: params
    },
    transformRequest: function(obj) {
      var str = []
      // 删除空值的属性
      obj = _.omitBy(obj, function(value) {
        // return !value
        return value === null
      })
      for (var p in obj) {
        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
      }
      return str.join('&')
    }
  })
}
/**
 * 获取树形结构
 */
commonApi.toTree = function(data, id, parentId) {
  data.forEach(function(item) {
    delete item.children
  })
  var map = {}
  data.forEach(function(item) {
    map[item[id]] = item
  })
  var val = []
  data.forEach(function(item) {
    var parent = map[item[parentId]]
    if (parent) {
      (parent.children || (parent.children = [])).push(item)
    } else {
      val.push(item)
    }
  })
  return val
}

/**
 * 发送消息提醒
 * @param loginId 接收人登录名
 * @param data 接收数据
 */
commonApi.webSocket = function(loginId, data) {
  var Stomp = require('stompjs')
  var ws = new WebSocket('ws://tentop.com.cn:15674/ws')
  var client = Stomp.over(ws)
  var on_connect = function() {
    console.log('connected')
    // data.body是接收到的数据
    client.send(
      '/queue/' + loginId,
      {
        'content-type': 'text/plain'
      },
      JSON.stringify(data)
    )
    client.disconnect(function() {
      console.log('See you next time!')
    })
  }
  var on_error = function() {
    console.log('error')
    commonApi.webSocket(loginId, data)
  }
  client.connect('guest', 'guest', on_connect, on_error, '/')
}

export default commonApi
