<template>
  <scroll-bar>
    <el-menu mode="vertical" :default-active="$route.path" :collapse="isCollapse" background-color="#304156" text-color="#bfcbd9" active-text-color="#409EFF">
      <a id="logo">
				<!--<div class="logo" ref="mybox"></div>-->
				<div class="logoNew" ref="mybox">后台管理</div>
			</a>
      <sidebar-item :routes="permission_routers"></sidebar-item>
    </el-menu>
  </scroll-bar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import ScrollBar from '@/components/ScrollBar'

export default {
  components: { SidebarItem, ScrollBar },
  computed: {
    ...mapGetters([
      'permission_routers',
      'sidebar'
    ]),
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	#logo{

    height: 75px;
    text-align: center;
    line-height: 80px;

		.logoNew{
			width: 90%;
			height: 45px;
			vertical-align: middle;
			color: #ffffff;
		}

    .logo{
    	display: inline-block;
    	width: 90%;
    	height: 45px;
    	background: url(../../../../assets/img/zjk-logo1.png) top left no-repeat;
    	background-size: cover;
    	vertical-align: middle;
    }
	}
</style>
