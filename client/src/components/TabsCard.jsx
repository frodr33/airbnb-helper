import { Card, Icon } from 'antd';
import 'antd/dist/antd.css'
import React, { Component } from 'react';
import '../App.css';
import TextForm from './TextForm'
import Listing from './Listing'
import InfiniteScroller from './/InfiniteScroller';

let createItineraryIcon = 
    <div style={{alignItems: 'center'}}>
        <Icon type="plus-circle" style={{fontSize:'26px', position:'relative', left:'30%'}}  />
        <div className="cardHeaders">New Itinerary</div>
    </div>

let tabList = [{
  key: 'createNewItinerary',
  tab: createItineraryIcon,
}];

// let contentList = {
//   createNewItinerary: <TextForm addTab={this.createTab}></TextForm>,
// };

class TabsCard extends React.Component {
    constructor(props) {
        super(props);
        this.createTab = this.createTab.bind(this);
    }
    

    createTab = (listings) => {
        let tabs = this.state.tabList;
        let content = this.state.contentList;
        let key = "Itinerary: " + this.state.itineraryNum;
        let table = []
        tabs.push({
            key: key,
            tab: key
        })

        for (let i = 0; i < listings.length; i++) {
            table.push(
                <Listing key={listings[i].listingID} imgURL={listings[i].listingURL} listingKey={listings[i].listingID}></Listing>
            )
        }

        // content[key] = <div>{table}</div>; 
        content[key] = <div style={{width:'50%', height:'100%'}}><InfiniteScroller input={table}></InfiniteScroller></div>

        // listings.forEach((listing) => {
        //     content[key] = 
        // })

        // console.log("Debugging");
        // console.log(typeof(tabImageURL));

        // content[tabKey] = <Listing imgURL={tabImageURL} listingKey={tabKey}></Listing>

        this.setState({
            tabList: tabs,
            contentList: content,
            itineraryNum: this.state.itineraryNum + 1
        })
    }

    state = {
        key: 'createNewItinerary',
        noTitleKey: 'app',
        tabList: tabList,
        itineraryNum: 1,
        contentList: 
        {
            createNewItinerary: <TextForm addTab={this.createTab}></TextForm>,
        },
    }

  onTabChange = (key, type) => {
    console.log(key, type);
    this.setState({ [type]: key });
  }
  
  render() {
    return (
      <div>
        <Card
          style={{ width: '100%', height:"50%", padding:"none" }}
          tabList={tabList}
          activeTabKey={this.state.key}
          onTabChange={(key) => { this.onTabChange(key, 'key'); }}
        >
          {this.state.contentList[this.state.key]}
        </Card>
      </div>
    );
  }
}

export default TabsCard;