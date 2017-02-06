<template>
  <div id="header-upload" @resize="resizeUpload">
    <h1 class="bold">上傳你的表單</h1>
    <select class="dropdown col-xs-10 col-xs-offset-1 col-md-4 col-md-offset-4 " v-model="peopleCount">
      <option value="1">每班次需1人</option>
      <option value="2">每班次需2人</option>
      <option value="3">每班次需3人</option>
      <option value="4">每班次需4人</option>
      <option value="5">每班次需5人</option>
      <option value="6">每班次需6人</option>
      <option value="7">每班次需7人</option>
      <option value="8">每班次需8人</option>
      <option value="9">每班次需9人</option>
      <option value="10">每班次需10人</option>
    </select>
    <div id="upload-block" class="col-xs-10 col-xs-offset-1 col-md-4 col-md-offset-4">
      <input id="uploadBtn" type="file" class="chooseBtn" accept=".csv" @change="changeUploadPath($event)"/>
      <input id="uploadFile" class="chooseFile" placeholder="上傳Google回覆表單(.csv)" disabled="disabled" v-model="filename"/>
    </div>
    <a id="cancel" class="col-xs-5 col-xs-offset-1 col-md-2 col-md-offset-4 button header-button header-button-normal" @click="goContent">取消</a>
    <a id="shifting" class="col-xs-5 col-md-2 col-md-offset-0 button header-button header-button-important" @click="startShifting">開始</a>
  </div>
</template>
<script type="es6">
  var Reader = require('../assets/fileReader').default;
  var Compute = require('../assets/compute').default;

  export default {
    name: 'header-upload',
    mounted() {
      this.resizeUpload();
      window.addEventListener('resize', this.resizeUpload);
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.resizeUpload);
    },
    data () {
      return {
        peopleCount: 1,
        file: '',
        filename: ''
      }
    },
    methods: {
      resizeUpload: function() {
        var windowHeight = $(window).height();
        var contentHeight = $('#header-upload').height();
        var value = (windowHeight/2) - (contentHeight/2);
        $('#header-upload').css('margin-top', (value-50)+'px');
      },
      goContent: function() {
        this.$emit('toggle');
      },
      changeUploadPath: function (e) {
        this.filename = e.target.value;
        if (window.FileReader) {
          // FileReader are supported.
          this.file = e.target.files[0];
          Reader.getAsText(this.file);

        } else {
          alert('FileReader are not supported in this browser.');
        }
      },
      startShifting: function () {
        Compute.shifting(this.file, this.peopleCount);
      }
    }
  }
</script>
<style>
  #header-upload {
    overflow: hidden;
    color: white;
  }

  #header-upload h1 {
    font-weight: 200;
    line-height: 2em;
    font-size: 2.65em;
    font-family: mona;
  }

  #header-upload select {
    font-weight: bold;
    margin-top: 20px;
    height: 50px;
    border-radius: 4px;
    background-color: rgba(255, 255, 255, 0.3);
    border: 5px solid white;
  }

  .chooseFile {
    height: 50px;
    font-weight: bold;
    border-radius: 4px;
    background-color: rgba(255, 255, 255, 0.3);
    border: 5px solid white;
    /*width: calc(41.66666667% - 10px);*/
  }

  #upload-block {
    padding: 0px;
    margin-top: 20px;
    margin-bottom: 30px;

  }

  #uploadFile {
    width: 100%;
    z-index: 999;
    padding: 15px;
  }

  .chooseFile::-webkit-input-placeholder { color: white; }
  .chooseFile:-moz-placeholder { color: white; }
  .chooseFile:-moz-placeholder { color: white; }
  .chooseFile:-ms-input-placeholder { color: white; }

  .chooseBtn {
    position: absolute;
    padding: 0;
    filter: alpha(opacity=0);
    height: 50px;
    opacity: 0;
  }

  #uploadBtn {
    width: 100%;
  }

  .dropdown option {
    color: #000;
  }
</style>
