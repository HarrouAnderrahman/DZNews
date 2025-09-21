const { error } = require('console');
const fs = require('fs')
const puppeteer = require('puppeteer')

const scrapedData = [];

async function run() {
    const browser = await puppeteer.launch();
    console.log('Opening Browser ...')
    const page = await browser.newPage();
    await page.goto('https://www.elbilad.net/national', {timeout:60000})
    console.log('Accessing Elbilad ...')
    await page.waitForSelector('#categoryArticles > ul > li');
    console.log('Extracting News ...')
    await page.$$eval('#categoryArticles > ul > li', news => news.map(
        (articl) =>{ 
             const title = articl.querySelector('h3').textContent.trim()
             scrapedData.push({
                title: title
             })
            }
    ))
    await browser.close();
    fs.writeFile('ElbiladData.JSON', JSON.stringify(scrapedData),(err)=>{
        if (err) throw error
        console.log('File Saved!')
    })
}
run();