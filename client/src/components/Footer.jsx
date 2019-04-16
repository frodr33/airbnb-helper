import React, { Component } from 'react';
import { Layout } from 'antd';
import 'antd/dist/antd.css'
const { Footer } = Layout;

/**
 * CustomFooter Component is the Footer containing metadata 
 * and other information about this application
 */
class CustomFooter extends Component {
    render () {
        return (
        <Footer style={{ textAlign: 'center' }}>
            Cornell University CS 4300 Final Project<br/>
            Frank Rodriguez Aditya Jha Jacob Mathai Tharun Sankar
        </Footer>
        );
    }
}

export default CustomFooter;