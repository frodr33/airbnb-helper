import React, { Component } from 'react';
import './App.css';
import NavBar from './components/NavBar'
import CustomFooter from './components/Footer'
import TabsCard from './components/TabsCard';

class App extends Component { 
  render() {
    return (
      <div>
      <div className="blurred-img"></div>
      <div className="Header">
        <div>
          <NavBar></NavBar>
        </div>
        <div style={{ paddingLeft:'10%', width:'90%', paddingTop:"5%", paddingBottom:"5%"}}>
          <TabsCard></TabsCard>
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