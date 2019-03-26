import React, { Component } from 'react';
import './App.css';
import Forms from './components/Forms'

class App extends Component {
  // Initialize state
  state = { names: {} }

  // Fetch passwords after first mount. This function is called 
  // automatically by react when the page first loads
  componentDidMount() {
    this.getNames();
  }

  getNames = () => {
    // Get the names and netIDs
    fetch('/api/users')
      .then(res => res.json())
      .then(names => this.setState({names}))
  }

  render() {
    const { names } = this.state; //retrieve names from state

    return (
      <div className="content-background">
      <div className="blurred-img"></div>
      <div className="App">
        {names.length != 0 ? (
        <div>
          <h1>CS 4300 Final Project: Airbnb-Helper</h1>
          <ul className="heading">
              {Object.keys(names).map((idx) => 
                <li key={idx}>
                  {names[idx].name + " " + names[idx].netid}
                </li>                
              )}
          </ul>

          <Forms></Forms>
        </div> 
        ) : (
          <div>
            <h1> ERROR RETRIEVING </h1>
          </div>
        )}
      </div>
      </div>
    )
  }
}

export default App;