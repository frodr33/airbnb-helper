import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import '../App.css';

/**
 * InfiniteScroller Component accepts input through props
 * and dispalys its inputs in a scrollable list
 */
class InfiniteScroller extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    items: this.props.input
  };

  styles = {
    height: this.props.infHeight,
    overflow: this.props.overflow || "auto",
    width: this.props.infWidth,
    float: "left",
    paddingLeft: this.props.infPadleft,
    textAlign: "center"
  }
  
  // Dummy Function
  fetchMoreData = () => {};

  render() {
    return (
      <div style={this.styles}>
      <div><h2>{this.props.title}</h2></div>
      <div>
        <InfiniteScroll
          loadMore={this.fetchMoreData}
          hasMore={false}
          useWindow={true}
        >
        {this.state.items}
        </InfiniteScroll>
      </div>
      </div>
    );
  }
}

export default InfiniteScroller;
