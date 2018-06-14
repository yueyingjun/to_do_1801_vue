<template>
  <div id="app">
    <transition>
    <router-view> </router-view>
    </transition>
  </div>
</template>
<script>
  export default {

  }

</script>

<style>
  .v-enter{
     opacity: 0;
  }
  .v-enter-to{
      opacity: 1;
  }
  .v-enter-active{
     transition: opacity .3s linear;
  }
  .v-leave{
    opacity: 1;
  }
  .v-leave-to{
    opacity: 0;
  }
  .v-leave-active{
     transition: opacity .3s linear;
  }
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

</style>
