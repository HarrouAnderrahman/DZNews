#!/usr/bin/env node

const { Command } = require('commander')
const {categories, scrape, displayCategories} = require('./scraperManager')
const interactiveCLI = require('./interactiveScraper')
const chalk = require('chalk')

const program = new Command(); // <-- setting up commander

// starting the cli
program
  .name(chalk.bold.bgCyan('DZNews-CLI'))
  .description(chalk.bold('Algerian News Webscraper'))
  .version('1.1.2');


program // listing the sources
  .command('sources')
  .description('List all available sources')
  .alias('s')
  .action(() => {
    const sources = Object.keys(categories)
    console.log(chalk.bold.inverse("Available sources : "))
    sources.forEach(source => console.log('- ' + source))
  });


program // listing the categories
  .command('cat <source>')
  .description('List categories of a specific source')
  .action(async (source) =>{
    const categories = await displayCategories(source);
    if (categories && categories.length > 0){
      console.log(chalk.bold.inverse(`Available categories for ${source} : `))
      categories.forEach(cat => 
        console.log('- ' + cat ) // so it organizes it
      )
    }
  });


program // the scraping command
  .command('scrape <source> <date> <category>')
  .description('scrapes a source with a specific category until a choosen date ')
  .option('-e, --export <option>', 'select an export option : csv, json')
  .option('-d, --directory <option>', 'Choose where you want to save the data')
  .action(async (source, date, category, options) =>{
    scrape(source, date, category, options.export, options.directory)
  });

program // the Interactive mode
  .command('interactive')
  .description('A very simple Interactive interface for beginners')
  .alias('i')
  .action(() =>{
    console.log(chalk.bold.inverse("DZNews interactive CLI"))
    interactiveCLI();
  });


program.parse(); // <-- Parsing the commands