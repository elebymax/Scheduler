<template>
  <div id="navbar-container">

  </div>
</template>
<script type="es6">
  export default {
    name: 'navbar',
    data () {
      return {

      }
    },
    methods: {

    }
  }
</script>
<style>
  #navbar-container {
    position: relative;
    width: 100%;
    height: 68px;
    background-color: white;
    opacity: 0;

    -o-transition: opacity .20s ease;
    -webkit-transition: opacity .20s ease;
    -moz-transition: opacity .20s ease;
    transition: opacity .20s ease;
  }

  /*#navbar-container:hover {*/
    /*opacity: 1;*/
  /*}*/

</style>
