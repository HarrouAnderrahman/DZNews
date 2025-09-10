const axios = require('axios'); 
const cheerio = require('cheerio'); 

axios.get('http://ennaharonline.com/algeria/')
.then(({data}) => {
    const $ = cheerio.load(data);
    const newsDZ = $('.card__cntn')
    .map((_,news) =>{
        const $news = $(news);
        const newsHead = $news.find('.bunh').text()
        const newsDes = $news.find('.card__desc').text()
        return {'news':newsHead, 'description':newsDes}
    })
    .toArray()
    console.log(newsDZ)
}).catch((err) => console.log(err))