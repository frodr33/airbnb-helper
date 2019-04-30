const rp = require('request-promise');
const cherrio = require('cheerio');
const url = 'https://www.airbnb.com/rooms/';

/**
 * retrieveImage scraps airbnb website and obtains
 * showcase images for rooms
 * @param  {String}  listingID ID of a listing
 * @return {Promise}  Promise resulting in URL
 */
function retrieveImage (listingId) {
    let uri = url + listingId;
    var options = {
        uri:uri,
        headers: {
            'User-Agent': 'Request-Promise'
        },
    }

    return new Promise(function (resolve, _) {
        rp(options)
        .then((html) => {
            imgUrl = cherrio("._3nukz4e meta", html).attr('content');
            resolve(imgUrl);
        })
        .catch(err => {
            console.log(err);
            resolve(false);
        })
    })
}

module.exports = retrieveImage;
