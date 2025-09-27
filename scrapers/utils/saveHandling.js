const fs = require ('fs')
const path = require('path')
async function exportingData(fileName , scrapedData, option = 'JSON') {
    const filePath = path.join(__dirname, "..", "..", "/scrapedData/")
    const fileData = path.join(__dirname, "..", "..", "/scrapedData/", `${fileName}.${option}`) 
    fs.mkdir(filePath, {recursive: true}, 
        (err)=>{
            if (err) throw err
        })
    fs.writeFile(fileData, JSON.stringify(scrapedData),
        (err)=>{
            if (err) {
                throw err
            }
            else{
                console.log(`Data saved at : ${filePath}`)
            }
        })
}
module.exports = exportingData