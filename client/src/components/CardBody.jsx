import React, { Component } from 'react';
import { Card } from 'antd';
import 'antd/dist/antd.css'

/**
 * CardBody Component contains the body of content
 * displaying for each Tab
 */
class CardBody extends Component {
    constructor(props) {
        super(props);
    }
    render () {
        return (
        <Card
            style={{ width: '100%', height:"50%", padding:"none" }}
            tabList={this.props.tabList}
            activeTabKey={this.props.key}
            onTabChange={(key) => { this.props.onTabChange(key, 'key'); }}
          >
            {this.props.content}
        </Card>
        );
    }
}

export default CardBody;