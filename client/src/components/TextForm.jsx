import React, { Component } from 'react';
import 'antd/dist/antd.css'
import {
    Form, Icon, Input, Button, DatePicker, TimePicker, Select, Col, Slider
  } from 'antd'

const { MonthPicker, RangePicker } = DatePicker;
const { Option } = Select;
let numAdults = 1;
let cityNeighborhood = "Midtown";
let neighborhoods = 
[
  "Upper West Side",
  "Hells Kitchen",
  "Midtown",
  "Upper East Side",
  "Flushing",
  "Jackson Heights"
]

class TextForm extends Component {
    createTable = () => {
        let table = [];
        let numberOfGuests = 16; // Max on AirBnB.com

        let options = [];
        for (let i = 1; i <= numberOfGuests; i++) {
            options.push(<Option key={"option"+i} value={i}>{i} Adults</Option>)
        }

        table.push(<Select key={"select"} placeholder="0 Adults"  onChange={this.handleSelectChange}>{options}</Select>)
        return table;
    }

    createNeighborhoods = () => {
        let table = [];
        let options = [];
        for (let i = 0; i <= neighborhoods.length; i++) {
        options.push(<Option key={"neighborhood"+i} value={i}>{neighborhoods[i]}</Option>)
        }

        table.push(<Select key={"select-neighborhoods"} placeholder="Midtown" onChange={this.handleNeighborhoodsChange}>{options}</Select>)
        return table;        
    }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
        if (!err) {
          console.log('Destination ', values.destination);
          console.log('Slider ', values.slider);
          console.log(values.keyWords.split(" "))
          console.log(values["range-picker"][0]._d)
          console.log("Number of Adults: ", numAdults)
          console.log("Neighborhood: ", cityNeighborhood)
        }
        fetch('/api/airbnbListings', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                destination: values.destination,
                maxPrice: values.slider,
                dates: [values["range-picker"][0]._d, values["range-picker"][1]._d],
                numberAdults: numAdults,
                neighborhood: cityNeighborhood,
                keywords: values.keyWords.split(", ")
            })
        })
        // .then(res => res.json())
        // .then(d => console.log(d))
      });
  }


  handleSelectChange = (value) => {
    numAdults = value;
  }

  handleNeighborhoodsChange = (value) => {
      cityNeighborhood = neighborhoods[value];
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    const rangeConfig = {
        rules: [{ type: 'array',message: 'Please select time!' }],
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
            <Form style={{width:"20em"}} >
            <Form.Item label="Destination">
                {getFieldDecorator('destination', {
                    rules: [{
                    initialValue: "New York City",
                    }],
                })(
                    <Input placeholder="New York City"/>
                )}
            </Form.Item>
            <Form.Item label="Dates of travel">
                {getFieldDecorator('range-picker', rangeConfig)(
                    <RangePicker />
                )}
            </Form.Item>
            <Form.Item label="Neighborhoods">
                    {this.createNeighborhoods()}
                </Form.Item>
            </Form>
        </Col>
        
        <Col span={8} style={{display: "block", paddingLeft: "10em"}}>
            <Form layout="horizontal" style={{width: "20em"}} onSubmit={this.handleSubmit}>
                <Form.Item label="Number of Guests">
                    {this.createTable()}
                    {/* <Select key={"select"} placeholder="0 Adults" onChange={this.handleSelectChange}>
                        <Option key={"option"+1} value={1}>{1} Adults</Option>
                    </Select> */}
                </Form.Item>
                <Form.Item
                    label="Max Price"
                >
                    {getFieldDecorator('slider')(
                        <Slider marks={{
                        0: 'A', 20: 'B', 40: 'C', 60: 'D', 80: 'E', 100: 'F',
                        }}
                        />
                    )}
                </Form.Item>
                <Form.Item label="keyWords">
                {getFieldDecorator('keyWords', {
                    rules: [{
                    initialValue: "",
                    }],
                })(
                    <Input placeholder=""/>
                )}
            </Form.Item>
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                    >
                    Submit 
                    </Button>
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