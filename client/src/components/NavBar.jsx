import React, { Component, Children } from 'react';
import { PageHeader } from 'antd';
import 'antd/dist/antd.css'
import Button from '@material-ui/core/Button';

const buttonStyles = {
  fontFamily: "Courier New"
}

class NavBar extends Component {
    render() {  

      return (
        <div>
               <PageHeader
                title="TripIt!"
                subTitle="CS 4300 Final Project"
                extra={[
                  <Button styles={buttonStyles} key="2">Sign Up</Button>,
                    <Button styles={buttonStyles} key="1">
                    Log In
                  </Button>,
                ]}
                />
        </div>
      );
    }
  }
  
  export default NavBar;
