/* eslint-disable */
/**
 * Created by max on 2017/1/20.
 */
var FindAttrList = require('./findAttrList');
var HandlePeopleInfo = require('./handlePeopleInfo');
var HandlePeopleAvailableToShift = require('./handlePeopleAvailableToShift');
var HandlePeoplePriority = require('./handlePeoplePriority');
var HandlePeopleCountUnderLimitInToResultTable = require('./handlePeopleCountUnderLimitInToResultTable');
var HandlePriorityWeight = require('./handlePriorityWeight');
var HandleResultTable = require('./handleResultTable');

let peopleCountInShift = 0; //每班需要幾人
let limitOfEachOneShiftsCount = 0;
let isUserSetShiftLimit = true;
const LINES_NUMBER_FROM = 1;

var shifting = function (fileToRead, peopleCount) {
  peopleCountInShift = peopleCount;
  // limitOfEachOneShiftsCount = limitShiftsCount;
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
  let resultTableMap = [];
  peopleCountInShift = 5;

  let colsAttrList = await FindAttrList.findColsAttr( lines[0] );
  let rowsAttrList = await FindAttrList.findRowsAttr( LINES_NUMBER_FROM, lines, colsAttrList );
  let totalShiftsCount = (colsAttrList.length-1) * rowsAttrList.length;
  limitOfEachOneShiftsCount = Math.floor( ( peopleCountInShift * totalShiftsCount ) / peopleCount );
  let rowsMaxNumber = rowsAttrList[rowsAttrList.length-1].number;
  let peopleInfoList = await HandlePeopleInfo.handlePeopleInfo( LINES_NUMBER_FROM, lines, colsAttrList, rowsMaxNumber );
  let peopleAvailableToShiftMap = await HandlePeopleAvailableToShift.peopleAvailableToShift( peopleInfoList, colsAttrList.length-1, rowsMaxNumber );
  // peopleInfoList = await HandlePeoplePriority.peoplePriorityList( peopleInfoList, colsAttrList.length-1, rowsMaxNumber );

  let result1 = await HandlePeopleCountUnderLimitInToResultTable.peopleCountUnderLimitInToResultTable( peopleInfoList, peopleAvailableToShiftMap, colsAttrList.length-1, rowsMaxNumber, peopleCountInShift, limitOfEachOneShiftsCount );
  resultTableMap = result1.resultTableMap;
  peopleInfoList = result1.peopleInfoList;
  peopleAvailableToShiftMap = result1.peopleAvailableToShiftMap;

  // peopleInfoList = await HandlePriorityWeight.priorityWeight( peopleInfoList, peopleAvailableToShiftMap, colsAttrList.length-1, rowsMaxNumber );

  let result2 = await HandleResultTable.handleResultTable( resultTableMap, peopleInfoList, peopleAvailableToShiftMap, colsAttrList.length-1, rowsMaxNumber, peopleCountInShift, limitOfEachOneShiftsCount, isUserSetShiftLimit );
  resultTableMap = result2.resultTableMap;
  peopleInfoList = result2.peopleInfoList;
  peopleAvailableToShiftMap = result2.peopleAvailableToShiftMap;

  // console.log(resultTableMap);
};

var compute = {
  shifting: shifting,
  loadHandler: loadHandler,
  processData: processData,
  formatData: formatData
};

export default compute;
