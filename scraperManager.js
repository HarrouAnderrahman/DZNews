
const Ennaharscraper = require('./scrapers/Ennahar')
const Elbiladscraper = require('./scrapers/Elbilad')
const AlgerieMaintenantscraper = require('./scrapers/AlgerieMaintenant')
const Echouroukscraper = require("./scrapers/echoroukonline")
const DZTube = require("./scrapers/DZTube")
const Elkhabar = require("./scrapers/Elkhabar")
const chalk = require('chalk')

const scrapers = {
    ennahar:Ennaharscraper.run,
    elbilad:Elbiladscraper.run,
    algeriemaintenant:AlgerieMaintenantscraper.run,
    echourouk:Echouroukscraper.run,
    dztube:DZTube.run,
    elkhabar:Elkhabar.run
}

const categories = {
    ennahar:Ennaharscraper.categories,
    elbilad:Elbiladscraper.categories,
    algeriemaintenant:AlgerieMaintenantscraper.categories,
    echourouk:Echouroukscraper.categories,
    dztube:DZTube.categories,
    elkhabar:Elkhabar.categories
}

async function scrape(source, date, category, saveOption) { 
    try {
        const choosenSource = source.toLowerCase()
        const scraper = scrapers[choosenSource];
        if (!scraper) {
            throw new Error (
                `Unknown source : ${source} ` + 
                chalk.reset("\n Please run : ") +
                chalk.inverse("dznews sources")
            )
        }

        const dateObj = new Date(date)
        const now = new Date
        dateObj.setHours(0,0,0,0);

        if (isNaN(dateObj.getTime()) || date.length !== 10) {
            throw new Error (
                `Invalid date: ${date}` +
                chalk.reset("\n Dates should be formatted as : YYYY/MM/DD ")
            )
        }

        if (dateObj > now) throw new Error (
                `Invalid date: ${date}` +
                chalk.reset("\n Choosen Date must be before the current date ")
            )


        const choosenCategory = categories[choosenSource][category.toLowerCase()]

        if (!choosenCategory) {
            throw new Error (
                `Unknown category: ${category}` +
                chalk.reset("\n Please run : ") +
                chalk.inverse("dznews cat <source>")
            )
        }
        return await scraper(dateObj, choosenCategory, saveOption) // if you don't understand what's going on here , please check the code in ./scrapers

    } catch (error) {
        console.error(chalk.bold.red(error) + "\n For more info please check the docs")
    }
}
async function displayCategories(source) {
    try {
        const choosenSource = source.toLowerCase()
        const availableCategories = categories[choosenSource]
        if(!availableCategories) {
            throw new Error (`Unknown source : ${source} ` + 
                chalk.reset("\n Please run : ") +
                chalk.inverse("dznews sources"))
        }
        return Object.keys(availableCategories)
    } catch (error) {
        console.error(chalk.bold.red(error) + "\n For more info please check the docs")
    }
}
module.exports = {categories ,scrape, displayCategories}