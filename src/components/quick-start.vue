<template>
  <section id="quick-start">
    <h1 class="bold">快速開始</h1>
    <h2 class="bold gray">QUICK START</h2>
    <iframe src="//slides.com/maxlai/deck-1/embed" scrolling="no" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
    <iframe src="//slides.com/maxlai/deck-1-2/embed" scrolling="no" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
  </section>
</template>
<script type="es6">
  export default {
    name: 'quick-start',
    data () {
      return {

      }
    },
    methods: {

    }
  }
</script>
<style>
  #quick-start {
    overflow: hidden;
  }

  @media screen and (max-width: 767px){
    #quick-start {
      padding: 50px 0px;
    }
  }

  #quick-start iframe {
    height: 420px;
    width: 576px;
  }

  @media screen and (max-width: 767px) {
    #quick-start iframe {
      height: 210px;
      width: 80%;
    }
  }

  #quick-start h1, h2, iframe {

  }

</style>
