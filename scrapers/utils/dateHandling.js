
async function dateToString(choosenDate) { // could be used in saving (like naming the saved data from the choosen date from this date) 
    let dateStr = `${choosenDate.getFullYear()}-${choosenDate.getMonth() + 1}-${choosenDate.getDate()}`
    return dateStr
}

async function transformDate(str) {
    let [stopDay, stopMonth, stopYear] = str.split('-')
    return new Date(`${stopYear}-${stopMonth}-${stopDay}`)// need it so it transforms elbilad invalid date to a valid one
}


module.exports = {dateToString, transformDate}