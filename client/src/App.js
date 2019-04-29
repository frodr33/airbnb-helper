import React, { Component } from 'react';
import './App.css';
import NavBar from './components/NavBar'
import CustomFooter from './components/Footer'
import TabsCard from './components/TabsCard'
import LogInCard from './components/LogInCard'
import HomePage from './components/homePage/homePageNew'
import GuestHome from './components/homePage/guestHome'
// import HomePage from './components/homePage/homePage'
import GoogleMap from './components/maps/GoogleMap'
import { Col, Row } from 'antd';
import { BrowserRouter as Router, Route, Redirect  } from "react-router-dom";
import withAuth from './components/withAuth';


const titleFont = {
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'",
  color:"white",
  fontSize:"35px",
  paddingTop:"30%"
}

function landingPage() {
  return (
    <div style={{padding: '30px' }}>
    <Row gutter={16}>
      <Col span={8} offset={2}>
        <p style={titleFont}>
          <b>An Itinerary planner for your next vacation. What new things will you discover?</b>
        </p>
      </Col>
      <Col span={8}>
      </Col>
      <Col span={8} offset={4}>
        <LogInCard></LogInCard>
      </Col>
    </Row>
  </div>
  );
}

function homePage() {
  return (
    <div style={{ paddingLeft:'10%', width:'90%', paddingTop:"5%", paddingBottom:"5%", height:"100%"}}>
      <TabsCard></TabsCard>
    </div> 
  );
}
// const lat1 = 37;
// const long1 = -122;
// const lat2 = 37.7;
// const long2 = -122.5;

// var fetchUberPrices = () => {
//   fetch('/api/uberPrices/', {
//     method: 'POST',
//     headers: {
//       'Accept': 'application/json',
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       lat1: lat1,
//       long1: long1,
//       lat2: lat2,
//       long2: long2
//     })
//   })
//   .then(res => res.json())
//   .then(data => console.log(data))
//   .catch(err => console.log(err))       
// }

// fetchUberPrices();

class App extends Component { 
  render() {
    return (
      <div  style={{height:"100%"}} className="blurred-img">
      {/* <div className="blurred-img">
      </div> */}
      <div style={{height:"100%"}}>
        <Router>
          <div>
            <NavBar guest={false} landing={true}></NavBar>
          </div>
          <div style={{height:"90%"}}>
            <Route path="/" exact component={landingPage} />
            <Route path="/landing/" component={landingPage} />
            <Route path="/home/" component={withAuth(HomePage)} />
            <Route path="/guestHome/" component={GuestHome} />
          </div>
        </Router>

        <div className="Footer">
          <CustomFooter></CustomFooter>
        </div>
      </div>
      </div>
    )
  }
}
export default App;