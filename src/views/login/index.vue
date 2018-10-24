<template>
  <div class='login-container'>
    <div style='display: inline-block;margin-left: 30px;margin-top: 30px;'>
    </div>
    <el-form class='login-form' autoComplete='on' :model='loginForm' :rules='loginRules' ref='loginForm' label-position='left'>
      <div class='title-container'>
        <div class='title'>
          <div style='display: inline-block;margin:0 auto;'>
            <span style='font-family: PingFangSC-Semibold;font-size: 50px;color: #FFFFFF;letter-spacing: 0;vertical-align: sub;font-weight: normal;'>后台管理</span>
          </div>
        </div>
      </div>
      <el-form-item prop='loginId' style="margin-bottom: 22px;">
        <span class='svg-container svg-container_login'>
          <svg-icon icon-class='user' />
        </span>
        <el-input name='loginId' type='text' @keyup.enter.native='handleLogin' v-model='loginForm.loginId' autoComplete='on' placeholder='username' />
      </el-form-item>

      <el-form-item prop='password' style="margin-bottom: 5px;">
        <span class='svg-container'>
          <svg-icon icon-class='password' />
        </span>
        <el-input name='password' :type='passwordType' @keyup.enter.native='handleLogin' v-model='loginForm.password' autoComplete='on' placeholder='password' />
        <span class='show-pwd' @click='showPwd'>
          <svg-icon icon-class='eye' v-if="!ispassword"/>
          <i class='el-icon-view' v-if="ispassword"/>
        </span>
      </el-form-item>
      <test style="color: #f56c6c;margin-left: 10px;font-size: 12px;" v-if="showErr">登录名或密码错误</test>
      <div>
        <el-button type='primary' style='width:178px;border-radius: 4px;margin-top:22px;margin-left:135px;' :loading='loading' @click.native.prevent='handleLogin'>{{$t('login.logIn')}}</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
	import LangSelect from '@/components/LangSelect'
	import SocialSign from './socialsignin'
	import axios from 'axios'
	import request from '@/utils/request'

	export default {
	  components: { LangSelect, SocialSign },
	  name: 'login',
	  data() {
	    const validateUsername = (rule, value, callback) => {
	      callback()
	    }
	    const validatePassword = (rule, value, callback) => {
	      callback()
	    }
	    return {
	      loginForm: {
	        loginId: '',
	        password: ''
	      },
	      loginRules: {
	        loginId: [{ required: true, trigger: 'blur', validator: validateUsername }],
	        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
	      },
	      passwordType: 'password',
	      loading: false,
	      showDialog: false,
	      showErr: false, // 是否展示错误信息
	      ispassword: false // 是否展示密码
	    }
	  },
	  methods: {
	    showPwd() {
	      if (this.passwordType === 'password') {
	        this.passwordType = ''
	        this.ispassword = true
	      } else {
	        this.passwordType = 'password'
	        this.ispassword = false
	      }
	    },
	    handleLogin() {
	      const self = this
	      this.$refs.loginForm.validate(valid => {
	        if (valid) { // 判断是否填写正确格式
	          this.loading = true // 是否处于加载中
	          const formData = new FormData()
	          formData.append('loginId', self.loginForm.loginId)
	          formData.append('password', self.loginForm.password)
	          axios.post('/api/account/login', formData).then(response => {
	            this.setCookie('username', this.loginForm.loginId)
	            this.setCookie('password', this.loginForm.password)
	            self.loginForm['token'] = response.data.token.token
	            self.loginForm['username'] = self.loginForm.loginId
	            window.document.cookie = 'loginForm=' + JSON.stringify(self.loginForm)
	            self.$store.dispatch('LoginByUsername', self.loginForm).then((res) => { // 使用用户名登录
	              this.loading = false
	              request('auth_tokens', {
	                params: {
	                  includes: {
	                    'hm_user': {
	                      includes: ['user_id']
	                    }
	                  },
	                  filters: {
	                    'auth_token': {
	                      'token': {
	                        equalTo: self.loginForm.token
	                      }
	                    }
	                  }
	                }
	              }).then(resp => {
                self.$router.push({ path: '/' })
	              })
	            }).catch((err) => {
	              this.loading = false
	              console.log('登录失败', err)
	            })
	          }, response => {
	            console.log('用户名或密码错误')
	            this.loading = false
	            this.loginForm.loginId = ''
	            this.loginForm.password = ''
	            this.showErr = true
	          })
	        } else {
	          console.log('error submit!!')
	          return false
	        }
	      })
	    },
	    setCookie(cname, cvalue) { // 存cookie
	      var d = new Date()
	      d.setTime(d.getTime() + (365 * 50 * 24 * 60 * 60 * 1000))
	      var expires = 'expires=' + d.toUTCString()
	      console.info(cname + '=' + cvalue + '; ' + expires)
	      document.cookie = cname + '=' + cvalue + '; ' + expires
	      console.info(document.cookie)
	    },
	    getCookie(cname) { // 获取cookie
	      var name = cname + '='
	      var ca = document.cookie.split(';')
	      for (var i = 0; i < ca.length; i++) {
	        var c = ca[i]
	        while (c.charAt(0) === ' ') c = c.substring(1)
	        if (c.indexOf(name) !== -1) return c.substring(name.length, c.length)
	      }
	      return ''
	    }
	  },
	  created() {
	    const self = this
	    const myToken = localStorage.getItem('token')
	    if (myToken && myToken.length !== 0) {
	      self.$store.dispatch('LoginByUsername', this.loginForm).then(() => {
	        self.loading = false
	        self.$router.push({ path: '/' })
	      })
	    }
	  },
	  destroyed() {
	    // window.removeEventListener('hashchange', this.afterQRScan)
	  }
	}
</script>

<style rel='stylesheet/scss' lang='scss'>
  $bg:#2d3a4b;
  $light_gray:#eee;

  /* reset element-ui css */
  .login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
  input {
    background: transparent;
    border: 0px;
    -webkit-appearance: none;
    border-radius: 0px;
    padding: 12px 5px 12px 15px;
    color: $light_gray;
    height: 47px;
  &:-webkit-autofill {
     -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
     -webkit-text-fill-color: #fff !important;
   }
  }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
    width: 433px;
  }
  }
</style>

<style rel='stylesheet/scss' lang='scss' scoped>
  $bg:#2d3a4b;
  $dark_gray:#889aa4;
  $light_gray:#eee;

  .loginbg {
    background-image: url('../../assets/img/loginbg.png');
    width: 100%;
    height: 100%;
    background-size: 100% 100%;
  }
  .login-container {
    position: fixed;
    /*top: 170px;*/
    /*left: 370px;*/
    /*height: 446px;*/
    /*width: 689px;*/
    height: 100%;
    width: 100%;
    /*margin: 120px auto;*/
    background-color: $bg;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    padding: 35px 35px 15px 35px;
    /*margin: 10px auto;*/
    margin: 120px auto;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
  span {
  &:first-of-type {
     margin-right: 16px;
   }
  }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  &_login {
     font-size: 20px;
   }
  }
  .title-container {
    position: relative;
  .title {
    font-size: 26px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 60px auto;
    text-align: center;
    font-weight: bold;
  }
  .set-language {
    color: #fff;
    position: absolute;
    top: 5px;
    right: 0px;
  }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .thirdparty-button {
    position: absolute;
    right: 35px;
    bottom: 28px;
  }
  }
</style>
