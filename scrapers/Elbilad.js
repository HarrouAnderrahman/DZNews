const { error } = require('console');
const fs = require('fs')
const puppeteer = require('puppeteer')

async function run() {
    const browser = await puppeteer.launch();
    console.log('Opening Browser ...')
    const page = await browser.newPage();
    await page.goto('https://www.elbilad.net/national')
    console.log('Accessing Elbilad ...')
    await page.waitForSelector('#categoryArticles > ul > li');
    console.log('Extracting News ...')
    let scrapedData = await page.$$eval('#categoryArticles > ul > li', news => news.map(
        (articl) =>{ 
             const title = articl.querySelector('h3')?.textContent.trim() || ''
            return {title}
            }
    ))
    await browser.close();
    const filteredData = scrapedData.filter(item => item.title); // to remove null values
    fs.writeFile('ElbiladData.json', JSON.stringify(filteredData),(err)=>{
        if (err) throw error
        console.log('File Saved!')
    })
}
run();