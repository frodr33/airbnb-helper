import { Card, Icon, Tabs, Form, Button } from 'antd';
import 'antd/dist/antd.css'
import React from 'react';
import '../../App.css';
import TextForm from './textform'
import Listing from '../Listing'
import InfiniteScroller from '../InfiniteScroller';
import GoogleMap from '../maps/GoogleMap';
import UberCard from './uber'
import VenueCards from './venues';
import Itinerary from './itinerary';
import NavBar from '../NavBar'
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

    componentDidMount() {
      fetch("/api/retrieveListings")
      .then((data) => data.json())
      .then((res) => {

        if (res.GUESTMODE === "NO SAVING") {
          return;
        }

        console.log(res)
        // Load this data into

        res.forEach((d) => {
          let data = d.data;
          let tabs = this.state.tabList;
          let custom_key = data.itineraryName;
          let key = "Itinerary: " + this.state.itineraryNum;
          key = custom_key ? custom_key : key;
          tabs.push({
              key: key,
              tab: key,
          })
          this.setState({
            tabList: tabs,
            itineraryNum: this.state.itineraryNum + 1,
            key: key
        })
          let coords = [data.listing.latitude, data.listing.longitude];
          this.addVenuesCard(data.venues, data.listingID, coords, data.listing); 
        })
      })
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

    handleBack = () => {
      console.log("BACK")
    }

    handleSave = (airbnbID) => {
      console.log(airbnbID)
    }

    changeTabName = (itineraryName) => {
      let tabs = this.state.tabList;
      let currentKey = this.state.key;
      let content = this.state.contentList;
      let oldContent;
      
      console.log("CHANGING TAB NAME")
      console.log(currentKey)
      for (let i = 0; i < tabs.length; i++) {
        if (tabs[i].key === currentKey) {
          oldContent = content[currentKey];
          console.log("here!", tabs[i].key)
          tabs[i] = {
            key: itineraryName,
            tab: itineraryName
          }

          content[itineraryName] = React.cloneElement(
            oldContent, 
            {saving: false}
            )
        }
      }

      this.setState({
        key: itineraryName,
        tabList: tabs,
        contentList: content
      })

    }

    backToListings = () => {
      // let listingIdMap = this.state.listingIdMap;
      // let listingsIDs = listingIdMap[this.state.key];
      let content = this.state.contentList;
      let key = this.state.key
      let infScroller = this.state.infiniteScrollerList[key]
      content[key] = <div style={{width:'100%', height:'100%', paddingTop:"5%"}}>{infScroller}</div>

      this.setState({
        contentList: content
      })
    }

    addVenuesCard = (venues, listingID, coordinates, rawListing) => {
      let listing;
      let allowSaving = true;
      if (!rawListing) {
        listing = this.state.listingMap[listingID];
        rawListing = this.state.rawListingMap[listingID];
      } else {
        // Loading listing form DB
        allowSaving = false;
        listing = 
        <Listing 
        key={key + ": " +  rawListing.listingID} 
        imgURL={rawListing.listingURL} 
        listingKey={rawListing.listingID}
        hostName={rawListing.host_name}
        price={rawListing.price}
        name={rawListing.name}
        keywords={rawListing.keywords}
        coordinates = {[rawListing.latitude, rawListing.longitude]}
        rating={rawListing.reviewScore}
        numAdults={rawListing.numAdults}
        checkin={rawListing.checkin}
        checkout={rawListing.checkout}
        ></Listing>
        
      }
      let content = this.state.contentList;
      let key = this.state.key;
      let venueCards = []        
      for (let i = 0; i < venues.length; i++) {
        var pricePromise = this.getUberPrices(coordinates[0], coordinates[1], venues[i].latitude, venues[i].longitude)
        venueCards.push(
          <div key={"venue: " + venues[i].id}>
          <VenueCards key={"venueCard:" + venues[i].id} venues={venues[i]} uberPromise={pricePromise}></VenueCards>
          </div>
        )
      }
      let listingComp = <InfiniteScroller key={key + "mainListing"} infHeight="30%" overflow={"unset"} infPadtop="0%" infPadleft="0%" infWidth="98%" input={listing}></InfiniteScroller>;
      // let uberComponent = <UberCard prices={pricePromises}></UberCard>
      let venueScroller = <InfiniteScroller id={venues[0].id + "VENUESCROLLER"} infPadTop="2%" key={key + "venueScroller"}
        infHeight="90%"  infWidth="45%" input={venueCards} title="Best things To Do!"></InfiniteScroller> 

      // Get lat and long for particular listing
      let gmap = <div className="MapWrapper"><GoogleMap class="TESTCLASS" style={{position: "none"}} airbnbName={"Airbnb"} listingID={listingID} lat={coordinates[0]} long={coordinates[1]} venues={venues}></GoogleMap></div>
      let newContent = 
      <Itinerary backToListings={this.backToListings} changeName={this.changeTabName} saving={allowSaving} listingID={listingID} rawListing={rawListing} venues={venues} listing={listingComp} venueScroller={venueScroller} gmap={gmap}>
      </Itinerary>

      // <div style={{width:'100%', height:'100%', paddingTop:"0%"}}>
      //   {listingComp}
      //   <div style={{position:"absolute", paddingTop:"18%", width:"90%", height:"100%"}}>{venueScroller}</div>
      //   <div className="MapWrapper"><GoogleMap class="TESTCLASS" style={{position: "none"}} airbnbName={"Airbnb"} listingID={listingID} lat={coordinates[0]} long={coordinates[1]} venues={venues}></GoogleMap></div>
      //   <Button onClick={this.handleBack}>Back</Button>
      //   <Button onClick={(listingID) => this.handleSave}>Save</Button>
      // </div>
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
        let rawListingMap = this.state.rawListingMap;
        let listingIdMap = this.state.listingIdMap;
        let listingIDs = [];

        let table = []
        tabs.push({
            key: key,
            tab: key
        })

        
        for (let i = 0; i < listings.length; i++) {
            console.log("MAKING THE LISTINGS")
            console.log(listings)
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
              rating={listings[i].reviewScore}
              numAdults={listings[i].numAdults}
              checkin={listings[i].checkin}
              checkout={listings[i].checkout}
              ></Listing>

            listingMap[listings[i].listingID] = listing
            rawListingMap[listings[i].listingID] = listings[i]
            listingIDs.push(listings[i].listingID);

            table.push(listing)
        }

        listingIdMap[key] = listingIDs;

        let infScroller = <InfiniteScroller key={key + "infscroller"} infHeight="100%" infPadtop="2%" infPadleft="0%" infWidth="50%" input={table} title="Pick an AirBnB!"></InfiniteScroller>;
        content[key] = <div style={{width:'100%', height:'100%', paddingTop:"5%"}}>{infScroller}</div>
        let infScrollerList = this.state.infiniteScrollerList;
        infScrollerList[key] = infScroller;

        let venuesList = this.state.venueList;
        venuesList[key] = <h2>Choose an Airbnb to build your itinerary!</h2>

        this.setState({
            key:key,
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
        },
        rawListingMap: {
          test: <h1>HELLO WORLD</h1>
        },
        listingIdMap: {
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
      <div style={{height:"85%", width:"95%", paddingLeft:"5%"}}>
        <Tabs
          defaultActiveKey={this.state.key}
          activeKey={this.state.key}
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