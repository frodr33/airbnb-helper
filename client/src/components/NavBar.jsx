import React, { Component, Children } from 'react';
import { PageHeader, Button} from 'antd';
// import 'antd/dist/antd.css'
// import Button from '@material-ui/core/Button';

const buttonStyles = {
  fontSize: "20px",
  color: "white",
  backgroundColor: "transparent !important"
}

const headerStyles = {
  backgroundColor: "transparent"
}

class NavBar extends Component {
  createButtons = () => {
    if (this.props.guest) {
      return [<Button key="2" ghost>{<b><p style={buttonStyles}>Sign Up</p></b>}</Button>, <Button key="1" ghost>{<b><p style={buttonStyles}>Log In</p></b>}</Button>]
    } else if (!this.props.landing) {
      return [<Button key="1" ghost>{<b><p style={buttonStyles}>Sign Out</p></b>}</Button>]
    }
  }

    render() {  

      return (
        <div style={{color: "white"}}>
               <PageHeader
                title={<p style={{color:"white", fontSize:"20px"}}>TripIt!</p>}
                extra={this.createButtons()}
                style={{backgroundColor: "transparent", color:"white"}}
                />
        </div>
      );
    }
  }
  
  export default NavBar;
