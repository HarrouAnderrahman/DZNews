const inquirer = require('inquirer')
const {categories, scrape} = require('./scraperManager')

/*
The plan here simply is to let the user :
    -   Choose the source (list)
    -   Choose the category from the categories of the source (rawlist)
    -   Type the date (input with validation)
    -   Choose the format (list)

*/
async function interactiveCLI() {
    const questions = [
        {
            type: 'list',
            name: 'Source',
            message: 'Choose what source you want to scrape from :',
            choices: Object.keys(categories)
        },
        {
            type: 'rawlist',
            name: 'Category',
            message: 'Choose what Category you want to scrape :',
            choices: (answer) => Object.keys(categories[answer.Source])
        },
        {
            type: 'input',
            name: 'Date',
            message: 'Please type the date that you want the scraper to stop on :',
            validate (date) {
                const validDate = new Date(date)
                const now = new Date
                const valid = !isNaN(validDate.getTime()) && date.length === 10 && now > validDate;
                if (now < validDate) return 'Invalid Date, The choosen Date must be before the current date'
                return valid || 'Invalid Date, The Date has to be formatted as : YYYY-MM-DD'
                
            }
        },
        {
            type: 'list',
            name: 'Format',
            message: 'What format do you want to save your data as :',
            choices: ['JSON', 'CSV']
        }
    ]

    inquirer.prompt(questions).then((answer) => {
        scrape(answer.Source, answer.Date, answer.Category, answer.Format)
    })
    
}

module.exports = interactiveCLI