/* eslint-disable */
/**
 * Created by max on 2017/1/19.
 */

var getAsText = function (fileToRead) {
  var reader = new window.FileReader()
  // Read file into memory as UTF-8
  reader.readAsText(fileToRead)
  // Handle errors load
  reader.onload = this.loadHandler
  reader.onerror = this.errorHandler
}

var loadHandler = function (event) {
  var csv = event.target.result
  processData(csv)
}

var processData = function (csv) {
  var lines = []
  var allTextLines = csv.split(/\r\n|\n/)
  for (var i = 0; i < allTextLines.length; i++) {
    var data = allTextLines[i].split(',')
    var tarr = []
    for (var j = 0; j < data.length; j++) {
      tarr.push(data[j].replace(/"/g, ''));
    }
    lines.push(tarr)
  }
  checkHeadFormat(lines)
}

var checkHeadFormat = function (lines) {
  var count = []
  var daysCount = []
  for (var i = 0; i < lines[0].length; i++) {
    var index = lines[0][i].split('.')
    var num = parseInt(index[0])
    if (num === 0) {
      count.push(num)
    } else if (num > 0) {
      count.push(num)
      daysCount[num] = i
    }
  }
  count.sort(function (a, b) {
    return a - b
  })
  if (count.length - 1 !== count[count.length - 1]) {
    window.alert('顯示名稱或天數格式錯誤，顯示名稱請在標題前加上\'0.\'，天數請從\'1.\'開始，不得跳號！')
  } else {
    checkShiftFormat(daysCount, lines)
  }
}

var checkShiftFormat = function (daysCount, lines) {
  for (var i = 1; i < lines.length; i++) {
    for (var j = 1; j < daysCount.length; j++) {
      var shifts = lines[i][daysCount[j]].split(';')
      for (var k = 0; k < shifts.length; k++) {
        if(shifts[0]!='') {
          if (!shifts[k].includes('.')) {
            window.alert('班數設定錯誤，未包含\'.\'。')
            return
          }
          var index = shifts[k].split('.')
          var num = parseInt(index[0])
          if (num === 0) {
            window.alert('班數設定錯誤，不可使用\'0\'，請從\'1\'開始。')
          } else if (!(num > 0)) {  //
            window.alert('班數設定錯誤，不可使用除數字以外其他字符！')
          }
        }
      }
    }
  }
}

var errorHandler = function (evt) {
  if (evt.target.error.name === 'NotReadableError') {
    window.alert('Canno\'t read file !')
  }
}

var fileReader = {
  getAsText: getAsText,
  loadHandler: loadHandler,
  processData: processData,
  checkHeadFormat: checkHeadFormat,
  checkShiftFormat: checkShiftFormat,
  errorHandler: errorHandler
}

export default fileReader
