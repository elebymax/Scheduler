/**
 * Created by max on 2017/8/23.
 */

let resultTableMap;
let peopleInfoList;

exports.handleResultTable = async function ( resultTable, peopleInfo, peopleAvailableToShiftMap, colsCount, rowsCount, peopleCountInShift, limitOfEachOneShiftsCount, isUserSetShiftLimit ) {
  resultTableMap = resultTable;
  peopleInfoList = peopleInfo;

  for (var i=0; i<peopleInfoList.length; i++) {
    peopleInfoList[i].priorityMap = await makeEmptyMap( colsCount, rowsCount );
    peopleInfoList[i].continuousWeightMap = await makeEmptyMap(colsCount, rowsCount);
  }

  for (var i=0; i<colsCount; i++) {
    for (var j=0; j<rowsCount; j++) {
      let idList = peopleAvailableToShiftMap[i][j];
      peopleInfoList = await handlePersonPriority( idList, peopleInfoList, i, j );
      peopleInfoList = await handleContinuousPeopleInfoList( idList, peopleInfoList, colsCount, rowsCount, i, j );
      peopleInfoList = await handleLastCountPeopleInfoList( idList, peopleInfoList );
      resultTableMap[i][j] = await handlePriorityRanking( idList, i, j, peopleCountInShift, limitOfEachOneShiftsCount, isUserSetShiftLimit );
      peopleAvailableToShiftMap[i][j] = peopleAvailableToShiftMap[i][j].filter(val => !resultTableMap[i][j].includes(val));
    }
  }

  return Promise.resolve({
    resultTableMap,
    peopleInfoList,
    peopleAvailableToShiftMap
  });
};

var handlePersonPriority = async function ( idList, peopleInfoList, currentCol, currentRow ) {
  let priority = 0;

  for(var k=0; k<idList.length; k++) {
    for(var l=0; l<peopleInfoList.length; l++) {
      const personInfo = peopleInfoList[l];
      if ( idList[k] === personInfo.id ) {

        if ( personInfo.shiftsMap[currentCol][currentRow] === 1 ) {
          try {
            if ( resultTableMap[currentCol][currentRow-1].includes( personInfo.id ) ) {
              priority++;
            }
          } catch (e) {}
          try {
            if ( personInfo.shiftsMap[currentCol][currentRow+1] === 1 ) {
              priority++;
            }
          } catch (e) {}
        }
        peopleInfoList[l].priorityMap[currentCol][currentRow] = priority;
      }
    }
  }

  return Promise.resolve(peopleInfoList);
};

let handlePriorityRanking = async function ( idList, currentCol, currentRow, peopleCountInShift, limitOfEachOneShiftsCount, isUserSetShiftLimit ) {
  let peopleList = [];

  for(var k=0; k<idList.length; k++) {
    for(var l=0; l<peopleInfoList.length; l++) {
      const personInfo = peopleInfoList[l];
      if ( idList[k] === personInfo.id ) {
        const person = {
          id: personInfo.id,
          priorityRank: parseInt(personInfo.lastCountWeight) + parseInt(personInfo.continuousWeightMap[currentCol][currentRow])
        };
        peopleList.push(person);
      }
    }
  }

  peopleList = peopleList.sort(function (a, b) {
    return a.priorityRank < b.priorityRank ? 1 : -1;
  });

  let resultList = resultTableMap[currentCol][currentRow];
  for(var k=0; k<peopleList.length; k++) {
    for (var l=0; l<peopleInfoList.length; l++) {
      const personInfo = peopleInfoList[l];
      if ( peopleList[k].id === personInfo.id && resultList.length < peopleCountInShift && personInfo.usedCount < limitOfEachOneShiftsCount && personInfo.lastCount > 0 ) {
        if ( isUserSetShiftLimit ) {
          resultList.push( peopleList[k].id );
          personInfo.usedCount++;
          personInfo.lastCount--;
        } else {
          resultList.push( peopleList[k].id );
          personInfo.usedCount++;
          personInfo.lastCount--;
        }
      }
    }
  }

  if ( !isUserSetShiftLimit ) {
    for(var k=0; k<peopleList.length; k++) {
      for (var l=0; l<peopleInfoList.length; l++) {
        const personInfo = peopleInfoList[l];
        if ( peopleList[k].id === personInfo.id && resultList.length < peopleCountInShift && personInfo.lastCount > 0 ) {
          resultList.push( peopleList[k].id );
          personInfo.usedCount++;
          personInfo.lastCount--;
        }
      }
    }
  }

  return Promise.resolve(resultList);

};

var handleLastCountPeopleInfoList = async function ( idList, peopleInfoList ) {
  let peopleList = [];

  for(var i=0; i<idList.length; i++) {
    for(var j=0; j<peopleInfoList.length; j++) {
      const personInfo = peopleInfoList[j];
      if ( idList[i] === personInfo.id ) {
        const last = {
          id: personInfo.id,
          lastCount: personInfo.lastCount
        };
        peopleList.push(last)
      }
    }
  }

  peopleList = peopleList.sort(function (a, b) {
    return a.lastCount < b.lastCount ? 1 : -1;
  });

  let weight = 0;
  for(var i=0; i<peopleList.length; i++) {
    if ( i === 0 ) {
      peopleList[i].lastCountWeight = 0;
    } else if ( peopleList[i].lastCount === peopleList[i-1].lastCount ) {
      peopleList[i].lastCountWeight = weight;
    } else {
      peopleList[i].lastCountWeight = ++weight;
    }
  }

  for(var i=0; i<peopleList.length; i++) {
    for(var j=0; j<peopleInfoList.length; j++) {
      const personInfo = peopleInfoList[j];
      if ( peopleList[i].id === personInfo.id ) {
        peopleInfoList[j].lastCountWeight = peopleList[i].lastCountWeight;
      }
    }
  }

  return Promise.resolve(peopleInfoList);
};

var handleContinuousPeopleInfoList = async function ( idList, peopleInfoList, colsCount, rowsCount, currentCol, currentRow ) {
  let peopleList = [];

  for(var k=0; k<idList.length; k++) {
    for(var l=0; l<peopleInfoList.length; l++) {
      const personInfo = peopleInfoList[l];
      if ( idList[k] === personInfo.id ) {
        const continuous = {
          id: personInfo.id,
          continuousWeight: personInfo.priorityMap[currentCol][currentRow]
        };
        peopleList.push(continuous)
      }
    }
  }

  peopleList = peopleList.sort(function (a, b) {
    return a.continuousWeight > b.continuousWeight ? 1 : -1;
  });

  let weight = 0;
  for(var k=0; k<peopleList.length; k++) {
    if ( k === 0 ) {
      peopleList[k].continuousWeight = 0;
    } else if ( peopleList[k].continuousWeight === peopleList[k-1].continuousWeight ) {
      peopleList[k].continuousWeight = weight;
    } else {
      peopleList[k].continuousWeight = ++weight;
    }
  }

  for(var k=0; k<peopleList.length; k++) {
    for (var l=0; l<peopleInfoList.length; l++) {
      const personInfo = peopleInfoList[l];
      if ( peopleList[k].id === personInfo.id ) {
        peopleInfoList[l].continuousWeightMap[currentCol][currentRow] = peopleList[k].continuousWeight;
      }
    }
  }

  return Promise.resolve(peopleInfoList);

};

var makeEmptyMap = async function (colsCount, rowsCount) {
  let emptyMap = [];
  for (var i=0; i<colsCount; i++) {
    emptyMap.push([]);
    for (var j=0; j<rowsCount; j++) {
      emptyMap[i].push(0);
    }
  }

  return Promise.resolve(emptyMap);
};
