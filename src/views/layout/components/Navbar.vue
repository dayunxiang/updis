<template>
  <el-menu class="navbar" mode="horizontal">
    <!--<hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>-->

    <breadcrumb class="breadcrumb-container"></breadcrumb>

    <div class="right-menu">
      <!--<error-log class="errLog-container right-menu-item"></error-log>-->

      <!--<el-badge is-dot class="item">-->
        <!--<el-tooltip effect="dark" content="消息提醒" placement="bottom">-->
          <!--<Reminders class="screenfull right-menu-item"></Reminders>-->
        <!--</el-tooltip>-->
      <!--</el-badge>-->

      <!--<el-tooltip effect="dark" :content="$t('navbar.screenfull')" placement="bottom">-->
        <!--<screenfull class="screenfull right-menu-item"></screenfull>-->
      <!--</el-tooltip>-->

      <!--<lang-select class="international right-menu-item"></lang-select>-->

      <!--<el-tooltip effect="dark" :content="$t('navbar.theme')" placement="bottom">-->
        <!--<theme-picker class="theme-switch right-menu-item"></theme-picker>-->
      <!--</el-tooltip>-->

      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
          <!--<img class="user-avatar" src="../../../assets/img/ys-log.png">-->
          <!--<i class="el-icon-star-off" style="font-size: 26px"></i>-->
          <span>{{ userName }}</span>
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <!--<router-link to="/">-->
            <!--<el-dropdown-item>-->
              <!--{{$t('navbar.dashboard')}}-->
            <!--</el-dropdown-item>-->
          <!--</router-link>-->
          <!--<a ><el-dropdown-item class="onclick">全屏-->
            <!--<screenfull class="strong screenfull right-menu-item"></screenfull></el-dropdown-item>-->
          <!--</a>-->

          <!--<a ><el-dropdown-item class="onclick">换肤-->
            <!--<theme-picker class="strong theme-switch right-menu-item"></theme-picker></el-dropdown-item>-->
          <!--</a>-->
          <!--<router-link to="/personalCenter">-->
            <!--<el-dropdown-item>-->
              <!--个人中心-->
            <!--</el-dropdown-item>-->
          <!--</router-link>-->
          <!-- <a target='_blank' href="https://github.com/PanJiaChen/vue-element-admin/">
            <el-dropdown-item>
              {{$t('navbar.github')}}
            </el-dropdown-item>
          </a> -->
          <el-dropdown-item>
            <span @click="logout" style="display:block;">{{$t('navbar.logOut')}}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import { getCookie } from '@/utils'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import Reminders from '@/components/Reminders'
import LangSelect from '@/components/LangSelect'
import ThemePicker from '@/components/ThemePicker'
import commonApi from '../../../../src/api/commonApi'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    Reminders,
    LangSelect,
    ThemePicker
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'avatar'
    ])
  },
  data() {
    return {
      userName: ''
    }
  },
  created() {
    const self = this
    commonApi.getRegisterInfo().then(function(res) {
      self.userName = res.data[0].includes.hm_user.username
    })
    self.stomp()
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        sessionStorage.removeItem('userInfo')
        var exp = new Date()
        exp.setTime(exp.getTime() - 1)
        var loginForm = getCookie('loginForm')
        var username = getCookie('username')
        var password = getCookie('password')
        if (loginForm !== null) {
          document.cookie = 'loginForm=' + loginForm + ';expires=' + exp.toGMTString()
        }
        if (username !== null) {
          document.cookie = 'username=' + username + ';expires=' + exp.toGMTString()
        }
        if (password !== null) {
          document.cookie = 'password=' + password + ';expires=' + exp.toGMTString()
        }
        location.reload()// In order to re-instantiate the vue-router object to avoid bugs
      })
    },
    /**
     * 提示信息 点击可跳转
     */
    message(e, data) {
      const jump = function() {
        this.closed = true
        e.$router.push({ name: 'loading' })
        setTimeout(function() {
          e.$router.push({ name: data.params.name, params: data.params.data })
        }, 100)
        // 你要跳转的路由 还可以传参 当然也可以通过其他方式跳转
      }
      this.$notify({
        title: data.title,
        message: data.message,
        duration: 0,
        onClick: jump,
        params: data.params
      })
    },
    /**
     * 消息提醒
     */
    stomp() {


    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container{
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    float: right;
    height: 100%;
    &:focus{
     outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .screenfull {
      height: 20px;
    }
    .international{
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      height: 50px;
      margin-right: 30px;
      .avatar-wrapper {
        cursor: pointer;
        margin-top: 5px;
        position: relative;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
.onclick{
  display: block;
  position: relative;
  line-height: 30px;
  padding: 0 17px;
  font-size: 14px;
  .strong{
    position: absolute;
    top: 0;
    left: 17px;
    height: 100%;
    width: 100%;
    opacity: 0;
  }
}
</style>
