# DZNews-CLI

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/node-%3E%3D16.0.0-green.svg)
![Platform: CLI](https://img.shields.io/badge/platform-CLI-blue.svg)
[![npm version](https://img.shields.io/npm/v/dznews)](https://www.npmjs.com/package/dznews)

**Algerian News Webscraper Command-Line Tool**

DZNews-CLI is a command-line tool for scraping Algerian news articles from multiple sources and categories. Fetch, save, and organize news data for research, monitoring, or personal use all from your terminal.

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
    - [Install Globally via npm](#install-globally-via-npm)
    - [Run Without Installing (npx)](#run-without-installing-npx)
    - [Manual Installation via GitHub](#manual-installation-via-github)
- [Usage Guide](#usage-guide)
    - [List Sources](#list-sources)
    - [List Categories](#list-categories)
    - [Scrape Articles](#scrape-articles)
    - [Export Options](#export-options)
    - [Choosing Output Directory](#choosing-output-directory)
    - [Interactive Mode](#interactive-mode)
    - [Output Files](#output-files)
- [Supported Sources and Categories](#supported-sources-and-categories)
- [Network Resilience, Anti-Block & Request Timing](#network-resilience-anti-block--request-timing)
- [Troubleshooting & Error Handling](#troubleshooting--error-handling)
- [Screenshots and Demos](#screenshots-and-demos)
- [Testing](#testing)
- [Changelog](#changelog)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- Scrape articles from several Algerian news websites
- Filter by date and category
- Export data as **JSON** or **CSV**
- Command-line interface with options for output directory and format
- Choose custom output directory in the standard CLI mode
- Interactive mode for guided scraping
- Extensible for additional sources and categories
- **Network-resilient scraping with retry logic and anti-block techniques** (randomized headers, user-agents, and delays)

---

## Installation

### Install Globally via npm

Recommended for most users.  
Requires Node.js v16+.

```bash
npm install -g dznews
```

Now you can run `dznews` as a global command from any directory.

### Run Without Installing (npx)

If you prefer not to install globally, you can use:

```bash
npx dznews <command>
```
Example:
```bash
npx dznews scrape ennahar 2025-10-09 sports --export csv
```

### Manual Installation via GitHub

If you want the latest source or to contribute:

```bash
git clone https://github.com/HarrouAnderrahman/DZNews.git
cd DZNews
npm install
npm link
```
Now you can use `dznews` globally.

---

## Usage Guide

### List Sources

Show all available news sources:

```bash
dznews sources
```

### List Categories

Show all categories for a given source:

```bash
dznews cat <source>
dznews cat ennahar
```

### Scrape Articles

Scrape articles by source, date, and category:

```bash
dznews scrape <source> <date> <category> [options]
```

**Examples:**
```bash
dznews scrape ennahar 2025-10-09 sports --export json
dznews scrape elbilad 2025-10-09 politics --export csv
```

- `<source>`: News site to scrape (see [Supported Sources and Categories](#supported-sources-and-categories))
- `<date>`: Date to collect articles until (format: `YYYY-MM-DD`)
- `<category>`: News category (see categories for your source)
- `--export` or `-e`: Output format (`json` or `csv`)
- Output is saved in the `scrapedData/` directory by default.

### Export Options

- Default is JSON:  
  Output file: `scrapedData/EnnaharData_2025-10-09_sports.json`
- Use `--export csv` or `-e` for CSV:  
  Output file: `scrapedData/EnnaharData_2025-10-09_sports.csv`

### Choosing Output Directory (Standard CLI Only)

You can choose the directory where the scraped data will be saved **only in the normal CLI mode** (not in interactive mode).

Add the option `--directory <path>` or `-d <path>` to the `scrape` command:

```bash
dznews scrape <source> <date> <category> --export json --directory /path/to/save/
dznews scrape elbilad 2025-10-09 politics --export csv -d /home/user/Documents/
```

- The specified directory must exist and be a valid directory.  
- If the directory exists, your data will be saved inside it in a `scrapedData/` subfolder.
- If the path points to something that is not a directory, DZNews will throw an error and not save the data.
- **Note:** The `--directory`/`-d` option is **not available in interactive mode**.

### Interactive Mode

For guided, beginner-friendly scraping:

```bash
dznews interactive
```

You'll be prompted for source, category, date, and format.

Demo:
![Interactive CLI Demo](assets/Interactive%20CLI%20demo.gif)

### Output Files

All files are saved in the `scrapedData/` directory inside the chosen output directory  
(or inside the package folder by default).  
Check the output for filenames like:

- `EnnaharData_2025-10-09_sports.json`
- `ElbiladData_2025-10-09_politics.csv`

---

## Supported Sources and Categories

To list all supported sources:

```bash
dznews sources
```

DZNews currently supports the following Algerian news sites:


- [Ennahar](https://www.ennaharonline.com/)

- [Elbilad](https://www.elbilad.net/)

- [Algerie Maintenant](https://algeriemaintenant.dz/)

- [Echourouk Online](https://www.echoroukonline.com/)

- [Dzair-Tube](https://www.dzair-tube.dz/)

- [Elkhabar](https://www.elkhabar.com/)

### Unified Category Keywords

All sites use the same keyword mapping for categories in DZNews.  
**Note:** *Not every site has every category; some categories are only available on certain sites due to differences in their structure and coverage.*

| Category Keyword | Description |
|------------------|-------------|
| national, algeria         | National news |
| sports           | Sports |
| international    | International news |
| politics         | Politics |
| security         | Security |
| economy          | Economy/Business |
| islam            | Islamic/Religion |
| society          | Society |
| hightech         | Technology/Science |
| culture          | Culture/Arts |
| ...              | More categories may be supported in future releases |

To see which categories are available for a specific source, run:

```bash
dznews cat <source>
```

For example:

```bash
dznews cat elkhabar
```

---

## Network Resilience, Anti-Block & Request Timing

DZNews includes a dedicated Axios configuration in:

```bash
scrapers/utils/axiosConfig.js
```

This module is responsible for:

- **Retrying failed network requests** a configurable number of times.
- **Randomizing browser-like headers** (user-agent, platform, etc.) on each attempt.
- **Controlling timing between requests** using a `sleep(min, max)` helper so that scraping does **not** look like instant, machine-speed traffic.

These techniques were added because some news sites can **flag or temporarily block** traffic that:

- Uses default HTTP client headers instead of real browser headers.
- Sends many requests in a very short time window.
- Keeps exactly the same headers and timing pattern for every request.

By rotating user-agents and adjusting the `sleep(min, max)` values, DZNews behaves more like a real user browsing the site, while still being scriptable.

### The `sleep(min, max)` Function (Most Important Timing Control)

Inside `axiosConfig.js` you’ll find:

```js
function sleep(min = 150, max = 300) {
  const time = Math.floor(Math.random() * (max - min + 1) + min);
  return new Promise((res) => {
    setTimeout(res, time);
  });
}
```

This function is used in two situations:

1. **Before every request** (short delay):
   - Called as `await sleep()` → uses the default `min = 150`, `max = 300` ms.
   - This is the “per-request” human-like delay.

2. **Between retries** (longer delay on network errors):
   - Called as `await sleep(delayBetweenRetries, delayBetweenRetries + 2000)`.
   - This uses `delayBetweenRetries` as the **base** and adds a bit of jitter.
   - Still, the _shape_ of your traffic is mostly defined by the **short min/max** you set on the default `sleep()`.

In practice, the **most important knobs for how “fast” and “bot-like” DZNews feels** are the `min` and `max` arguments of `sleep`.

You can:

- Change the **defaults in the function signature**:
  ```js
  function sleep(min = 500, max = 1500) { ... }
  ```
- Or permanently call it with explicit values where it’s used:
  ```js
  await sleep(800, 2000); // instead of await sleep();
  ```

#### Recommended `sleep(min, max)` Ranges

Below are practical ranges for the **short pre-request delay** (`sleep(min, max)` before each axios call). All values are in **milliseconds**:

- **Balanced / Recommended (default-ish behavior)**
  - `min`: `300–800`
  - `max`: `1200–2500`
  - Feels like a reasonably fast human clicking around.
  - Good balance between speed and not looking too robotic.

- **Safer / More Polite (less likely to trigger blocks)**
  - `min`: `1000–2000` (1–2 seconds)
  - `max`: `3000–6000` (3–6 seconds)
  - Slower crawl, but much gentler on the target sites.
  - Recommended if you plan to scrape a lot of pages or run DZNews frequently.

- **More Aggressive (faster, higher risk)**
  - `min`: `100–200`
  - `max`: `300–800`
  - More like the current default (`150–300`).
  - Pages are fetched quickly; risk of being flagged is higher, especially from VPN/RDP / shared IPs.

- **Worst / Strongly Not Recommended**
  - `min`: `0–50`
  - `max`: `100–200`
  - Requests look almost instant and very uniform.
  - Much more likely to be detected as a scraper or rate-limited.
  - Avoid this unless you know exactly what you are doing and accept the risk.

**Rule of thumb:**

- If you start getting blocked or throttled → **increase both `min` and `max`**.
- If everything is fine and you want it a bit faster → lower them slightly, but keep at least a few hundred ms of delay.

### Retry Attempts and Delay Between Retries

The exported function in `axiosConfig.js` looks like this:

```js
module.exports = async function axiosGetRetry(
  url,
  maxAttempts = 20,
  delayBetweenRetries = 5000
) {
  // ...
}
```

- `maxAttempts` (default: `20`):
  - Maximum number of retry attempts on **network errors** for a single URL.
- `delayBetweenRetries` (default: `5000` ms = 5 seconds):
  - Base delay between retry attempts (in milliseconds).
  - Combined with `sleep(delayBetweenRetries, delayBetweenRetries + 2000)` to add jitter.

These values matter when there are **network problems or temporary blocks**, but for the overall scraping “speed” and “stealthiness”, the **short `sleep(min, max)` before each request is usually more important**.

Suggested ranges:

- **Balanced / Recommended**
  - `maxAttempts`: `10–20`
  - `delayBetweenRetries`: `4000–7000` ms

- **Safer / More Polite**
  - `maxAttempts`: `5–10`
  - `delayBetweenRetries`: `8000–15000` ms

- **Aggressive (use with caution)**
  - `maxAttempts`: `20–30`
  - `delayBetweenRetries`: `1000–3000` ms

Avoid combining **very small `sleep(min, max)` values** with **huge `maxAttempts` and tiny `delayBetweenRetries`**, as that pattern is the most likely to cause blocks.

---

## Troubleshooting & Error Handling

### Common Issues and Solutions

- **Unknown source or category:**  
  Run `dznews sources` or `dznews cat <source>` to see valid inputs.
- **Date format errors:**  
  Dates must be `YYYY-MM-DD` and before today.  
  Example: `2025-10-09`
- **No output file created:**  
  Check for errors in the console. Make sure `scrapedData/` exists and you have write permissions.
- **Directory errors:**  
  If using `--directory`/`-d`, make sure the specified path exists and is a directory. Otherwise, DZNews will throw an error.
- **Network errors:**  
  Ensure you have internet access. Some sites may block scraping; try again later.
- **Permission errors (Linux/Mac):**  
  Use `sudo npm install -g dznews` if you see permissions denied.
- **Network errors & retries:**  
  DZNews automatically retries failed network requests (e.g., temporary network outages) up to a configurable number of times, with delays between attempts.  
  You can tune `sleep(min, max)`, `maxAttempts`, and `delayBetweenRetries` in `scrapers/utils/axiosConfig.js` as described in [Network Resilience, Anti-Block & Request Timing](#network-resilience-anti-block--request-timing).

### Getting Help

- Run with `--help` for usage info:
  ```bash
  dznews --help
  ```
- Open an issue in the [GitHub repo](https://github.com/HarrouAnderrahman/DZNews/issues) if you encounter problems.

---

## Screenshots and Demos

**Command Demo:**

![Commands Demo](assets/Commands%20demo.gif)

**Interactive CLI:**

![Interactive CLI Demo](assets/Interactive%20CLI%20demo.gif)

**CSV Output Example:**

![CSV Screenshot](assets/CSV%20Screenshot.png)

---

## Testing

To run the included smoke test (scrapes a random category from each source):

```bash
npm test
```
or
```bash
node tests/smokeTest.js
```

---

## Changelog

### 1.1.3 (2025-11-21)
- Improved HTTP request realism and anti-block behavior in `scrapers/utils/axiosConfig.js`:
  - Added multiple realistic browser user-agent + platform combinations (Windows, macOS, Linux) and randomize them on each request attempt.
  - Set consistent browser-like headers (`User-Agent`, `Accept`, `Accept-Language`, `Referer`, etc.) to avoid obvious bot signatures.
  - Introduced a `sleep(min, max)` helper used before each request and between retries to space out calls and reduce the chance of being flagged for very fast, machine-like traffic.
- Documented how to tune scraping speed and safety:
  - Explained how `sleep(min, max)` controls per-request delays and why these values are the most important for “human-like” timing.
  - Added recommended ranges for `min` and `max` (safer, balanced, and aggressive settings), and noted combinations that are risky and not recommended.
  - Clarified how to customize `maxAttempts` and `delayBetweenRetries` for retry behavior on network errors, and how these interact with the `sleep` function.

### 1.1.2 (2025-11-20)
- Fixed these bugs :
  - Dzair-Tube wasn't scraping anymore because they changed the date element
  - Forgot to check for a variable if it does even exist in the scraper manager which made it not usable

### 1.1.1 (2025-10-18)
- Forgot to add the choosing directory option inside all the scrapers (it was only available in ennahar scraper)

### 1.1.0 (2025-10-18)

- Added support for custom output directory in normal CLI mode using `--directory <path>` or `-d <path>`
- Minimal validation: Only saves data if the given directory exists and is a directory; throws an error otherwise
- The output directory option is **not available in interactive mode**
- Documentation updated to reflect new output directory option

### 1.0.0 (2025-10-16)

- Initial stable release
- Added a simple smoke test
- Modular architecture for easy extension
- Improved error handling
- **Added network error handling and retry logic in `axiosConfig.js`**  
  - If a network error occurs during scraping, DZNews will automatically retry requests up to 5 times (default).  
  - Maximum attempts and retry delay can be customized in code (`maxAttempts`, `delay`).

---

## Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a pull request

Report bugs or request features via [issues](https://github.com/HarrouAnderrahman/DZNews/issues).

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

## Author

Developed by [Harrou Abderrahman](https://github.com/HarrouAnderrahman)