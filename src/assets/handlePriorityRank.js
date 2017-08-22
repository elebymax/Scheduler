/**
 * Created by max on 2017/8/23.
 */

let peopleInfoList;

exports.addLastCountPriorityRank = async function ( infoList, peopleAvailableToShiftMap, colsCount, rowsCount ) {
  peopleInfoList = infoList;

  for (var i=0; i<colsCount; i++) {
    for (var j=0; j<rowsCount; j++) {
      let idList = peopleAvailableToShiftMap[i][j];
      await handleLastCountPeopleList( idList );
    }
  }

  return Promise.resolve(peopleInfoList);
};

var handleLastCountPeopleList = async function (idList) {
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
      peopleList[i].lastCountPriority = 0;
    } else if ( peopleList[i].lastCount === peopleList[i-1].lastCount ) {
      peopleList[i].lastCountPriority = rank;
    } else {
      peopleList[i].lastCountPriority = ++rank;
    }
  }

  for(var i=0; i<peopleList.length; i++) {
    for(var j=0; j<peopleInfoList.length; j++) {
      const personInfo = peopleInfoList[j];
      if ( peopleList[i].id === personInfo.id ) {
        peopleInfoList[j].lastCountPriority = peopleList[i].lastCountPriority;
      }
    }
  }

  return Promise.resolve();
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
