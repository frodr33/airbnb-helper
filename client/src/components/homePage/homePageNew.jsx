import { Card, Icon, Tabs, Form, Button } from 'antd';
import 'antd/dist/antd.css'
import React from 'react';
import '../../App.css';
import TextForm from './textform'
import Listing from '../Listing'
import InfiniteScroller from '../InfiniteScroller';
import GoogleMap from '../maps/GoogleMap';
import UberCard from './uber'
const TabPane = Tabs.TabPane;

let createItineraryIcon = 
    <div style={{alignItems: 'center'}}>
        <Icon type="plus-circle" style={{fontSize:'26px', position:'relative', left:'30%'}}  />
        <div className="cardHeaders">New Itinerary</div>
    </div>

let tabList = [{
  key: 'createNewItinerary',
  tab: createItineraryIcon,
}];

class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.createTab = this.createTab.bind(this);
    }
    

    handleSubmit = (d) => {
      d.preventDefault();
      console.log("SUBMITTED VENUES AND AIRBNB CHOICE")
    }

    getUberPrices = (lat1, long1, lat2, long2) => {
      console.log("REQUESTING UBER DATA")

      return new Promise((resolve, _) => {
        fetch('/api/uberPrices/', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            lat1: lat1,
            long1: long1,
            lat2: lat2,
            long2: long2
          })
        })
        .then(res => res.json())
        .then(data => {
          resolve(data);
        })
        .catch(err => console.log(err))       
      });
    }

    addVenuesCard = (venues, listingID, coordinates) => {
      // console.log(venues);
      // console.log(listingID);
      // console.log(this.state.key);

      let content = this.state.contentList;
      let key = this.state.key;

      let listing = this.state.listingMap[listingID];

      // console.log("Building Itinerary...")
      // console.log(listingID)
      // console.log(this.state.listingMap)

      let venueCards = []    
      let pricePromises = []
    
      for (let i = 0; i < venues.length; i++) {
        var pricePromise = this.getUberPrices(coordinates[0], coordinates[1], venues[i].latitude, venues[i].longitude)
        // console.log(pricePromise) 
        pricePromises.push(pricePromise);
        

        venueCards.push(
          <div key={"venue: " + venues[i].id}>
            <Card>
              <h3 style={{padding:"none"}}><b>{venues[i].name}</b></h3>
              <h4>{venues[i].postalAddress}</h4>
            </Card>
          </div>
        )
      }
      let uberComponent = <UberCard prices={pricePromises}></UberCard>
      let venueScroller = <InfiniteScroller id={venues[0].id + "VENUESCROLLER"} key={key + "venueScroller"}
        infHeight="70%" infPadleft="5%" infWidth="45%" input={venueCards} title="Pick k restauraunts!"></InfiniteScroller> 

      // Get lat and long for particular listing

      let newContent = 
      <div style={{width:'100%', height:'100%', paddingTop:"5%"}}>
        {listing}
        {venueScroller}
        {uberComponent}
        <GoogleMap airbnbName={"Airbnb"} listingID={listingID} lat={coordinates[0]} long={coordinates[1]} venues={venues}></GoogleMap>
      </div>
      content[key] = newContent;


      this.setState({
        contentList: content,
      })

    }


    createTab = (listings) => {
        let tabs = this.state.tabList;
        let content = this.state.contentList;
        let key = "Itinerary: " + this.state.itineraryNum;
        let listingMap = this.state.listingMap;

        let table = []
        tabs.push({
            key: key,
            tab: key
        })

        for (let i = 0; i < listings.length; i++) {
            let listing = 
              <Listing 
              addVenuesCard={this.addVenuesCard} 
              key={key + ": " +  listings[i].listingID} 
              imgURL={listings[i].listingURL} 
              listingKey={listings[i].listingID}
              hostName={listings[i].host_name}
              price={listings[i].price}
              name={listings[i].name}
              keywords={listings[i].keywords}
              coordinates = {[listings[i].latitude, listings[i].longitude]}
              ></Listing>

            listingMap[listings[i].listingID] = listing
            table.push(listing)
        }

        let infScroller = <InfiniteScroller key={key + "infscroller"} infHeight="100%" infPadtop="2%" infPadleft="0%" infWidth="50%" input={table} title="Pick an AirBnB!"></InfiniteScroller>;
        content[key] = <div style={{width:'100%', height:'100%', paddingTop:"5%"}}>{infScroller}</div>
        let infScrollerList = this.state.infiniteScrollerList;
        infScrollerList[key] = infScroller;

        let venuesList = this.state.venueList;
        venuesList[key] = <h2>Choose an Airbnb to build your itinerary!</h2>

        this.setState({
            tabList: tabs,
            contentList: content,
            itineraryNum: this.state.itineraryNum + 1,
            infiniteScrollerList: infScrollerList,
            venueList: venuesList,
            listingMap: listingMap
        })
        // key: key,
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
        venueList: {},
        numVenues: 0,
        chosenListing: {},
        listingMap: {
          test: <h1>HELLO WORLD</h1>
        }
    }

  // onTabChange = (key, type) => {
  //   console.log("On tab change")
  //   console.log(key, type);
  //   console.log(this.state.contentList[key])

  //   this.setState({ [type]: key });
  // }

  onTabChange = (key) => {
    this.setState({
      key: key
    })
  }
  
  render() {
    return (
      <div style={{height:"90%", width:"100%", paddingLeft:"0%"}}>
        <Tabs
          defaultActiveKey={this.state.key}
          // activeKey={this.state.key}
          onChange = {(key) => this.onTabChange(key)}
          tabPosition={"left"}
          style={{ height: "100%", width:"100%", background: "white" }}
        >
          {
            tabList.map((tab, i) => {
              return <TabPane tab={tab.tab} key={tab.key} style={{height:"100%"}}>{this.state.contentList[tab.key]}</TabPane>
              // if (tab.key === "createNewItinerary"){
              //   return <TabPane tab={tab.tab} key={tab.key} style={{height:"100%"}}>{this.state.contentList[tab.key]}</TabPane>
              // } else {
              //   console.log(tab.key)
              //   console.log(this.state.venueList)
              //   return <TabPane tab={tab.tab} key={tab.key} style={{height:"100%"}}>{this.state.infiniteScrollerList[tab.key]}{this.state.venueList[tab.key]}</TabPane>
              // }            
              })
          }
        </Tabs>
      </div>
    );
  }
}

export default HomePage;