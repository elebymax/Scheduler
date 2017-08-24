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

exports.changeMapToTable = async function( resultTableMap, colsAttrList, rowsAttrList, colsCount, rowsCount ) {
  let table = [];
  let AttrRow = [];

  for (var i=0; i<colsCount; i++) {
    AttrRow.push( colsAttrList[i+1].name );
  }
  AttrRow.unshift(" ");
  table.push(AttrRow);

  for (var i=0; i<rowsCount; i++) {
    table.push([]);
  }

  for (var i=0; i<rowsCount; i++) {
    table[i+1][0] = rowsAttrList[i].name;
    for (var j=0; j<colsCount; j++) {
      let names = "";
      for (var k=0; k<resultTableMap[j][i].length; k++) {
        if(k!=0) names+="; ";
        names += resultTableMap[j][i][k];
      }
      table[i+1][j+1] = names;
    }
  }

  return Promise.resolve(table);
};

var findPersonInfo = function ( id, peopleInfoList ) {
  for (var i=0; i<peopleInfoList.length; i++) {
    if ( id == peopleInfoList[i].id ) {
      return Promise.resolve( peopleInfoList[i].name );
    }
  }
};

var makeEmptyMap = async function ( colsCount, rowsCount ) {
  let emptyMap = [];
  for (var i=0; i<colsCount; i++) {
    emptyMap.push([]);
    for(var j=0; j<rowsCount; j++  ) {
      emptyMap[i].push([]);
    }
  }
  return Promise.resolve(emptyMap);
};
