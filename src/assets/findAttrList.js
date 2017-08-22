/**
 * Created by max on 2017/8/22.
 */

exports.findColsAttr = async function ( firstLine ) {

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

exports.findRowsAttr = async function ( linesNumberFrom,  lines, colsAttrList ) {

  let shiftsPositionList = [];
  for (var i=0; i<colsAttrList.length; i++) {
    if (colsAttrList[i].number != 0) {
      shiftsPositionList.push(colsAttrList[i].position);
    }
  }

  let rowNameList = [];
  for (var i=linesNumberFrom; i<lines.length; i++) {
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

var sortObjectInListByNumber = async function (list) {
  return Promise.resolve( list.sort(function (a, b) {
    return a.number > b.number ? 1 : -1;
  }) );
};
