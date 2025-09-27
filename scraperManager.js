
const Ennaharscraper = require('./scrapers/Ennahar')
const Elbiladscraper = require('./scrapers/Elbilad')
const AlgerieMaintenantscraper = require('./scrapers/AlgerieMaintenant')

const scrapers = {
    ennahar:Ennaharscraper.run,
    elbilad:Elbiladscraper.run,
    algeriemaintenant:AlgerieMaintenantscraper.run
}

const categories = {
    ennahar:Ennaharscraper.categories,
    elbilad:Elbiladscraper.categories,
    algeriemaintenant:AlgerieMaintenantscraper.categories
}

async function scrape(source, date, category) { 
    try {
        const choosenSource = source.toLowerCase()
        const choosenCategory = categories[choosenSource][category.toLowerCase()]
        const scraper = scrapers[choosenSource];
        const dateObj = new Date(date)
        if (!scraper) {
            throw new Error (`Uknown source: ${source}`)
        }
        if (isNaN(dateObj.getTime())) {
            throw new Error (`Invalid date: ${date}`)
        }
        if (!choosenCategory) {
            throw new Error (`Uknown category: ${category}`)
        }
        return await scraper(dateObj, choosenCategory) // if you don't understand what's going on here , please check the code in ./scrapers

    } catch (error) {
        console.error(error)
    }
}
async function displayCategories(source) {
    try {
        const choosenSource = source.toLowerCase()
        const availableCategories = categories[choosenSource]
        if(!availableCategories) {
            throw new Error (`Uknown source : ${source}`)
        }
        return Object.keys(availableCategories)
    } catch (error) {
        console.error(error)
    }
}
module.exports = {scrape, displayCategories}