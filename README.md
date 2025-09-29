# DZNews-CLI

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/node-%3E%3D16.0.0-green.svg)
![Platform: CLI](https://img.shields.io/badge/platform-CLI-blue.svg)
[![npm version](https://img.shields.io/npm/v/dznews)](https://www.npmjs.com/package/dznews)

**Algerian News Webscraper Command-Line Tool**

DZNews-CLI is a command-line tool for scraping Algerian news articles from multiple sources and categories. It lets you fetch, save, and organize news data for research, monitoring, or personal use—now supporting both **JSON and CSV** exports.

---

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Supported Sources](#supported-sources)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Scrape articles** from supported Algerian news sources by category and date.
- **List available sources** and their categories.
- **Save scraped data** to **JSON** (default) or **CSV** files for easy analysis.
- **Easy-to-use commands** powered by Commander.js.

---

## Demo

> Example:
> ![DZNews-CLI demo](./assets/demo.gif)

---

## Supported Sources

- [Ennahar](https://www.ennaharonline.com/)
- [Elbilad](https://www.elbilad.net/)
- [AlgerieMaintenant](https://algeriemaintenant.dz/)

---

## Installation

**Requirements:**  
- Node.js v16.0.0 or higher

Install from npm (recommended for beta users: use locally in your project):

```sh
npm install dznews
```

**Note:**  
Global installation (`npm install -g dznews`) is not recommended while in beta.

---

## Usage

**List all available news sources:**
```sh
npx dznews sources
```

**List categories for a specific source:**
```sh
npx dznews cat <source>
# Example:
npx dznews cat ennahar
```

**Scrape articles from a source (with export option):**
```sh
npx dznews scrape <source> <date> <category> [options]
# Example (JSON, default):
npx dznews scrape ennahar 2025-09-28 sports

# Example (CSV export):
npx dznews scrape ennahar 2025-09-28 sports --export csv
```
- Date format: `YYYY-MM-DD`
- Scraped data will be saved in the `scrapedData/` directory as a JSON file by default, or as a CSV file if `--export csv` is used.

---

## Contributing

Pull requests and suggestions are welcome!  
Feel free to open issues for bugs, feature requests, or questions.

---

## License

This project is licensed under the [MIT License](LICENSE).