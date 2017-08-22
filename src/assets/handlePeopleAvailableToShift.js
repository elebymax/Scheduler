/**
 * Created by max on 2017/8/22.
 */

exports.peopleAvailableToShift = async function ( peopleInfoList, colsCount, rowsCount ) {

  let peopleAvailableToShiftMap = await makeEmptyMap(colsCount, rowsCount);

  for (var i=0; i<peopleInfoList.length; i++) {
    for (var j=0; j<colsCount; j++) {
      for (var k=0; k<rowsCount; k++) {
        const personInfo = peopleInfoList[i];
        if ( peopleInfoList[i].shiftsMap[j][k] === 1 ) {
          peopleAvailableToShiftMap[j][k].push(personInfo.id);
        }
      }
    }
  }

  return Promise.resolve(peopleAvailableToShiftMap);
};

var makeEmptyMap = async function (colsCount, rowsCount) {
  let peopleAvailableToShiftMap = [];
  for (var i=0; i<colsCount; i++) {
    peopleAvailableToShiftMap.push([]);
    for(var j=0; j<rowsCount; j++  ) {
      peopleAvailableToShiftMap[i].push([]);
    }
  }
  return Promise.resolve(peopleAvailableToShiftMap);
};
