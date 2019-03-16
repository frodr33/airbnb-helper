import React, { Component } from 'react';
import './App.css';

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
    fetch('/api/passwords')
      .then(res => res.json())
      .then(names => this.setState({names}))
  }

  render() {
    const { names } = this.state; //retrieve names from state

    return (
      <div className="App">
        {names.length != 0 ? (
        <div>
          <h1>CS 4300 Final Project: Airbnb-Helper</h1>
          <ul className="heading">
              {Object.keys(names).map((n, index) => 
                <li key={index}>
                  {n + " " + names[n]}
                </li>                
              )}
          </ul>
        </div> 
        ) : (
          <div>
            <h1> ERROR RETRIEVING NAMES </h1>
          </div>
        )}
      </div>
    )
  }
}

export default App;