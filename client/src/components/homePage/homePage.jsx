import { Card, Icon, Tabs } from 'antd';
import 'antd/dist/antd.css'
import React from 'react';
import '../../App.css';
import TextForm from './textform'
import Listing from '../Listing'
import InfiniteScroller from '../InfiniteScroller';
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

// let contentList = {
//   createNewItinerary: <TextForm addTab={this.createTab}></TextForm>,
// };

class HomePage extends React.Component {
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
      let venueScroller = <InfiniteScroller key={key + "venueScroller"}infHeight="100%" infPadleft="5%" infWidth="45%" input={venueCards}></InfiniteScroller>   
      var newContent = <div>{airbnbInfScroller}{venueScroller}</div>

      console.log(key)
      content[key] = newContent

      
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

        let infScroller = <InfiniteScroller key={key + "infscroller"}infHeight="80%" infPadtop="2%" infPadleft="0%" infWidth="50%" input={table}></InfiniteScroller>;
        content[key] = <div style={{width:'100%', height:'100%'}}>{infScroller}</div>
        let infScrollerList = this.state.infiniteScrollerList;
        infScrollerList[key] = infScroller;

        this.setState({
            tabList: tabs,
            contentList: content,
            itineraryNum: this.state.itineraryNum + 1,
            infiniteScrollerList: infScrollerList,
            key: key
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
    console.log("On tab change")
    console.log(key, type);
    console.log(this.state.contentList[key])

    this.setState({ [type]: key });
  }
  
  render() {
    return (
      <div style={{height:"75%", width:"95%", paddingLeft:"5%"}}>
        <Tabs
          defaultActiveKey={this.state.key}
          tabPosition={"left"}
          style={{ height: "100%", width:"100%", background: "white" }}
        >
          {
            tabList.map((tab, i) => {
              return <TabPane tab={tab.tab} key={tab.key}>{this.state.contentList[tab.key]}</TabPane>
            })
          }
        </Tabs>
      </div>
    );
  }
}

export default HomePage;