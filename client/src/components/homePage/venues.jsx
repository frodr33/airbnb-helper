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

            let uberX;
            let uberXL;
            let uberPool;
            price.prices.forEach((p) => {
                if (p.localized_display_name === "UberXL") uberXL = p.estimate
                else if  (p.localized_display_name === "UberX") uberX = p.estimate
                else if (p.localized_display_name === "UberPool") uberPool = p.estimate
            })

            this.setState({
                uberX: uberX,
                uberXL: uberXL,
                uberPool: uberPool,
                retrived: true
            })
        })
        .catch((err) => console.log(err))
    }

    state = {
        uberX: 0,
        uberXL: 0,
        uberPool: 0,
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
              <div id="uber-price" style={{float:"right", paddingRight:"2%"}}>
                {
                    !this.state.retrived ? <Spin tip="Loading"></Spin> : 
                    <div>
                    <h4>UberX: {this.state.uberX}</h4>
                    <h4>UberXL: {this.state.uberXL}</h4>
                    <h4>UberPool: {this.state.uberPool}</h4>
                    </div>

                }
                </div>              
              {/* </h3> */}
            </Card>
        );
    }
}

export default VenueCards;