# DZNews-CLI

**Algerian News Webscraper Command-Line Tool**

DZNews-CLI is a command-line tool for scraping Algerian news articles from multiple sources and categories. It lets you fetch, save, and organize news data for research, monitoring, or personal use—all via a simple CLI interface.

---

## Features

- **Scrape articles** from supported Algerian news sources by category and date.
- **List available sources** and their categories.
- **Save scraped data** to JSON files for easy analysis.
- **Easy-to-use commands** powered by Commander.js.

---

## Supported Sources

- **Ennahar**
- **Elbilad**
- **AlgerieMaintenant**

---

## Installation

Clone this repository and install dependencies:

```sh
git clone https://github.com/HarrouAnderrahman/DZNews.git
cd DZNews
npm install
```

---

## Usage

Make sure you have Node.js installed.

### **List all available news sources**

```sh
node index.js sources
```

### **List categories for a specific source**

```sh
node index.js cat <source>
# Example:
node index.js cat ennahar
```

### **Scrape articles from a source**

```sh
node index.js scrape <source> <date> <category>
# Example:
node index.js scrape ennahar 2025-09-28 sports
```
- Date format: `YYYY-MM-DD`
- Scraped data will be saved in the `scrapedData/` directory as a JSON file.

---

## Example Workflow

```sh
# List sources
node index.js sources

# List categories for 'elbilad'
node index.js cat elbilad

# Scrape 'sports' news from 'ennahar' on a specific date
node index.js scrape ennahar 2025-09-28 sports
```

---

## Roadmap

Planned features:
- CSV export option
- Search scraped articles by keyword/date
- More sources and categories
- Interactive mode for easier use
- Improved error handling and messages

---

## Contributing

Pull requests and suggestions are welcome!  
Feel free to open issues for bugs, feature requests, or questions.

---

## License

ISC

---

## Author

Harrou Abderrahman
