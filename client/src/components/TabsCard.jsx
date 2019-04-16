import { Card, Icon, Spin } from 'antd';
import 'antd/dist/antd.css'
import React, { Component } from 'react';
import '../App.css';
import TextForm from './TextForm'
import Listing from './Listing'
import InfiniteScroller from './InfiniteScroller';

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
    

    addVenuesCard = (venues) => {
      console.log("IN ADDVENUES")
      console.log(venues);

      let key = this.state.key;
      let venueCards = []    
      
      for (let i = 0; i < venues.length; i++) {
        venueCards.push(
          <div key={"venue: " + venues[i].id}>
            <Card>
              <h3 style={{padding:"none"}}><b>{venues[i].name}</b></h3>
              <h4>{venues[i].postalAddress}</h4>
            </Card>
          </div>
        )
      }

      let content = this.state.contentList;
      let airbnbInfScroller = this.state.infiniteScrollerList[key];
      let venueScroller = <InfiniteScroller key={key + "venueScroller"}infHeight="250px" infPadleft="5%" infWidth="45%" input={venueCards}></InfiniteScroller>   
      var newContent = <div>{airbnbInfScroller}{venueScroller}</div>
      content[key] = newContent

      // Refresh by calling tab again?

      console.log(content);
      this.setState({
        key: "createNewItinerary",
        contentList: content,
      })      

      this.onTabChange(key, 'key')
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
                <Listing 
                  addVenuesCard={this.addVenuesCard} 
                  key={key + ": " +  listings[i].listingID} 
                  imgURL={listings[i].listingURL} 
                  listingKey={listings[i].listingID}
                  hostName={listings[i].host_name}
                  price={listings[i].price}
                  name={listings[i].name}
                  ></Listing>
            )
        }

        let infScroller = <InfiniteScroller key={key + "infscroller"}infHeight="400px" infPadleft="0%" infWidth="50%" input={table}></InfiniteScroller>;
        content[key] = <div style={{width:'100%', height:'100%'}}>{infScroller}</div>
        let infScrollerList = this.state.infiniteScrollerList;
        infScrollerList[key] = infScroller;

        this.setState({
            tabList: tabs,
            contentList: content,
            itineraryNum: this.state.itineraryNum + 1,
            infiniteScrollerList: infScrollerList
        })
    }

    state = {
        key: 'createNewItinerary',
        noTitleKey: 'app',
        tabList: tabList,
        extra: 0,
        itineraryNum: 1,
        contentList: 
        {
            createNewItinerary: <TextForm addTab={this.createTab}></TextForm>,
        },
        infiniteScrollerList: {},
    }

  onTabChange = (key, type) => {
    console.log(key, type);
    console.log(this.state.contentList[key])

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
        {/* <CardBody tabList={this.state.tabList} key={this.state.key} onTabChange={this.onTabChange} content={this.state.contentList[this.state.key]}></CardBody> */}
      </div>
    );
  }
}

export default TabsCard;