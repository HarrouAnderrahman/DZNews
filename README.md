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
- [Demo](#demo)
- [Supported Sources](#supported-sources)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Scrape articles** from supported Algerian news sources by category and date.
- **Interactive CLI mode** for beginners—guided, user-friendly prompts.
- **Alias support** for faster command access (e.g., `dznews i` for interactive mode).
- **List available sources** and their categories.
- **Custom output options**: save as **JSON** (default) or **CSV** files.
- **CSV export** with a custom converter (no third-party CSV lib needed).
- **Enhanced UX**: colored output, clear error messages, and strict date validation.
- **Future-proof:** modular code for easy expansion and library usage.

---

## Demo

### CLI Commands Overview
![DZNews-CLI commands demo](./assets/Commands%20demo.gif)

### Interactive Mode
Beginner-friendly guided scraping:
![DZNews-CLI interactive mode demo](./assets/Interactive%20CLI%20demo.gif)

### CSV Export Example
See how scraped data looks in CSV format:
![DZNews-CLI CSV screenshot](./assets/CSV%20Screenshot.png)

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

### List all available news sources
```sh
npx dznews sources
```

### List categories for a specific source
```sh
npx dznews cat <source>
# Example:
npx dznews cat ennahar
```

### Scrape articles from a source (with export option)
```sh
npx dznews scrape <source> <date> <category> [options]
# Example (JSON, default):
npx dznews scrape ennahar 2025-09-28 sports

# Example (CSV export):
npx dznews scrape ennahar 2025-09-28 sports --export csv
```
- Date format: `YYYY-MM-DD`
- Scraped data will be saved in the `scrapedData/` directory as a JSON file by default, or as a CSV file if `--export csv` is used.

### Use the Interactive Mode
```sh
npx dznews interactive
# or
npx dznews i
```
You’ll be guided through source, category, date, and export format selection.

---

## Contributing

Pull requests and suggestions are welcome!  
Feel free to open issues for bugs, feature requests, or questions.

---

## License

This project is licensed under the [MIT License](LICENSE).