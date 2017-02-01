<template>
  <div id="header-content">
    <h1>面對堆積如山的課表<br>你還在一張張對照再排班嗎？</h1>
    <a id="button_tutorial" class="col-xs-5 col-xs-offset-1 col-md-2 col-md-offset-4 button header-button header-button-normal" @click="goTutorial">使用說明</a>
    <a id="button_start" class="col-xs-5 col-md-2 col-md-offset-0 button header-button header-button-important" @click="goUpload">開始排班</a>
  </div>
</template>
<script type="es6">
  export default {
    name: 'header-content',
    mounted () {
      this.resizeContent();
      window.addEventListener('resize', this.resizeContent);
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.resizeContent);
    },
    data () {
      return {

      }
    },
    methods: {
      resizeContent: function() {
        var windowHeight = $(window).height();
        var contentHeight = $('#header-content').height();
        var value = (windowHeight/2) - (contentHeight/2);
        $('#header-content').css('margin-top', (value-50)+'px');
      },
      goTutorial: function() {
        $('html,body').animate({scrollTop:$('#quick-start').offset().top}, 2000, 'easeOutExpo');
      },
      goUpload: function() {
        this.$emit('toggle');
      }
    }
  }
</script>
<style>
  #header-content {
    overflow: hidden;
  }

  #header-content h1 {
    color: white;
    font-weight: 200;
    line-height: 2em;
    font-size: 2.65em;
    font-family: mona;
  }

  #header-content h3 {
    color: #ffbb22;
    font-weight: bold;
  }

   .button {
     cursor: pointer;
     text-decoration: none !important;
     border-radius: 4px;
   }

  .header-button {
    margin-top: 10px;
    height: 50px;
    font-size: 1.8em;
    padding-top: 8px;
    left: -10px;
    -o-transition: background-color .20s ease;
    -webkit-transition: background-color .20s ease;
    -moz-transition: background-color .20s ease;
    transition: background-color .20s ease;
  }

   .header-button-normal {
     color: white;
     background-color: rgba(255, 255, 255, 0);
     border: 1px solid #ffffff;
   }

   .header-button-normal:hover {
     background-color: rgba(255, 255, 255, 0.3);
   }

   .header-button-important {
     color: black;
     background-color: #ffbb22;
     border: 1px solid #ffbb22;
     left: 0.2em;
   }

   @media screen and (max-width: 767px) {
     .header-button-important {
       left: 0.3em;
     }
   }

   .header-button-important:hover {
     background-color: rgba(255, 184, 34, 0.8);
   }

</style>
