#!/usr/bin/env node

const {Command} = require('commander')

const program = new Command(); // <-- setting up commander

// starting the cli
program
  .name('DZNews-CLI')
  .description('Algerian News Webscraper')
  .version('1.0.0');

program.parse();