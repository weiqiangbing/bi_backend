<template>
  <div id="app" v-loading.fullscreen.lock="fullLoading">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  computed:{
    fullLoading(){
      return this.$store.state.part.fullLoading
    }
  }
}
</script>
