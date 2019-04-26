import React, { Component } from 'react';
import { Spin } from 'antd';
import 'antd/dist/antd.css'



class UberCard extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // console.log("COMPONENT MOUNTED")
        let promises = this.props.prices;
        // console.log(promises)

        Promise.all(promises)
        .then(() => {
            // console.log("FINISHED PROMISES");
            // console.log(promises);
            let finishedPricePromises = [];
            for (let i = 0; i < promises.length; i++) {
                promises[i].then((d) => {
                    console.log(d);
                    finishedPricePromises.push(d);
                })
            }
            return finishedPricePromises;
        })
        .then((uberPrices) => {
            console.log(uberPrices)
            this.setState({
                prices: uberPrices,
                retrived: true
            })
        })
        .catch((err) => console.log(err))
    }

    state = {
        prices: [],
        retrived: false,
        fakeKey: 0,
    }

    render () {
        return (
            <div id="uberSTUFF">
                {
                    !this.state.retrived ? <Spin tip="Loading"></Spin> : 
                    this.state.prices.map((d, i) => {
                        console.log("MAPPING")
                        console.log(d);
                        return <h3 key={this.state.fakeKey + i}>{d.prices[0].estimate}</h3>
                    })
                }
            </div>
        // <Card
        //     style={{ width: '100%', height:"50%", padding:"none" }}
        //     tabList={this.props.tabList}
        //     activeTabKey={this.props.key}
        //     onTabChange={(key) => { this.props.onTabChange(key, 'key'); }}
        //   >
        //     {this.props.content}
        // </Card>
        );
    }
}

export default UberCard;