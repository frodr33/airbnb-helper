import React, { Component } from 'react';
import './App.css';
import Forms from './components/Forms'
import NavBar from './components/NavBar'

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
      <div>
      <div className="blurred-img"></div>
      <div className="App">
        <div className="NavBar">
          <NavBar>
          </NavBar>
        </div>
      

        {names.length != 0 ? (
        <div>
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
            <h1> ERROR RETRIEVING NAMES </h1>
          </div>
        )}
      </div>
      </div>
    )
  }
}

export default App;