/* eslint-disable */
/**
 * Created by max on 2017/1/20.
 */
var FindAttrList = require('./findAttrList');
var HandlePeopleInfo = require('./handlePeopleInfo');
var HandlePeopleAvailableToShift = require('./handlePeopleAvailableToShift');

var peopleCountInShift = 0; //每班需要幾人
const LINES_NUMBER_FROM = 1;

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

var formatData = async function (lines) {
  const peopleCount = lines.length-1;

  let colsAttrList = await FindAttrList.findColsAttr(lines[0]);
  let rowsAttrList = await FindAttrList.findRowsAttr(LINES_NUMBER_FROM, lines, colsAttrList);
  let rowsMaxNumber = rowsAttrList[rowsAttrList.length-1].number;
  let peopleInfoList = await HandlePeopleInfo.handlePeopleInfo(LINES_NUMBER_FROM, lines, colsAttrList, rowsMaxNumber);
  let peopleAvailableToShiftMap = await HandlePeopleAvailableToShift.peopleAvailableToShift( peopleInfoList, colsAttrList.length-1, rowsMaxNumber );

  console.log(peopleAvailableToShiftMap);
};

var compute = {
  shifting: shifting,
  loadHandler: loadHandler,
  processData: processData,
  formatData: formatData
};

export default compute;
