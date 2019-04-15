const rp = require('request-promise');
const cherrio = require('cheerio');
const url = 'https://www.airbnb.com/rooms/';

function retrieveImage (listingId) {
    let uri = url + listingId;

    var options = {
        uri:uri,
        headers: {
            'User-Agent': 'Request-Promise'
        },
    }

    return new Promise(function (resolve, reject) {
        rp(options)
        .then((html) => {
            imgUrl = cherrio("._3nukz4e meta", html).attr('content');
            resolve(imgUrl);
        })
        .catch(err => console.log(err))
    })
}

module.exports = retrieveImage;
