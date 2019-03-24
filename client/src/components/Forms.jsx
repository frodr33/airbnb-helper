import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

class Forms extends Component {
  /* Text inputs, hardcoded for now but will eventually get possible 
    neighborhoods from DB */
  state = {
    anchorEl: null,
    neighborhoods: 
    [
      "Upper West Side",
      "Hells Kitchen",
      "Midtown",
      "Upper East Side",
      "Flushing",
      "Jackson Heights"
    ]
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { anchorEl } = this.state;
    const { neighborhoods } = this.state;

    const menuItems = neighborhoods.map((n, idx) => 
      <MenuItem key={"menu_items" + idx} onClick={this.handleClose}>{n}</MenuItem>
      )
    
    const buttonStyle = {
      color: "#fff"
    };

    return (
      <div>
        <Button
          aria-owns={anchorEl ? 'simple-menu' : undefined}
          aria-haspopup="true"
          onClick={this.handleClick}
          style={buttonStyle}
        >
          Destination
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          {menuItems}
        </Menu>
      </div>
    );
  }
}

export default Forms;