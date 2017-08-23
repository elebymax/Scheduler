/**
 * Created by max on 2017/8/23.
 */

let resultTableMap;
let peopleInfoList;

exports.handleResultTable = async function ( resultTable, peopleInfo, peopleAvailableToShiftMap, colsCount, rowsCount, peopleCountInShift, limitOfEachOneShiftsCount, isUserSetShiftLimit ) {
  resultTableMap = resultTable;
  peopleInfoList = peopleInfo;

  for (var i=0; i<colsCount; i++) {
    for (var j=0; j<rowsCount; j++) {
      let idList = peopleAvailableToShiftMap[i][j];
      resultTableMap[i][j] = await priorityRanking( idList, i, j, peopleCountInShift, limitOfEachOneShiftsCount, isUserSetShiftLimit );
      peopleAvailableToShiftMap[i][j] = peopleAvailableToShiftMap[i][j].filter(val => !resultTableMap[i][j].includes(val));
    }
  }

  console.log(peopleInfoList);

  return Promise.resolve({
    resultTableMap,
    peopleInfoList,
    peopleAvailableToShiftMap
  });
};

let priorityRanking = async function ( idList, i, j, peopleCountInShift, limitOfEachOneShiftsCount, isUserSetShiftLimit ) {
  let peopleList = [];

  for(var k=0; k<idList.length; k++) {
    for(var l=0; l<peopleInfoList.length; l++) {
      const personInfo = peopleInfoList[l];
      if ( idList[k] === personInfo.id ) {
        const person = {
          id: personInfo.id,
          priorityRank: parseInt(personInfo.lastCountWeight) + parseInt(personInfo.continuousWeightMap[i][j])
        };
        peopleList.push(person);
      }
    }
  }

  peopleList = peopleList.sort(function (a, b) {
    return a.priorityRank < b.priorityRank ? 1 : -1;
  });

  let resultList = resultTableMap[i][j];
  for(var k=0; k<peopleList.length; k++) {
    for (var l=0; l<peopleInfoList.length; l++) {
      const personInfo = peopleInfoList[l];
      if ( peopleList[k].id === personInfo.id && resultList.length < peopleCountInShift && personInfo.lastCount > 0 ) {
        if ( personInfo.usedCount < limitOfEachOneShiftsCount && isUserSetShiftLimit ) {
          resultList.push( peopleList[k].id );
          personInfo.usedCount++;
          personInfo.lastCount--;
        } else if ( personInfo.usedCount < (limitOfEachOneShiftsCount+1) && !isUserSetShiftLimit ) {
          resultList.push( peopleList[k].id );
          personInfo.usedCount++;
          personInfo.lastCount--;
        }
      }
    }
  }

  return Promise.resolve(resultList);

};
