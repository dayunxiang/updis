<template>
  <div class="manager-context">
    <manager></manager>
  </div>
</template>
<script>
import manager from  './components/manager'
export default {
  name: 'projectManager',
  components:{
    manager,
  },
  data() {
    return {
      activeName: 'first'
    };
  },
}
</script>

<style scoped>
  .manager-context{
    margin-top:15px;
    padding: 0px 20px;
    height: 100%;
  }
</style>
