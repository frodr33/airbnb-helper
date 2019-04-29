import React, { Component } from 'react';
import { Card, Rate } from 'antd';
import 'antd/dist/antd.css'
import airbnbImage from '../resources/airbnb-med.jpg'

class Listing extends React.Component {  
  constructor(props) {
    super(props);
  }

  receivedVenuesHandler = (data, listingID) => {
    console.log("...received venues", data)
    this.props.addVenuesCard(data, listingID, this.props.coordinates)
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
    .then(data => this.receivedVenuesHandler(data, listingID))
    .catch(err => console.log(err))    
  }

  createImgURL = (url) => {
    if (url) return url;
    else return airbnbImage
  }

  createAirbnbUrl = () => {
    let airbnb = "https://www.airbnb.com/rooms/"
    return airbnb + this.props.listingKey;
  }

  render() {
    return (
      <Card onClick={() => this.fetchVenues(this.props.listingKey)} bordered={true} style={{width:'100%', height:"10%"}} hoverable={true}>
         <img style={{float:"left"}} src={this.createImgURL(this.props.imgURL)} width="15%" height="100%"></img>
         <div style={{float:'right', textAlign:"center"}}>
            <h2>{this.props.name}</h2>
            <h4>{"Owner: " + this.props.hostName + ", " + this.props.price + "/night"}</h4>       
            <h4>{"Key words: " + this.props.keywords}</h4>      
            <Rate allowHalf defaultValue={Math.floor((this.props.rating/20)*2)/2} />
            <a style={{position:"relative", zIndex:"1", display:"block"}} target="_blank" href={this.createAirbnbUrl()}>See on the Airbnb Website!</a>

         </div>
         {/* <a style={{position:"absolute", zIndex:"1", float:"right"}} target="_blank" href={this.createAirbnbUrl()}>See on the Airbnb Website!</a> */}
      </Card>
    );
  }
}

export default Listing;