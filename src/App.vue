<template>
  <div id="app">
    <Navbar></Navbar>
    <router-view></router-view>

  </div>
</template>

<script>
import Navbar from '@/components/layout/Navbar.vue'

export default {
  name: 'App',
  components: {
    Navbar
  }
}
</script>

<style>
body{
  background:#ddd;
}

</style>
