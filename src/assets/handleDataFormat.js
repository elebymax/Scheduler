/**
 * Created by max on 2017/8/23.
 */

exports.changeIdToName = async function ( resultTableMap, peopleInfoList, colsCount, rowsCount ) {
  let resultTable = await makeEmptyMap( colsCount, rowsCount );

  for(var i=0;i<resultTableMap.length;i++) {
    for(var j=0;j<resultTableMap[i].length;j++) {
      for(var k=0;k<resultTableMap[i][j].length;k++) {
        resultTable[i][j][k] = await findPersonInfo( resultTableMap[i][j][k], peopleInfoList );
      }
    }
  }

  return Promise.resolve( resultTable );
};

var findPersonInfo = function ( id, peopleInfoList ) {
  for (var i=0; i<peopleInfoList.length; i++) {
    if ( id == peopleInfoList[i].id ) {
      return Promise.resolve( peopleInfoList[i].name );
    }
  }
};

var makeEmptyMap = async function ( colsCount, rowsCount ) {
  let peopleAvailableToShiftMap = [];
  for (var i=0; i<colsCount; i++) {
    peopleAvailableToShiftMap.push([]);
    for(var j=0; j<rowsCount; j++  ) {
      peopleAvailableToShiftMap[i].push([]);
    }
  }
  return Promise.resolve(peopleAvailableToShiftMap);
};
