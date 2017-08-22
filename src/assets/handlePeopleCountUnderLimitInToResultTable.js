/**
 * Created by max on 2017/8/22.
 */

let peopleInfoList;

exports.peopleCountUnderLimitInToResultTable = async function (infoList, peopleAvailableToShiftMap, colsCount, rowsCount, peopleCountInShift, limitCount) {
  peopleInfoList = infoList;
  let resultTableMap = await makeEmptyMap(colsCount, rowsCount);

  for (var i=0; i<colsCount; i++) {
    for (var j=0; j<rowsCount; j++) {
      const idList = peopleAvailableToShiftMap[i][j];
      if ( idList.length <= peopleCountInShift ) {
        resultTableMap[i][j] = await handlePeopleList(idList, limitCount);
      }
    }
  }

  return Promise.resolve(resultTableMap);
};

var handlePeopleList = async function (idList, limitCount) {
  let peopleList = [];

  for(var i=0; i<idList.length; i++) {
    for(var j=0; j<peopleInfoList.length; j++) {
      const personInfo = peopleInfoList[j];
      if ( idList[i] === personInfo.id ) {
        if ( personInfo.usedCount < limitCount && personInfo.lastCount > 0 ) {
          personInfo.usedCount++;
          personInfo.lastCount--;
          peopleList.push( idList[i] );
        }
      }
    }
  }

  return Promise.resolve(peopleList);
};

var makeEmptyMap = async function (colsCount, rowsCount) {
  let emptyMap = [];
  for (var i=0; i<colsCount; i++) {
    emptyMap.push([]);
    for(var j=0; j<rowsCount; j++  ) {
      emptyMap[i].push([]);
    }
  }
  return Promise.resolve(emptyMap);
};
