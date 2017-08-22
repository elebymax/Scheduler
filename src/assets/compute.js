/* eslint-disable */
/**
 * Created by max on 2017/1/20.
 */
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

  let colsAttrList = await findColsAttr(lines[0]);
  let rowsAttrList = await findRowsAttr(lines, colsAttrList);

  console.log(colsAttrList);
};

const findColsAttr = async function ( firstLine ) {

  var resultList = [];

  for(var i=0; i<firstLine.length; i++) {
    var myString = firstLine[i];
    var myRegexp = /([0-9]+)[.]{1}([^\\s]+$)/g;
    var match = myRegexp.exec(myString);
    if (match) {
      var attr = {
        position: i,
        number: match[1],
        name: match[2],
      };
      resultList.push(attr);
    }
  }

  resultList = await sortObjectInListByNumber(resultList);

  return Promise.resolve(resultList);

};

const findRowsAttr = async function ( lines, colsAttrList ) {

  let shiftsPositionList = [];
  for (var i=0; i<colsAttrList.length; i++) {
    if (colsAttrList[i].position !== 0) {
      shiftsPositionList.push(colsAttrList[i].position);
    }
  }

  let rowNameList = [];
  for (var i=LINES_NUMBER_FROM; i<lines.length; i++) {
    for (var j=0; j<shiftsPositionList.length; j++) {
      const shiftsPosition = shiftsPositionList[j];
      const personShiftsList = lines[i][shiftsPosition].split(";");
      for (var k=0; k<personShiftsList.length; k++) {
        const string = personShiftsList[k];
        const regex = /([0-9]+)[.]{1}([^\\s]+$)/g;
        var match = regex.exec(string);
        if (match) {
          const rowName = {
            number: match[1],
            name: match[2]
          };
          rowNameList.push(rowName);
        }
      }
    }
  }
  rowNameList = _.uniqBy(rowNameList, 'number');
  rowNameList = await sortObjectInListByNumber(rowNameList);

  return Promise.resolve(rowNameList);
};

const sortObjectInListByNumber = async function (list) {
  return Promise.resolve( list.sort(function (a, b) {
    return a.number > b.number ? 1 : -1;
  }) );
};

var compute = {
  shifting: shifting,
  loadHandler: loadHandler,
  processData: processData,
  formatData: formatData
};

export default compute;
