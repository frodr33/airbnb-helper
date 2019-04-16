import React, { Component } from 'react';
import { Card } from 'antd';
import 'antd/dist/antd.css'

class Listing extends React.Component {  
  constructor(props) {
    super(props);
  }

  receivedVenuesHandler = (data) => {
    this.props.addVenuesCard(data)
  }

  fetchVenues = (listingID) => {
    fetch('/api/getVenues/' + listingID, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then(res => res.json())
    .then(data => this.receivedVenuesHandler(data))
    .catch(err => console.log(err))    
  }

  render() {
    return (
      <Card onClick={() => this.fetchVenues(this.props.listingKey)} bordered={true} style={{width:'100%', height:"20%"}} hoverable={true}>
         {/* {this.props.listingKey} */}
         <img src={this.props.imgURL} width="20%" height="100%"></img>
         <div style={{float:'right'}}>
            <h2>{this.props.name}</h2>
            <h4>{"Owner: " + this.props.hostName + ", $" + this.props.price + "/night"}</h4>             
         </div>
      </Card>
    );
  }
}

export default Listing;