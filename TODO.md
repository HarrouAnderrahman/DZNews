# TODO



## Must-Have Improvements (High Priority)

- [ ] **Improve CLI Appearance (chalk.js)**
  - Make output readable and appealing with colors/styles using [chalk.js](https://www.npmjs.com/package/chalk).
  - Refactor output for errors, warnings, headings, and success messages.

- [ ] **Add Progress Bar**
  - Display scraping progress in real time for better UX.
  - Use [cli-progress](https://www.npmjs.com/package/cli-progress) or similar.

- [ ] **Add CSV Export Option**
  - Allow users to export scraped news to CSV files.
  - Add a CLI flag (e.g., `--format csv`), use [csv-writer](https://www.npmjs.com/package/csv-writer).

- [ ] **Add More UX Options**
  - Provide options like custom output directory, filtering, and interactive prompts.
  - Use commander.js or inquirer.js for flexible CLI options.

## Enhancements for Developers and Power Users (Medium Priority)

- [ ] **Make DZNews Usable as a Library**
  - Refactor to expose main functions via `module.exports` so developers can import and use them.
  - Add code examples to documentation.

- [ ] **Add Anti-Bot Detection Handling**
  - Detect and handle anti-bot measures (e.g., CAPTCHAs).
  - Optionally integrate stealth plugins (e.g., [puppeteer-extra-plugin-stealth](https://www.npmjs.com/package/puppeteer-extra-plugin-stealth)).

- [ ] **Improve Performance**
  - Optimize scraping logic for speed and resource efficiency.
  - Profile code, add concurrency (e.g., `Promise.all`), reduce unnecessary waits.

## Final Milestone

- [ ] **Publish v1.0.0 (Stable Release)**
  - Complete all above tasks.
  - Test thoroughly and update documentation.
  - Bump version in `package.json` and run `npm publish` for release.