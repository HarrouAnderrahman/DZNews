const chalk = require("chalk");
const { execSync } = require("child_process");
const { categories } = require("../scraperManager");
const { dateToString } = require("../scrapers/utils/dateHandling");
const sources = Object.keys(categories);

function randomCat(source) {
  // Return a sources category
  const sourceCategories = Object.keys(categories[source]);
  const randomNumber = Math.floor(Math.random() * sourceCategories.length);
  return sourceCategories[randomNumber];
}

async function getLastweek() {
  // 7 days is good for a test i guess
  const today = new Date();
  let lastWeek = new Date(today);
  lastWeek.setDate(today.getDate() - 7);
  return await dateToString(lastWeek);
}

async function test(sources) {
  // main function
  let commands = [];
  for (source of sources) {
    let date = await getLastweek();
    let cat = randomCat(source);
    commands.push(`node index.js scrape ${source} ${date} ${cat} -e json`);
  }
  commands.forEach((cmd) => {
    try {
      console.log(chalk.bold.bgGreenBright(`Running : ${cmd}`));
      execSync(cmd, { stdio: "inherit" });
    } catch (error) {
      console.error(
        chalk.bold.bgRedBright(`Command failed: ${cmd}\n${error.message}`)
      );
    }
  });
}
test(sources);
