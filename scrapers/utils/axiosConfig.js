const axios = require('axios')

module.exports = async function axiosGetRetry(url, maxAttempts = 5, delay = 5000) {

    let attempt = 1

    while (attempt <= maxAttempts){
        try {
            const axiosHeader = { // to make it not look like a bot :]
                headers:{
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8'
                }
            }
            return await axios.get(url, axiosHeader)
        } catch (error) {
            if (error.request && !error.response){
                console.log(`Network Error, Attempt : ${attempt} , Max retries : ${maxAttempts}`)
                if (attempt <= maxAttempts){
                    attempt++
                    console.log(`Retrying after ${delay / 1000} seconds`)
                    await new Promise(res => setTimeout(res, delay))
                }
            } else if (error.response) {
                throw new Error(`HTTP Error : status = ${error.response.status} on : ${url}`)
            } else {
                throw error
            }
        }
    }
    throw new Error(`Network Error : Failed after ${maxAttempts} attempts on : ${url}`)
} 