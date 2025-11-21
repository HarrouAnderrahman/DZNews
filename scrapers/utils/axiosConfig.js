const axios = require("axios");

const userAgents = [
  {
    ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) ... Chrome/124.0.0.0 Safari/537.36",
    platform: '"Windows"',
    secChUa: '"Chromium";v="124", "Not-A.Brand";v="99"',
  },
  {
    ua: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) ... Safari/605.1.15",
    platform: '"macOS"',
    secChUa: '"Safari";v="17", "Not-A.Brand";v="99"',
  },
  {
    ua: "Mozilla/5.0 (X11; Linux x86_64) ... Chrome/123.0.0.0 Safari/537.36",
    platform: '"Linux"',
    secChUa: '"Chromium";v="123", "Not-A.Brand";v="99"',
  },
];
function sleep(min = 150, max = 300) {
  const time = Math.floor(Math.random() * (max - min + 1) + min);
  return new Promise((res) => {
    setTimeout(res, time);
  });
}

module.exports = async function axiosGetRetry(
  url,
  maxAttempts = 20,
  delayBetweenRetries = 5000
) {
  let attempt = 1;
  while (attempt <= maxAttempts) {
    const { ua, platform, secChUa } =
      userAgents[Math.floor(Math.random() * userAgents.length)]; // to change the userAgent eachtime
    try {
      const axiosHeader = {
        // to make it not look like a bot :]
        headers: {
          "User-Agent": ua,
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9,ar;q=0.8",
          "Accept-Encoding": "gzip, deflate, br",
          Connection: "keep-alive",
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          Referer: "https://www.google.com/",
          "Upgrade-Insecure-Requests": "1",
          "Sec-CH-UA": secChUa,
          "Sec-CH-UA-Mobile": "?0",
          "Sec-CH-UA-Platform": platform,
        },
      };
      await sleep(); // Because they will flag you if you have a really fast internet
      return await axios.get(url, axiosHeader);
    } catch (error) {
      if (error.request && !error.response) {
        console.log(
          `Network Error on : ${url}\nAttempt : ${attempt} , Max retries : ${maxAttempts}\nRetrying after : ${
            delayBetweenRetries / 1000
          }`
        );
        attempt++;
        await sleep(delayBetweenRetries, delayBetweenRetries + 2000);
      } else if (error.response) {
        throw new Error(
          `HTTP Error : status = ${error.response.status}\n on : ${url}`
        );
      } else {
        throw error;
      }
    }
  }
  throw new Error(
    `Network Error : Failed after ${maxAttempts} attempts on : ${url}`
  );
};
