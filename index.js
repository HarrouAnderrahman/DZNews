#!/usr/bin/env node

const { Command } = require('commander')
const {categories, scrape, displayCategories} = require('./scraperManager')

const program = new Command(); // <-- setting up commander

// starting the cli
program
  .name('DZNews-CLI')
  .description('Algerian News Webscraper')
  .version('0.1.0');


program // listing the sources
  .command('sources')
  .description('List all available sources')
  .action(() => {
    const sources = Object.keys(categories)
    console.log("Available sources :")
    sources.forEach(source => console.log('- ' + source))
  });


program // listing the categories
  .command('cat <source>')
  .description('List categories of a specific source')
  .action(async (source) =>{
    const categories = await displayCategories(source);
    if (categories && categories.length > 0){
      console.log(`Available categories for ${source} :`)
      categories.forEach(cat => 
        console.log('- ' + cat ) // so it organizes it
      )
    }
  });


program // the scraping command
  .command('scrape <source> <date> <category>')
  .description('scrapes a specific source with a choosen source until a choosen date ')
  .action(async (source, date, category) =>{
    scrape(source, date, category)
  })


program.parse(); // <-- Parsing the commands