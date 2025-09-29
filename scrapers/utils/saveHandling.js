const fs = require ('fs')
const path = require('path')


function csvEscape(content) { // for fixing issue : https://github.com/HarrouAnderrahman/DZNews/issues/2
    content = String(content)
    content = content.replace(/"/g, '""') // <-- to replace single quotes
    if(content.includes(',') || content.includes("\n") || content.includes('"')) {
        content = `"${content}"`;
    }
    return content
}


async function exportingData(fileName , scrapedData, option) { // the main scraping function
    try {
        if (!option) {
            option = 'json'
        }
        if(option.toLowerCase() !== 'json' && option.toLowerCase() !== 'csv'){
            throw new Error('invalid export option')
        }
        const filePath = path.join(__dirname, "..", "..", "/scrapedData/")
        const fileData = path.join(__dirname, "..", "..", "/scrapedData/", `${fileName}.${option}`) 
        fs.mkdir(filePath, {recursive: true}, 
            (err)=>{
                if (err) throw err
            })
        if (option.toLowerCase() === 'csv') {
            const header = ['title', 'link', 'date', 'content', 'author']
            let rows = [header.join(',')]
            scrapedData.forEach(articl => {
                let row = [
                    csvEscape(articl.title),
                    csvEscape(articl.link),
                    csvEscape(articl.date),
                    csvEscape(articl.content.contentData),
                    csvEscape(articl.content.author)
                ]
                rows.push(row.join(','))
            });
            const csvFile = rows.join("\n")

            fs.writeFile(fileData, csvFile,
            (err)=>{
                if (err) {
                    throw err
                }
                else{
                    console.log(`Data saved at : ${filePath}`)
                }
            })
        }
        else {
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
        
    } catch (error) {
        console.error(error)
    }
    
}

module.exports = exportingData