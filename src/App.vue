<template>
  <div id="app">
    <header id="header" style="">
      <!--<div id="header-mask"></div>-->
      <div class="header-mask">
        <transition name="custom-classes-transition"
                    enter-active-class="animated bounceIn"
                    leave-active-class="animated bounceOut"
                    mode="out-in">
          <header-content @toggle="toggle" v-if="isContent"></header-content>
          <header-upload @toggle="toggle" v-else></header-upload>
        </transition>
      </div>
    </header>
    <intro></intro>
    <!--<div class="mask"></div>-->
    <div id="start" style="">
      <div class="mask">
        <quick-start></quick-start>
      </div>
    </div>
    <footer id="footer">
      <h4>Copyright © 2017 Max, Lai 版權所有</h4>
      <h4>本站採AGPL授權，<a href="https://www.gnu.org/licenses/agpl-3.0.txt">授權條款</a></h4>
    </footer>
  </div>
</template>

<script type="es6">
  import headerContent from './components/header-content'
  import headerUpload from './components/header-upload'
  import intro from './components/intro'
  import quickStart from './components/quick-start'

  export default {
    name: 'app',
    data () {
    return {
      isContent: true
    }
  },
  components: {
    headerContent,
    headerUpload,
    intro,
    quickStart
  },
  methods: {
    toggle: function() {
      this.isContent = !this.isContent;
    }
  }
  }
</script>

<style>
  @font-face {
    font-family: mona;
    src: url(./assets/mona.otf) format("opentype");
  }

  body, html {
    margin: 0;
    padding: 0;
    background-color: white;
  }

  #footer {
    background-color: #414141;
    overflow: hidden;
    padding: 20px 10px;
    color: white;
  }

  #header {
    background: url(./assets/background.jpg);
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    height: 100vh;
  }

  .header-mask {
    padding: 40px 0px;
    width: 100%;
    height: 100%;
    background: rgba( 0, 0, 0, 0.3);
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    width: 100%;
  }

  #start {
    background-image: url(./assets/quickStartBG.jpg);
    background-repeat: no-repeat;
    background-size: cover;
    background-attachment: fixed;
    background-position: top;
  }

  .mask {
    padding: 50px 100px 50px 100px;
    background: rgba( 256, 256, 256, 0.6);
    overflow: auto;
  }
</style>
