/**
 * Created by max on 2017/8/22.
 */

exports.peoplePriorityList = async function ( peopleInfoList, colsCount, rowsCount ) {

  for (var i=0; i<peopleInfoList.length; i++) {
    let personPriorityMap = await makeEmptyMap(colsCount, rowsCount);
    for (var j=0; j<colsCount; j++) {
      for (var k=0; k<rowsCount; k++) {
        personPriorityMap[j][k] = await handlePersonPriority( peopleInfoList[i], j, k );
      }
    }
    peopleInfoList[i].priorityMap = personPriorityMap;
  }

  return Promise.resolve(peopleInfoList);
};

var handlePersonPriority = async function ( personInfo, j, k ) {
  let priority = 0;
  if ( personInfo.shiftsMap[j][k] === 1 ) {
    try {
      if ( personInfo.shiftsMap[j][k-1] === 1 ) {
        priority++;
      }
    } catch (e) {}
    try {
      if ( personInfo.shiftsMap[j][k+1] === 1 ) {
        priority++;
      }
    } catch (e) {}
  }

  return Promise.resolve(priority);
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
