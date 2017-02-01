<template>
  <section id="upload">
    <h1 class="bold">上傳你的表單</h1>
    <h2 class="bold gray">UPLOAD FORM</h2>
    <select class="dropdown col-md-6 col-md-offset-3">
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
    <input id="uploadFile" class="col-md-5 col-md-offset-3" placeholder="Choose File" disabled="disabled" v-model="filename"/>
    <div class="fileUpload button">
      <span>選擇檔案</span>
      <input id="uploadBtn" type="file" class="upload" @change="changeFileName($event)"/>
    </div>
    <a id="submit" class="col-md-2 col-md-offset-5 button">開始排班</a>
  </section>
</template>
<script type="es6">
  export default {
    name: 'upload',
    data () {
      return {
        filename: ''
      }
    },
    methods: {
      changeFileName: function (value) {
        this.filename = value.target.value;
      }
    }
  }
</script>
<style>
  #upload {
    width: 100%;
    height: 450px;
    padding: 50px 100px 50px 100px;
    background-color: #f1f1f1;
    font-size: 18px;
  }

  #upload select {
    margin-top: 20px;
    height: 40px;
    border-radius: 3px;
    background-color: white;
  }

  #uploadFile {
    height: 40px;
    margin-top: 20px;
    width: calc(41.66666667% - 10px);
  }

  .fileUpload {
    position: relative;
    overflow: hidden;
    background-color: rgba(165, 165, 165, 1);
    height: 40px;
    margin: 20px 10px 10px 10px;
    padding: 6px 12px;
    border: 1px solid #a5a5a5;
    float: left;
    color: black;
    -o-transition: background-color .20s ease;
    -webkit-transition: background-color .20s ease;
    -moz-transition: background-color .20s ease;
    transition: background-color .20s ease;
  }

  .fileUpload:hover {
    background-color: rgba(165, 165, 165, 0.3);
  }

  .fileUpload span {
    font-size: 18px;
  }

  .fileUpload input.upload {
    position: absolute;
    top: 0;
    right: 0;
    margin: 0;
    padding: 0;
    cursor: pointer;
    opacity: 0;
    filter: alpha(opacity=0);
    height: 40px;
  }

  #submit {
    margin-top: 30px;
    height: 50px;
    background-color: #ffbb22;
    border: 1px solid #ffbb22;
    font-size: 24px;
    color: black;
    padding-top: 8px;
    -o-transition: background-color .20s ease;
    -webkit-transition: background-color .20s ease;
    -moz-transition: background-color .20s ease;
    transition: background-color .20s ease;
  }

  #submit:hover {
    background-color: rgba(255, 184, 34, 0.3);
  }

  .button {
    cursor: pointer;
    text-decoration: none !important;
    border-radius: 4px;
  }

</style>
