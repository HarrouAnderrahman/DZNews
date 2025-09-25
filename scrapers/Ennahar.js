const axios = require('axios'); 
const cheerio = require('cheerio');
const { error } = require('console');
const fs = require('fs')

const scrapedData = [];
const userDate = new Date('2025-09-25')
async function scrape(choosenDate) {
    try {
        let keepGoing = true
        let i = 1
        while(keepGoing){
            let page = `https://www.ennaharonline.com/algeria/page/${i}/`
            const response = await axios.get(page)
            if (response.status == 200){
                console.log(`scraping : ${page}`)
                const html = response.data
                const $ = cheerio.load(html)
                const totalNews = $('.card__meta')
                let n = 0
                for (const news of totalNews ){
                    const header = $(news).find('.bunh').text()
                    const date = $(news).find('.card__mfit').attr('datetime')
                    const link = $(news).find('.bunh').attr('href') // lets scrape this page too
                    const pageContent = await axios.get(link)
                    const $1 = cheerio.load(pageContent.data)
                    const author = ($1('.sgb1__amta').find('[href="#"]').text()).replace("\n\t\t\t\t\t\t\t\t\t\t\t", "")
                    const content = $1('.artx').find('p').text()
                    if(date){
                        dateObj = new Date (date)
                        if(choosenDate < dateObj){
                            n += 1;
                            console.log(`Scraping article ${n}...`)
                            scrapedData.push({
                                'title':header,
                                'date':date,
                                'link':link,
                                'content':{
                                    'author':author,
                                    'content':content
                                }
                            })
                        }else{
                            keepGoing = false
                            console.log("Reached the end date")
                            break;
                        }
                    }
                }
                if(keepGoing) i++;
            } else{
                keepGoing = false
                throw new Error("Coudln't load the Page , response.status != 200")
            }

        }
    } catch (error) {
        console.error(error)
    }
    fs.writeFile('EnnaharData.json', JSON.stringify(scrapedData),(err) =>{
        if (err) throw err;
        console.log('File saved')
    })
}
scrape(userDate);