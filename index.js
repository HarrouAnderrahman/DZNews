#!/usr/bin/env node

const { Command } = require('commander')

const program = new Command(); // <-- setting up commander

// starting the cli
program
  .name('DZNews-CLI')
  .description('Algerian News Webscraper')
  .version('1.0.0');
// The commands :
program
  .command('scrape')
  .description("Scrape articles from a specific news source, category, and date range.")
  .option()
  .action();
program
  .command()
  .description()
  .option()
  .action();
program
  .command()
  .description()
  .option()
  .action();
program
  .command()
  .description()
  .option()
  .action();
program.parse(); // <-- Parsing the commands