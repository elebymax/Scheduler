/**
 * Created by max on 2017/8/23.
 */

exports.priorityRank = async function ( peopleInfoList, peopleAvailableToShiftMap, colsCount, rowsCount ) {

  for (var i=0; i<peopleInfoList.length; i++ ) {
    peopleInfoList[i].continuousRankMap = await makeEmptyMap(colsCount, rowsCount);
  }

  for (var i=0; i<colsCount; i++) {
    for (var j=0; j<rowsCount; j++) {
      let idList = peopleAvailableToShiftMap[i][j];
      peopleInfoList = await handleLastCountPeopleInfoList( idList, peopleInfoList );
      peopleInfoList = await handleContinuousPeopleInfoList( idList, peopleInfoList, colsCount, rowsCount, i, j );
    }
  }

  return Promise.resolve(peopleInfoList);
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

  let rank = 0;
  for(var i=0; i<peopleList.length; i++) {
    if ( i === 0 ) {
      peopleList[i].lastCountRank = 0;
    } else if ( peopleList[i].lastCount === peopleList[i-1].lastCount ) {
      peopleList[i].lastCountRank = rank;
    } else {
      peopleList[i].lastCountRank = ++rank;
    }
  }

  for(var i=0; i<peopleList.length; i++) {
    for(var j=0; j<peopleInfoList.length; j++) {
      const personInfo = peopleInfoList[j];
      if ( peopleList[i].id === personInfo.id ) {
        peopleInfoList[j].lastCountRank = peopleList[i].lastCountRank;
      }
    }
  }

  return Promise.resolve(peopleInfoList);
};

var handleContinuousPeopleInfoList = async function ( idList, peopleInfoList, colsCount, rowsCount, i, j ) {
  let peopleList = [];

  for(var k=0; k<idList.length; k++) {
    for(var l=0; l<peopleInfoList.length; l++) {
      const personInfo = peopleInfoList[l];
      if ( idList[k] === personInfo.id ) {
        const continuous = {
          id: personInfo.id,
          continuousRank: personInfo.priorityMap[i][j]
        };
        peopleList.push(continuous)
      }
    }
  }

  peopleList = peopleList.sort(function (a, b) {
    return a.continuousRank > b.continuousRank ? 1 : -1;
  });

  let rank = 0;
  for(var k=0; k<peopleList.length; k++) {
    if ( k === 0 ) {
      peopleList[k].continuousRank = 0;
    } else if ( peopleList[k].continuousRank === peopleList[k-1].continuousRank ) {
      peopleList[k].continuousRank = rank;
    } else {
      peopleList[k].continuousRank = ++rank;
    }
  }

  for(var k=0; k<peopleList.length; k++) {
    for (var l=0; l<peopleInfoList.length; l++) {
      const personInfo = peopleInfoList[l];
      if ( peopleList[k].id === personInfo.id ) {
        peopleInfoList[l].continuousRankMap[i][j] = peopleList[k].continuousRank;
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
      emptyMap[i].push(-1);
    }
  }

  return Promise.resolve(emptyMap);
};

