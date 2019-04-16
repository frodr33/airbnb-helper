import React, { Component } from 'react';
import './App.css';
import Forms from './components/Forms'
import NavBar from './components/NavBar'
import TextForm from './components/TextForm'
import CustomFooter from './components/Footer'
import TabsCard from './components/TabsCard';
import { Card, Spin } from 'antd';

class App extends Component {
  // Initialize state
  state = {}    
  render() {
    const { names } = this.state; //retrieve names from state
    return (
      <div>
      <div className="blurred-img"></div>
      <div className="Header">
        <div>
          <NavBar></NavBar>
        </div>
        <div style={{ paddingLeft:'10%', width:'90%', paddingTop:"5%", paddingBottom:"5%"}}>
          <TabsCard></TabsCard>
          {/* <InfiniteScroller></InfiniteScroller> */}
        </div>     
        <div className="Footer">
          <CustomFooter></CustomFooter>
        </div>
      </div>

      </div>
    )
  }
}
export default App;