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
    - [Interactive Mode](#interactive-mode)
    - [Output Files](#output-files)
- [Supported Sources and Categories](#supported-sources-and-categories)
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
- Interactive mode for guided scraping
- Extensible for additional sources and categories

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
- Output is saved in the `scrapedData/` directory.

### Export Options

- Default is JSON:  
  Output file: `scrapedData/EnnaharData_2025-10-09_sports.json`
- Use `--export csv` or `-e` for CSV:  
  Output file: `scrapedData/EnnaharData_2025-10-09_sports.csv`

### Interactive Mode

For guided, beginner-friendly scraping:

```bash
dznews interactive
```

You'll be prompted for source, category, date, and format.

Demo:
![Interactive CLI Demo](assets/Interactive%20CLI%20demo.gif)

### Output Files

All files are saved in the `scrapedData/` directory.  
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

## Troubleshooting & Error Handling

### Common Issues and Solutions

- **Unknown source or category:**  
  Run `dznews sources` or `dznews cat <source>` to see valid inputs.
- **Date format errors:**  
  Dates must be `YYYY-MM-DD` and before today.  
  Example: `2025-10-09`
- **No output file created:**  
  Check for errors in the console. Make sure `scrapedData/` exists and you have write permissions.
- **Network errors:**  
  Ensure you have internet access. Some sites may block scraping; try again later.
- **Permission errors (Linux/Mac):**  
  Use `sudo npm install -g dznews` if you see permissions denied.
- **Network errors:**  
  DZNews now automatically retries failed network requests up to 5 times by default.  
  You can adjust the maximum retry attempts and delay in `scrapers/utils/axiosConfig.js` by changing the `maxAttempts` and `delay` parameters.

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