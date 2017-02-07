/* eslint-disable */
/**
 * Created by max on 2017/1/20.
 */
var peopleCountInShift = 0; //每班需要幾人

var shifting = function (fileToRead, peopleCount) {
  peopleCountInShift = peopleCount;
  var reader = new window.FileReader();
  reader.readAsText(fileToRead); // Read file into memory as UTF-8
  reader.onload = this.loadHandler; // Handle errors load
  reader.onerror = this.errorHandler
};

var loadHandler = function (event) {
  var csv = event.target.result;
  processData(csv);
};

var processData = function (csv) {
  var lines = [];
  var allTextLines = csv.split(/\r\n|\n/);
  for (var i = 0; i < allTextLines.length; i++) {
    var data = allTextLines[i].split(',');
    var tarr = [];
    for (var j = 0; j < data.length; j++) {
      tarr.push(data[j].replace(/"/g, ''));
    }
    lines.push(tarr);
  }
  formatData(lines);
};

var formatData = function (lines) {
  var peopleCount = lines.length-1;

  var argv0 = findHead(lines);
  var daysOrderList = argv0[0]; //需要考慮的標頭所在位置
  var daysNameList = argv0[1]; //天數的名稱

  var daysCount = daysOrderList.length-1;
  var nameList = makeNameList(lines, daysOrderList[0], peopleCount);
  var peopleAlreadyBeenShiftCountList = makePeopleAlreadyBeenShiftCountList(peopleCount);

  var argv1 = makeTotalAcceptableShiftsMap(lines, daysOrderList, daysCount, peopleCount);
  var totalAcceptableShiftsMap = argv1[0]; //每個班次可被排班的人，以編號表示
  var shiftNameList = argv1[1]; //每個班次的名稱

  var argv2 = makeTotalAcceptableShiftsCountMap(totalAcceptableShiftsMap, daysCount);
  var totalAcceptableShiftsCountMap = argv2[0]; //每個班次可被排班的人數
  var shiftsCountInDayList = argv2[1]; //每天的總班次數
  var totalShiftsCount = argv2[2]; //整個班表的總班數

  var limitOfEachOneShiftsCount = Math.floor( (peopleCountInShift * totalShiftsCount) / peopleCount ); //每人最多能排的班數

  var storageShiftsMap = putShiftsUnderLimitInStorageShiftsMap(totalAcceptableShiftsMap, totalAcceptableShiftsCountMap, peopleAlreadyBeenShiftCountList, shiftsCountInDayList, daysCount, peopleCountInShift, limitOfEachOneShiftsCount);
  //console.log(storageShiftsMap);
  var finishedShiftsMap = correspondKeyToName(storageShiftsMap, nameList, daysCount);
  //console.log(finishedShiftsMap);
  var table = changeMapToTable(storageShiftsMap, finishedShiftsMap, daysNameList, shiftNameList, daysCount);

  convertToCsv(table);
};

var findHead = function (lines) {
  var daysOrderList = [];
  var daysNameList = [];
  for (var i = 0; i < lines[0].length; i++) {
    var daysNum = lines[0][i].split('.');
    var index = parseInt(daysNum[0]);
    if (index >= 0) {
      daysOrderList[index] = i;

      if(index>0 && daysNameList[index-1]==null && daysNum.length>0) {
        daysNameList[index-1] = ' ';
        if(daysNum.length > 1) daysNameList[index-1] = daysNum[1];
        if(daysNum.length > 2) {
          for (var l = 2; l < daysNum.length; l++) {
            daysNameList[index-1] += ('.'+daysNum[l]);
          }
        }
      }
    }
  }
  return [daysOrderList, daysNameList];
};

var makeNameList = function(lines, nameOrder, peopleCount) {
  var nameList = [];
  for(var i=0;i<peopleCount;i++) {
    nameList[i] = lines[i+1][nameOrder];
  }
  return nameList;
};

var makePeopleAlreadyBeenShiftCountList = function(peopleCount) {
  var peopleAlreadyBeenShiftCountList = [];
  for(var i=0;i<peopleCount;i++) peopleAlreadyBeenShiftCountList[i] = 0;
  return peopleAlreadyBeenShiftCountList;
};

var makeTotalAcceptableShiftsMap = function(lines, daysOrderList, daysCount, peopleCount) {
  var totalAcceptableShiftsMap = [];
  var shiftName = [];
  var maxIndex = 0;
  for(var i=0;i<daysCount;i++) totalAcceptableShiftsMap.push([]);
  for(var i=0;i<peopleCount;i++) {
    for(var j=0;j<daysCount;j++) {
      var shifts = lines[i+1][daysOrderList[j+1]].split(';');
      for(var k=0;k<shifts.length;k++) {
        var shiftNum = shifts[k].split('.');
        var index = parseInt(shiftNum[0]); //班次的編號
        if(index > maxIndex) maxIndex = index;
        if(totalAcceptableShiftsMap[j][index-1]==null) totalAcceptableShiftsMap[j][index-1] = [i];
        else totalAcceptableShiftsMap[j][index-1].push(i);

        if(shiftName[index-1]==null && shiftNum.length>0) {
          shiftName[index-1] = ' ';
          if(shiftNum.length > 1) shiftName[index-1] = shiftNum[1];
          if(shiftNum.length > 2) {
            for (var l = 2; l < shiftNum.length; l++) {
              shiftName[index-1] += ('.'+shiftNum[l]);
            }
          }
        }
      }
    }
  }
  for(var i=0 ; i<daysCount ; i++) {
    for(var j=0 ; j<maxIndex ; j++) {
      if(totalAcceptableShiftsMap[i][j]==null) {
        totalAcceptableShiftsMap[i][j] = [];
      }
    }
  }
  return [totalAcceptableShiftsMap, shiftName];
};

var makeTotalAcceptableShiftsCountMap = function(totalAcceptableShiftsMap, daysCount) {
  var totalAcceptableShiftsCountMap = [];
  var shiftsCountInDayList = [];
  var totalShiftsCount = 0;
  for(var i=0;i<daysCount;i++) {
    totalAcceptableShiftsCountMap.push([]);
    shiftsCountInDayList[i] = totalAcceptableShiftsMap[i].length;
    totalShiftsCount += shiftsCountInDayList[i];
    for(var j=0;j<shiftsCountInDayList[i];j++) {
      totalAcceptableShiftsCountMap[i][j] = totalAcceptableShiftsMap[i][j].length;
    }
  }
  return [totalAcceptableShiftsCountMap, shiftsCountInDayList, totalShiftsCount];
};

var putShiftsUnderLimitInStorageShiftsMap = function(totalAcceptableShiftsMap, totalAcceptableShiftsCountMap, peopleAlreadyBeenShiftCountList, shiftsCountInDayList, daysCount, peopleCountInShift, limitOfEachOneShiftsCount) {
  var storageShiftsMap = [];
  for(var i=0;i<daysCount;i++) {
    storageShiftsMap[i] = [];
    for(var j=0;j<shiftsCountInDayList[i];j++) {
      storageShiftsMap[i][j] = [];
      if(( totalAcceptableShiftsCountMap[i][j] > 0 ) && ( totalAcceptableShiftsCountMap[i][j] <= peopleCountInShift )) {
        for(var k=0;k<totalAcceptableShiftsMap[i][j].length;k++) {
          if(peopleAlreadyBeenShiftCountList[totalAcceptableShiftsMap[i][j][k]] <= limitOfEachOneShiftsCount) {
            peopleAlreadyBeenShiftCountList[totalAcceptableShiftsMap[i][j][k]]++;
            storageShiftsMap[i][j].push(totalAcceptableShiftsMap[i][j][k]);
          }
        }
      }
    }
  }
  return putShiftsOverLimitInStorageShiftsMap(storageShiftsMap, totalAcceptableShiftsMap, totalAcceptableShiftsCountMap, peopleAlreadyBeenShiftCountList, shiftsCountInDayList, daysCount, peopleCountInShift, limitOfEachOneShiftsCount);
};

var putShiftsOverLimitInStorageShiftsMap = function(storageShiftsMap, totalAcceptableShiftsMap, totalAcceptableShiftsCountMap, peopleAlreadyBeenShiftCountList, shiftsCountInDayList, daysCount, peopleCountInShift, limitOfEachOneShiftsCount) {
  for(var i=0;i<daysCount;i++) {
    for(var j=0;j<shiftsCountInDayList[i];j++) {
      if(totalAcceptableShiftsCountMap[i][j] > peopleCountInShift) {

        var continuousPriorityList;
        var fairPriorityList;

        fairPriorityList = makeFairPriorityList( i, j, totalAcceptableShiftsMap, totalAcceptableShiftsCountMap, peopleAlreadyBeenShiftCountList);
        continuousPriorityList = makeContinuousPriorityList( i, j, storageShiftsMap, totalAcceptableShiftsMap, totalAcceptableShiftsCountMap, peopleAlreadyBeenShiftCountList);
        var argv = compareWithTwoPriority( i, j, storageShiftsMap, peopleAlreadyBeenShiftCountList, fairPriorityList, continuousPriorityList, peopleCountInShift, limitOfEachOneShiftsCount);
        storageShiftsMap = argv[0];
        peopleAlreadyBeenShiftCountList = argv[1];
      }
    }
  }
  return storageShiftsMap;
};

var makeFairPriorityList = function(day, shift, totalAcceptableShiftsMap, totalAcceptableShiftsCountMap, peopleAlreadyBeenShiftCountList) {
  var fairPriorityList = [];
  var shiftsCountList = [];
  var shiftsCountIndex = [];
  var shiftsCountClone;
  for(var k=0;k<totalAcceptableShiftsCountMap[day][shift];k++) {
    shiftsCountList[k] = peopleAlreadyBeenShiftCountList[totalAcceptableShiftsMap[day][shift][k]];
    shiftsCountIndex[k] = totalAcceptableShiftsMap[day][shift][k];
  }
  shiftsCountClone = JSON.parse(JSON.stringify(shiftsCountList));
  shiftsCountList = shiftsCountList.sort(function (a, b) {return a - b});
  for(var k=0;k<shiftsCountList.length;k++) {
    for(var l=0;l<shiftsCountIndex.length;l++) {
      if (shiftsCountList[k] == shiftsCountClone[l]) {
        fairPriorityList[k] = shiftsCountIndex[l];
        shiftsCountClone[l] = -1;
        shiftsCountIndex[l] = -1;
        break;
      }
    }
  }
  return fairPriorityList;
};

var makeContinuousPriorityList = function(day, shift, storageShiftsMap, totalAcceptableShiftsMap, totalAcceptableShiftsCountMap, peopleAlreadyBeenShiftCountList) {
  var continuousPriorityList = [];
  var continuousCountList = [];
  var continuousCountCloneList;
  var continuousCountIndex = [];

  for(var k=0;k<totalAcceptableShiftsCountMap[day][shift];k++) {
    continuousCountList[k] = 0;
    continuousPriorityList[k] = 0;
  }

  for(var k=0;k<totalAcceptableShiftsCountMap[day][shift];k++) {
    if(storageShiftsMap[day][shift-1]!=null) {  //判斷是否超出邊界
      for (var l=0; l<totalAcceptableShiftsCountMap[day][shift]; l++) {
        if (totalAcceptableShiftsMap[day][shift][k] == storageShiftsMap[day][shift-1][l]) {
          continuousCountList[k]++;
        }
      }
    }
    if(storageShiftsMap[day][shift+1]!=null) {  //判斷是否超出邊界
      for (var l = 0; l < totalAcceptableShiftsCountMap[day][shift]; l++) {
        if (totalAcceptableShiftsMap[day][shift][k] == totalAcceptableShiftsMap[day][shift+1][l]) {
          continuousCountList[k]++;
        }
      }
    }
    continuousCountIndex.push(totalAcceptableShiftsMap[day][shift][k]); //順序對應到key
    continuousCountCloneList = JSON.parse(JSON.stringify(continuousCountList));//順序對應到優先權值
  }
  continuousCountList = continuousCountList.sort(function (a, b) {return b - a}); //順序對應到優先權值(排序過)
  for(var k=0;k<totalAcceptableShiftsCountMap[day][shift];k++) {
    for(var l=0;l<totalAcceptableShiftsCountMap[day][shift];l++) {
      if(continuousCountList[k]==continuousCountCloneList[l]) {
        continuousPriorityList[k] = continuousCountIndex[l];
        continuousCountCloneList[l] = -1;
        break;
      }
    }
  }
  return continuousPriorityList;
};

var compareWithTwoPriority = function( day, shift, storageShiftsMap, peopleAlreadyBeenShiftCountList, fairPriorityList, continuousPriorityList, peopleCountInShift, limitOfEachOneShiftsCount, remainderShiftsCount) {
  //先取第一個陣列裡的一個值，再找第二個陣列裡相同的值，把兩個的index相加存在一個陣列，而再以這個陣列的index再做一個陣列作為索引，對應到key
  var prioritySumList = []; //所有優先權加總
  var prioritySumCloneList;
  var map = [];
  var resultPriority = [];

  for(var i=0;i<fairPriorityList.length;i++) {
    for(var j=0;j<continuousPriorityList.length;j++) {
      if(fairPriorityList[i] == continuousPriorityList[j]) {
        prioritySumList[i] = Math.floor(i/2)+j;
        map[i] = fairPriorityList[i];
      }
    }
  }

  prioritySumCloneList = JSON.parse(JSON.stringify(prioritySumList));
  prioritySumList = prioritySumList.sort(function (a, b) {return a - b});

  for(var i=0 ; i<prioritySumList.length ; i++) {
    for(var j=0 ; j<prioritySumCloneList.length ; j++) {
      if( (prioritySumList[i] === prioritySumCloneList[j]) && (peopleAlreadyBeenShiftCountList[map[j]] < limitOfEachOneShiftsCount) ) {
          resultPriority.push(map[j]);
          prioritySumCloneList[j] = -1;
          break;
      }
    }
  }

  for(var i=0 ; i<prioritySumList.length ; i++) {
    for(var j=0 ; j<prioritySumCloneList.length ; j++) {
      if(prioritySumList[i] === prioritySumCloneList[j]) {
        resultPriority.push(map[j]);
        prioritySumCloneList[j] = -1;
        break;
      }
    }
  }

  for(var i=0;i<peopleCountInShift;i++) {
    storageShiftsMap[day][shift].push(resultPriority[i]);
    peopleAlreadyBeenShiftCountList[resultPriority[i]]++;
  }

  return [storageShiftsMap, peopleAlreadyBeenShiftCountList];
};

var correspondKeyToName = function( storageShiftsMap, namesList, daysCount) {
  var finishedShiftsMap;
  finishedShiftsMap = JSON.parse(JSON.stringify(storageShiftsMap));
  for(var i=0;i<daysCount;i++) {
    for(var j=0;j<storageShiftsMap[i].length;j++) {
      for(var k=0;k<storageShiftsMap[i][j].length;k++) {
        finishedShiftsMap[i][j][k] = namesList[storageShiftsMap[i][j][k]];
      }
    }
  }
  return finishedShiftsMap;
};

var changeMapToTable = function(storageShiftsMap, finishedShiftsMap, daysNameList, shiftNameList, daysCount) {
  var table = [];
  daysNameList.unshift(" ");
  table.push(daysNameList);
  for(var i=0;i<shiftNameList.length;i++) {
    table.push([]);
    table[i+1][0] = shiftNameList[i];
    for(var j=0;j<daysCount;j++) {
      var peoples = "";
      for(var k=0;k<storageShiftsMap[j][i].length;k++) {
        if(k!=0) peoples+="; ";
        peoples += finishedShiftsMap[j][i][k];
      }
      table[i+1][j+1] = peoples;
    }
  }
  return table;
};

var convertToCsv = function (table) {
  var csvContent = '';
  var dataString;
  table.forEach(function(infoArray, index){
    dataString = infoArray.join(',');
    csvContent += dataString+ '\n';
  });
  var link = window.document.createElement("a");
  link.setAttribute("href", "data:text/csv;charset=utf-8,%EF%BB%BF" + encodeURI(csvContent));
  link.setAttribute("download", "排完的班表.csv");
  link.click();
};

function exportData(table) {
  var data = '';
  for (var i=0;i<table.length;i++) {
    var sep = '';
    for (var j=0;j<table[i].length;j++) {
      data +=  sep + table[i][j];
      sep = ',';
    }
    data += '\r\n';
  }
  var exportLink = document.createElement('a');
  exportLink.setAttribute('href', 'data:text/csv;base64,' + window.btoa(data));
  exportLink.appendChild(document.createTextNode('test.csv'));
  document.getElementById('results').appendChild(exportLink);
}

var compute = {
  shifting: shifting,
  loadHandler: loadHandler,
  processData: processData,
  formatData: formatData
};

export default compute;
