/**
 * Created by max on 2017/8/22.
 */

exports.handlePeopleInfo = async function ( linesNumberFrom,  lines, colsAttrList, rowsMaxNumber ) {

  let peopleInfoMap = [];
  let namePosition = 0;
  let shiftsPositionList = [];
  for (var i=0; i<colsAttrList.length; i++) {
    if (colsAttrList[i].number == 0) {
      namePosition = colsAttrList[i].position;
    } else {
      shiftsPositionList.push(colsAttrList[i].position);
    }
  }

  for (var i=linesNumberFrom; i<lines.length; i++) {
    let personInfo = {
      name: lines[i][namePosition],
      lastCount: 0,
      usedCount: 0,
      shiftsMap: []
    };
    let result = await handleShiftMap(lines[i], shiftsPositionList, rowsMaxNumber);
    personInfo.shiftsMap = result.shiftsMap;
    personInfo.lastCount = result.shiftsCount;
    peopleInfoMap.push(personInfo);
  }

  return Promise.resolve(peopleInfoMap);
};

var handleShiftMap = async function (line, shiftsPositionList, rowsMaxNumber) {
  let shiftsCount = 0;
  let shiftsMap = [];
  // console.log(shiftsPositionList);
  for(var i=0; i<shiftsPositionList.length; i++) {
    shiftsMap.push([]);
    const personShiftsList = line[shiftsPositionList[i]].split(";");
    for(var j=0; j<personShiftsList.length; j++) {
      const string = personShiftsList[j];
      const regex = /([1-9][0-9]*)[.]{1}([^\\s]+$)/g;
      var match = regex.exec(string);
      if (match) {
        shiftsMap[i][parseInt(match[1])-1] = 1;
        shiftsCount++;
      }
    }
    for(var j=0; j<rowsMaxNumber; j++) {
      if (shiftsMap[i][j] != 1) {
        shiftsMap[i][j] = 0;
      }
    }
  }

  return Promise.resolve({
    shiftsMap: shiftsMap,
    shiftsCount: shiftsCount
  });
};
