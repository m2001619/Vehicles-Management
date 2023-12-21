const XLSX = require('xlsx');

export const convertToExcel = (arrData, sheetName) => {
  const excelUrl = convertObjectToExcel(arrData, sheetName);
  window.open(excelUrl);
};

function convertObjectToExcel(objectData, sheetName) {
  const flattenedData = objectData.map((obj) => flattenObject(obj));
  const worksheet = XLSX.utils.json_to_sheet(flattenedData);
  worksheet['!cols'] = getColumnWidths(flattenedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
  const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  return URL.createObjectURL(data);
}

function flattenObject(obj, parentKey = '') {
  let flattenedObject = {};

  for (let key in obj) {
    if (Object.hasOwn(obj, key)) {
      let newKey = parentKey ? `${parentKey}.${key}` : key;
      if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        flattenedObject = { ...flattenedObject, ...flattenObject(obj[key], newKey) };
      } else {
        flattenedObject[newKey] = obj[key];
      }
    }
  }

  return flattenedObject;
}

function getColumnWidths(data) {
  const columnWidths = [];
  const headerKeys = Object.keys(data[0]);

  for (let key of headerKeys) {
    const columnData = data.map((obj) => obj[key]);
    const columnWidth = getColumnMaxWidth(columnData, key);
    columnWidths.push({ wch: columnWidth });
  }

  return columnWidths;
}

function getColumnMaxWidth(columnData, key) {
  const headerWidth = key.length;
  const contentWidths = columnData.map((item) => (item ? String(item).length : 0));
  return Math.max(headerWidth, ...contentWidths);
}
