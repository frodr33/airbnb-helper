import React, { Component } from 'react';
import { Layout, Card, Breadcrumb } from 'antd';
import 'antd/dist/antd.css'

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