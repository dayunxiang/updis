import { param2Obj } from '@/utils'
import _ from 'lodash'
let userMap = {}

export default {
  loginByUsername: config => {
    const { username } = JSON.parse(config.body)
    const userInfo = JSON.parse(config.body)
    userMap[userInfo.username] = {
      roles: [userInfo.username],
      token: userInfo.token,
      introduction: '我是' + userInfo.username,
      avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      name: userInfo.username
    }
    window.localStorage.setItem('userInfo', JSON.stringify(userMap))
    return userMap[username]
  },
  getUserInfo: config => {
    const { token } = param2Obj(config.url)
    let userInfo = {}
    if (window.localStorage.getItem('userInfo')) {
      userMap = JSON.parse(window.localStorage.getItem('userInfo'))
    }
    _.forEach(userMap, function(value, key) {
      if (token === value.token) {
        userInfo = value
      }
    })
    if (userInfo && userInfo.token) {
      return userInfo
    } else {
      return false
    }
  },
  logout: () => 'success'
}
