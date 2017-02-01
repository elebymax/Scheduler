<template>
  <section id="intro">
    <h1 class="bold">關&nbsp&nbsp於</h1>
    <h2 class="bold gray">ABOUT</h2>
    <div class="col-md-3 col-sm-6 col-xs-12 intro-box">
      <div class="intro-box-inner">
        <img src="../assets/forms.png">
        <h2>結合Google表單</h2>
        <h4 class="gray">使用Google表單統計所有人的課表，能方便又快速地統整、匯出所有人員排班的資訊。</h4>
      </div>
    </div>
    <div class="col-md-3 col-sm-6 col-xs-12 intro-box">
      <div class="intro-box-inner">
        <img src="../assets/calculator.png">
        <h2>班次平均且連續</h2>
        <h4 class="gray">除了每人所分配到的班數幾近相同之外，也加入連班的算法，使班次盡可能連續，方便人員值班。</h4>
      </div>
    </div>
    <div class="col-md-3 col-sm-6 col-xs-12 intro-box">
      <div class="intro-box-inner">
        <img src="../assets/hand.png">
        <h2>一鍵排班</h2>
        <h4 class="gray">將表單回覆匯出成csv檔後，上傳至此平台，輸入每班的人數，點擊『排班』，排班就馬上完成了！</h4>
      </div>
    </div>
    <div class="col-md-3 col-sm-6 col-xs-12 intro-box">
      <div class="intro-box-inner">
        <img src="../assets/free.png">
        <h2>完全免費</h2>
        <h4 class="gray">開發者也曾親身體認排班費時的痛苦，故不藉此盈利。</h4>
      </div>
    </div>
  </section>
</template>
<script type="es6">
  export default {
    name: 'intro',
    data () {
      return {

      }
    },
    methods: {

    }
  }
</script>
<style>
  #intro {
    width: 100%;
    padding: 50px;
    overflow: auto;
  }

  .intro-box {
    height: 350px;
    padding: 50px;
  }

  .intro-box img {
    height: 100px;
  }

  .intro-box-inner h4 {
    line-height: 25px;
  }

</style>
