<template>
  <div id="testing">
    <h3>40人的排班花費不到<span style="color: #ffbb22;">一秒鐘</span>！</br>
      想親自試一下嗎？這個
      <span><a href="https://drive.google.com/file/d/0B93pN4EGN5z5MzVXbWVwWGNEQ1k/view?usp=sharing" target="_blank">範例檔案 [下載]</a></span>
      給你測試真偽！
    </h3>
  </div>
</template>
<script type="es6">
  export default {
    name: 'testing',
    mounted () {

    },
    data () {
      return {
        animate: true
      }
    },
    methods: {

    }
  }
</script>
<style>
  #testing {
    overflow: hidden;
    background-color: #eee;
    padding: 18px;
  }

  #testing h3 {
    line-height: 1.65em;
  }
</style>
