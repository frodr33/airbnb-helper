import React, { Component } from 'react';
import 'antd/dist/antd.css'
import {
    Form, Icon, Input, Button, DatePicker, TimePicker, Select, Col
  } from 'antd'

const { MonthPicker, RangePicker } = DatePicker;
const { Option } = Select;

class TextForm extends Component {
    createTable = () => {
        let table = [];
        let numberOfGuests = 16; // Max on AirBnB.com

        let options = [];
        for (let i = 0; i <= numberOfGuests; i++) {
            options.push(<Option key={"option"+i} value={i}>{i} Adults</Option>)
        }

        table.push(<Select key={"select"} placeholder="0 Adults">{options}</Select>)
        return table;
    }


  render() {
    const { getFieldDecorator } = this.props.form;
    const rangeConfig = {
        rules: [{ type: 'array', required: true, message: 'Please select time!' }],
      };

    const formItemLayout = {
        labelCol: {
          xs: { span: 12 },
          sm: { span: 8 },
        },
        wrapperCol: {
          xs: { span: 12 },
          sm: { span: 8 },
        },
    };
    
    return (
        <div>

        <Col span={8} style={{display: "block"}}>
            <Form style={{width:"20em"}}>
            <Form.Item label="Destination">
                {getFieldDecorator('destination', {
                    rules: [{
                    initialValue: "New York City",
                    }],
                })(
                    <Input placeholder="New York City"/>
                )}
            </Form.Item>
            <Form.Item label="RangePicker">
                {getFieldDecorator('range-picker', rangeConfig)(
                    <RangePicker />
                )}
            </Form.Item>
            </Form>
        </Col>
        
        <Col span={8} style={{display: "block", paddingLeft: "10em"}}>
            <Form layout="horizontal" style={{width: "20em"}}>
                <Form.Item label="Number of Guests">
                    {this.createTable()}
                </Form.Item>
            </Form> 
        </Col>

        {/* <Form layout="horizontal" style={{width:"50%"}}>
            <Form.Item label="Destination">
                {getFieldDecorator('destination', {
                    rules: [{
                    initialValue: "New York City",
                    }],
                })(
                    <Input placeholder="New York City"/>
                )}
            </Form.Item>
            <Form.Item label="RangePicker">
                {getFieldDecorator('range-picker', rangeConfig)(
                    <RangePicker />
                )}
            </Form.Item>
        </Form>
        <Form layout="inline" style={{float:"left"}}>
            <Form.Item label="Number of Guests">
                {this.createTable()}
            </Form.Item>
        </Form> */}
        </div>
    );
  }
}

// const WrappedTextForm = Form.create({ name: 'normal_login' })(TextForm);
// ReactDOM.render(<WrappedTextForm />,  document.getElementById('appDiv'));
export default Form.create()(TextForm);;