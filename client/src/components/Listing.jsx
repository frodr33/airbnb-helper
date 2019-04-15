import React, { Component } from 'react';
import { Card } from 'antd';
import 'antd/dist/antd.css'

class Listing extends React.Component {  
  render() {
    return (
      <Card bordered={true} style={{width:'100%', height:"20%"}} hoverable={true}>
         {/* {this.props.listingKey} */}
         <img src={this.props.imgURL} width="20%" height="100%"></img>
         <div style={{float:'right'}}>
            <h2>Title of Airbnb?</h2>
            <h4>Owner, Price, Location, etc.</h4>             
         </div>
      </Card>
    );
  }
}

export default Listing;