const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const exportingData = require("./utils/saveHandling");
const { dateToString, transformDate } = require("./utils/dateHandling");
const axiosGetRetry = require("./utils/axiosConfig");

const categories = {
  // easier and more efficient to list categories this way
  national: "nation",
  hightech: "hightech",
  economics: "economie",
  society: "societe",
  islam: "islam",
  sports: "sport",
  international: "monde",
  culture: "culture",
};

async function run(choosenDate, choosenCategory, saveOption) {
  // same as Elbilad scraper with some changes
  let browser;
  try {
    let scrapedData = [];

    const dateStr = await dateToString(choosenDate);

    console.log(`Scraping the ${choosenCategory} category, until ${dateStr}`);

    browser = await puppeteer
      .launch
      // { headless: false } // <-- For debugging
      ();

    console.log("Opening Browser ...");

    const page = await browser.newPage();

    // making the scraper skipping images
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      if (["image"].includes(req.resourceType())) {
        req.abort();
      } else {
        req.continue();
      }
    }); // <-- The reason is to make it load faster

    await page.goto(`https://www.elkhabar.com/${choosenCategory}/`, {
      timeout: 60000,
    });

    console.log("Accessing elkhabar ...");

    await page.waitForSelector("#categoryArticles > ul"); // waiting for the news to load so it doesn't mess up
    console.log("Checking News ...");
    // making a while loop to extract only news that's after the user's choosen date
    let keepGoing = true;

    while (keepGoing) {
      let articlCount = await page.$$eval(
        "#categoryArticles > ul > *", // used * and not li because ads places will count in li index and caused a problem
        (articleNum) => articleNum.length - 1
      );
      // console.log(`Loaded articles : ${articlCount}`); // <-- For debugging
      let extractLastDate = await page.$eval(
        `#categoryArticles > ul > li:nth-child(${articlCount}) > p`,
        (date) => date.textContent.trim().slice(0, 10)
      ); // the date is valid so it doesnt need any date manipulation

      // console.log(`Last loaded date : ${extractLastDate}`); // <-- For debugging

      let stopDate = await transformDate(extractLastDate);

      // console.log(`stopDate valid : ${stopDate}`); // <-- For debugging

      if (choosenDate <= stopDate) {
        await page.waitForSelector(
          "#categoryArticles > ul > li.link-btn.wide > a"
        ); // the button id

        await page.click("#categoryArticles > ul > li.link-btn.wide > a");

        console.log("clicked the load more button...");

        await page.waitForFunction(
          // this code will wait for other articles to load after pressing the button
          (prevCount) => {
            return (
              document.querySelectorAll("#categoryArticles > ul > li").length -
                1 >
              prevCount
            );
          },
          { timeout: 15000 },
          articlCount // <<--- this is passed as prevCount
        );
      } else {
        keepGoing = false; // after we make sure the needed news are loaded we can start scraping
        let topCards = await page.$$eval(
          "#content > article > ul > li",
          (news) =>
            news.map((articl) => {
              const title =
                articl.querySelector("h3")?.textContent.trim() || "";
              const link = articl.querySelector("h3 > a")?.href || "";
              const date =
                articl
                  .querySelector("div > ul > li:nth-child(1)")
                  ?.textContent.trim() || "";
              return { title, link, date };
            })
        );
        let bottomCards = await page.$$eval(
          "#categoryArticles > ul > li",
          (news) =>
            news.map((articl) => {
              const title =
                articl.querySelector("h3")?.textContent.trim() || "";
              const link = articl.querySelector("h3 > a")?.href || "";
              const date =
                articl.querySelector("p")?.textContent.trim().slice(0, 10) ||
                "";
              return { title, link, date };
            })
        );
        let scrapedArticles = topCards.concat(bottomCards); // combining the 2 arrays
        for (let articl of scrapedArticles) {
          if (articl.link) {
            const response = await axiosGetRetry(articl.link);
            const dateObj = await transformDate(articl.date); // so i can compare it
            // The issue: the scraper is scraping every link including the ones that passed the choosenDate and i need to fix that
            if (choosenDate <= dateObj) {
              console.log("scraping content...");
              const html = await response.data;
              const $ = cheerio.load(html);
              const contentData = $(".width-635.align-center").text().trim();
              let author = $(".mobile-compact .author").text();
              if (author.trim() == false) {
                author = "Unknown author";
              } // for more organized look
              scrapedData.push({
                title: articl.title,
                link: articl.link,
                date: articl.date,
                content: {
                  contentData: contentData,
                  author: author,
                },
              });
            }
          } else {
            continue;
          }
        }
      }
    }
    await exportingData(
      `Elkhabar_${dateStr}_${choosenCategory}`,
      scrapedData,
      saveOption
    );
  } catch (error) {
    // console.error(error.message);
    throw error
  } finally {
    await browser.close();
  }
}

module.exports = { run, categories }; // <-- so i can manage it in scraperManager
