async function dateToString(choosenDate) {
  // could be used in saving (like naming the saved data from the choosen date from this date)
  const zero = "0";
  let dateStr = `${choosenDate.getFullYear()}-${
    choosenDate.getMonth() + 1
  }-${choosenDate.getDate()}`;
  if (choosenDate.getMonth() < 9) { // i hated how it didn't display a zero before a single number (i might be stupid)
    let arr = dateStr.split("");
    arr.splice(5, 0, ...zero);
    dateStr = arr.join("");
  }
  if (choosenDate.getDate() < 10) {
    let arr = dateStr.split("");
    arr.splice(8, 0, ...zero);
    dateStr = arr.join("");
  }
  return dateStr;
}

async function transformDate(str) {
  let [stopDay, stopMonth, stopYear] = str.split("-");
  return new Date(`${stopYear}-${stopMonth}-${stopDay}`); // need it so it transforms elbilad invalid date to a valid one
}

module.exports = { dateToString, transformDate };
