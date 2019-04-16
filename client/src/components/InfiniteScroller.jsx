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
    overflow: "auto",
    width: this.props.infWidth,
    float: "left",
    paddingLeft: this.props.infPadleft
  }
  
  // Dummy Function
  fetchMoreData = () => {};

  render() {
    return (
      <div style={this.styles}>
        <InfiniteScroll
          loadMore={this.fetchMoreData}
          hasMore={false}
        >
        {this.state.items}
        </InfiniteScroll>
      </div>
    );
  }
}

export default InfiniteScroller;
