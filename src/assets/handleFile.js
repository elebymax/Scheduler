/**
 * Created by max on 2017/8/24.
 */

exports.convertToCsv = function (table) {
  let csvContent = '';
  let dataString;
  table.forEach(function(infoArray, index){
    dataString = infoArray.join(',');
    csvContent += dataString+ '\n';
  });
  let link = window.document.createElement("a");
  link.setAttribute("href", "data:text/csv;charset=utf-8,%EF%BB%BF" + encodeURI(csvContent));
  link.setAttribute("download", "排完的班表.csv");
  link.click();
};
