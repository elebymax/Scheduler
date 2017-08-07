/* eslint-disable */
/**
 * Created by max on 2017/1/20.
 */
var peopleCountInShift = 0; //每班需要幾人

var shifting = function (fileToRead, peopleCount) {
  peopleCountInShift = peopleCount;
  var reader = new window.FileReader();
  reader.readAsText(fileToRead); // Read file into memory as UTF-8
  reader.onload = this.loadHandler; // Handle errors load
  reader.onerror = this.errorHandler
};

var loadHandler = function (event) {
  var csv = event.target.result;
  processData(csv);
};

var processData = function (csv) {
  var lines = [];
  var allTextLines = csv.split(/\r\n|\n/);
  for (var i = 0; i < allTextLines.length; i++) {
    var data = allTextLines[i].split(',');
    var tarr = [];
    for (var j = 0; j < data.length; j++) {
      tarr.push(data[j].replace(/"/g, ''));
    }
    lines.push(tarr);
  }
  formatData(lines);
};

var formatData = function (lines) {
  
};



var compute = {
  shifting: shifting,
  loadHandler: loadHandler,
  processData: processData,
  formatData: formatData
};

export default compute;
