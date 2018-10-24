<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'APP',
    data() {
      return {
        currentUser: {},
      }
    }
  }
</script>
<style>
  @import './styles/font.css';
</style>
