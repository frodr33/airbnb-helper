const rp = require('request-promise');
// let clientID = "client_id=" + process.env.CLIENT_ID;
// let secretID = "client_secret=" + process.env.CLIENT_SECRET;
    
/**
 * foursquareCrateRequest retrives recommended venues near 
 * a certain location
 * @param  {String}  latitude  
 * @param  {String}  longitude 
 * @param  {String}  limit   Number of venues to return
 * @return {Promise} Promise resulting in array of Venues
 */
function uberRetrievePrice(lat1, long1, lat2, long2) {
    var options = {
        uri: " https://api.uber.com/v1.2/estimates/price?start_latitude=37.7752315&start_longitude=-122.418075&end_latitude=37.7752415&end_longitude=-122.518075",
        qs: {
            server_token:'WFldMoj7parIbXJLHJjVMsYhfs7qBDHFS02PTtkK',
            // start_latitude: lat1,
            // start_longitude: long1, 
            // end_latitude: lat2,
            // end_longitude: long2
        },
        json:true
    }

    return new Promise((resolve, _) => {
        rp(options)
        .then((res) => {
            console.log("received");
            console.log(res)
            resolve("HELLO WORLD");          
        })  
        .catch(err => console.log(err))
    })
}







// function uberRetrievePrice (latitude, longitude, limit) {
//     var options = {
//         uri: "https://api.foursquare.com/v2/venues/explore",
//         qs: {
//             client_id:'JMYTOQPFE1ZIWXAMYNHLV0KPOR4I32U3A2VMW1T2NLAOUQ1B',
//             client_secret:'XD1ZO2PZGS2H0ZWXHJ0NOPVZKJEGKAVP5TY1K00GKFTB2W2I',
//             v:'20180323',
//             ll: "" + latitude + "," + longitude,  
//             limit:limit   
//         },
//         json:true
        
//     }

//     return new Promise((resolve, _) => {
//         rp(options)
//         .then((res) => {
//             console.log("received");
//             let recommendedVenues = res.response.groups[0].items  
//             resolve(recommendedVenues);          
//         })  
//         .catch(err => console.log(err))

//     })
// }

module.exports = uberRetrievePrice;