import React, { Component } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import '../App.css';
import {
    List, message, Avatar, Spin,
  } from 'antd';
// import reqwest from 'reqwest';
  
const style = {
  height: 30,
  border: "1px solid green",
  margin: 6,
  padding: 8
};

class InfiniteScroller extends React.Component {
  state = {
    items: this.props.input
  };

  fetchMoreData = () => {
    // a fake async api call like which sends
    // 20 more records in 1.5 secs
    // setTimeout(() => {
    //   this.setState({
    //     items: this.state.items.concat(Array.from({ length: 20 }))
    //   });
    // }, 1500);
  };

  render() {
    return (
      <div style={{height:"400px", overflow:"auto"}}>
        <InfiniteScroll
          loadMore={this.fetchMoreData}
          hasMore={false}
        >
        {this.state.items}
          {/* {this.state.items.map((i, index) => (
            <div style={style} key={index}>
              div - #{index}
            </div>
          ))} */}
        </InfiniteScroll>
      </div>
    );
  }
}

export default InfiniteScroller;
