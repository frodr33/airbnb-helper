import React, { Component } from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
import 'antd/dist/antd.css'
const { Header, Content, Footer } = Layout;

class CustomFooter extends Component {
    render () {
        return (
        <Footer style={{ textAlign: 'center' }}>
            Cornell University CS 4300 Final Project<br/>
            Frank Rodriguez Aditya Jha Jacob Mathai Tharun Sankur
        </Footer>
        );
    }
}

export default CustomFooter;