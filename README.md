# DZNews-CLI

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/node-%3E%3D16.0.0-green.svg)
![Platform: CLI](https://img.shields.io/badge/platform-CLI-blue.svg)

**Algerian News Webscraper Command-Line Tool**

DZNews-CLI is a command-line tool for scraping Algerian news articles from multiple sources and categories. It lets you fetch, save, and organize news data for research, monitoring, or personal use—all via a simple CLI interface.

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
- **Save scraped data** to JSON files for easy analysis.
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

Clone this repository and install dependencies:

```sh
git clone https://github.com/HarrouAnderrahman/DZNews.git
cd DZNews
npm install
```

---

## Usage

**List all available news sources:**
```sh
node index.js sources
```

**List categories for a specific source:**
```sh
node index.js cat <source>
# Example:
node index.js cat ennahar
```

**Scrape articles from a source:**
```sh
node index.js scrape <source> <date> <category>
# Example:
node index.js scrape ennahar 2025-09-28 sports
```
- Date format: `YYYY-MM-DD`
- Scraped data will be saved in the `scrapedData/` directory as a JSON file.

---

## Contributing

Pull requests and suggestions are welcome!  
Feel free to open issues for bugs, feature requests, or questions.

---

## License

This project is licensed under the [MIT License](LICENSE).