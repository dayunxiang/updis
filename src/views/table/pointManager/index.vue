<template>
  <transition name="fade" mode="out-in">
      <router-view></router-view>
  </transition>
</template>

<script>
  export default {
    name: '',
    computed: {
      cachedViews() {
        return this.$store.state.tagsView.cachedViews
      }
    }
  }
</script>
