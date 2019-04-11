import React, { Component } from 'react';
import './App.css';
import Forms from './components/Forms'
import NavBar from './components/NavBar'
import TextForm from './components/TextForm'
import CustomFooter from './components/Footer'
import { Card } from 'antd';

class App extends Component {
  // Initialize state
  state = { names: {} }

  // Fetch passwords after first mount. This function is called 
  // automatically by react when the page first loads
  componentDidMount() {
    this.getNames();
  }

  getNames = () => {
    fetch('/api/pyTest')
      .then(res => res.json())
      .then(d => console.log(d))
  }

  render() {
    const { names } = this.state; //retrieve names from state

    return (
      <div>
      <div className="blurred-img"></div>
      {/* <div id="appDiv" className="App"> */}
      <div className="Header">
        <div>
          <NavBar></NavBar>
        </div>

        {/* <TextForm></TextForm> */}
        <div style={{paddingLeft: "28em", paddingRight: "28em", paddingTop: "10em"}}>
          <Card title="Create a travel iternary" bordered={true}>
            <TextForm></TextForm>
          </Card>
        </div>
        {/* <div className="App">
          <div>
            <ul className="heading">
                {Object.keys(names).map((idx) => 
                  <li key={idx}>
                    {names[idx].name + " " + names[idx].netid}
                  </li>                
                )}
            </ul>
          </div>       
        </div> */}
        
        <div className="Footer">
          <CustomFooter></CustomFooter>
        </div>
      </div>
      </div>
    )
  }
}



export default App;