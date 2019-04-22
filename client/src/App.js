import React, { Component } from 'react';
import './App.css';
import NavBar from './components/NavBar'
import CustomFooter from './components/Footer'
import TabsCard from './components/TabsCard'
import LogInCard from './components/LogInCard'
import HomePage from './components/homePage/homePage'
import { Col, Row } from 'antd';
import { BrowserRouter as Router, Route, Redirect  } from "react-router-dom";


const titleFont = {
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'",
  color:"white",
  fontSize:"35px",
  paddingTop:"30%"
}

function landingPage() {
  return (
    <div style={{ background: '#ECECEC', padding: '30px' }}>
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

class App extends Component { 
  render() {
    return (
      <div  style={{height:"100%"}}>
      <div className="blurred-img">
      </div>
      <div style={{height:"100%"}}>
       <div>
          <NavBar></NavBar>
        </div>

        <Router>
          <div style={{height:"100%"}}>
            <Route path="/" exact component={landingPage} />
            <Route path="/landing/" component={landingPage} />
            <Route path="/home/" component={homePage} />
            <Route path="/testHome/" component={HomePage} />
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