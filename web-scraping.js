const rp = require('request-promise');
const cherrio = require('cheerio');
const url = 'https://www.airbnb.com/rooms/';

function retrieveImage (listingId) {
    let uri = url + listingId;
    return new Promise(function (resolve, reject) {
        rp(uri)
        .then((html) => {
            imgUrl = cherrio("._3nukz4e meta", html).attr('content');
            resolve(imgUrl);
        })
    })
}

module.exports = retrieveImage;
