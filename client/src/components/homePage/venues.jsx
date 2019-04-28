import React, { Component } from 'react';
import { Spin, Card } from 'antd';
import 'antd/dist/antd.css'
import uberIcon from '../../resources/uber-med.png'



class VenueCards extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let promise = this.props.uberPromise;
        promise.then((price) => {

            console.log(price.prices)
            console.log(price.prices.estimate)
            this.setState({
                prices: price.prices[1].estimate,
                retrived: true
            })
        })
        .catch((err) => console.log(err))

        // let promises = this.props.prices;
        // Promise.all(promises)
        // .then(() => {
        //     let finishedPricePromises = [];
        //     for (let i = 0; i < promises.length; i++) {
        //         promises[i].then((d) => {
        //             console.log(d);
        //             finishedPricePromises.push(d);
        //         })
        //     }
        //     return finishedPricePromises;
        // })
        // .then((uberPrices) => {
        //     console.log(uberPrices)
        //     this.setState({
        //         prices: uberPrices,
        //         retrived: true
        //     })
        // })
        // .catch((err) => console.log(err))
    }

    state = {
        prices: 0,
        retrived: false,
        fakeKey: 0,
    }

//     <div id="uberSTUFF">
//     {
//         !this.state.retrived ? <Spin tip="Loading"></Spin> : 
//         this.state.prices.map((d, i) => {
//             console.log("MAPPING")
//             console.log(d);
//             return <h3 key={this.state.fakeKey + i}>{d.prices[0].estimate}</h3>
//         })
//     }
// </div>

    render () {
        const venue = this.props.venues
        return (
            <Card>
              <div style={{width:"50%", float:"left"}}>
                <h3 style={{padding:"none"}}><b>{venue.name}</b></h3>
                <h4>{venue.postalAddress}</h4>         
              </div>
              <img style={{float:"right"}}  src={uberIcon}/>
              {/* <h3 style={{float:"right", paddingRight:"2%"}}>UberXL: $6-8 */}
              <div id="uber-price">
                {
                    !this.state.retrived ? <Spin tip="Loading"></Spin> : 
                    <h3>{this.state.prices}</h3>
                }
                </div>              
              {/* </h3> */}
            </Card>
        );
    }
}

export default VenueCards;