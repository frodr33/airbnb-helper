import React, { Component } from 'react';
import './App.css';
import NavBar from './components/NavBar'
import CustomFooter from './components/Footer'
import TabsCard from './components/TabsCard'
import LogInCard from './components/LogInCard'
import CollectionsPage from './components/CollectionsPage'
import { Card, Col, Row } from 'antd';

const titleFont = {
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'",
  color:"white",
  fontSize:"35px",
  paddingTop:"30%"
}

class App extends Component { 
  render() {
    return (
      <div>
      <div className="blurred-img">
      </div>
      <div>
       <div>
          <NavBar></NavBar>
        </div>
        {/* <div style={{ paddingLeft:'10%', width:'90%', paddingTop:"5%", paddingBottom:"5%"}}>
          <TabsCard></TabsCard>
        </div>      */}

        <div style={{ background: '#ECECEC', padding: '30px' }}>
            <Row gutter={16}>
              <Col span={8} offset={2}>
                {/* <Card title="Card title" bordered={false}>Card content</Card> */}
                <p style={titleFont}>
                  <b>An Itinerary planner for your next vacation. What new things will you discover?</b>
                </p>
              </Col>
              <Col span={8}>
              </Col>
              <Col span={8} offset={4}>
                {/* <Card title="Card title" bordered={true}>Card content</Card> */}
                <LogInCard></LogInCard>
              </Col>
            </Row>
          </div>
        {/* <CollectionsPage></CollectionsPage> */}
        <div className="Footer">
          <CustomFooter></CustomFooter>
        </div>
      </div>
      </div>
    )
  }
}
export default App;