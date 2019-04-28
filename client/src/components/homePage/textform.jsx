import React, { Component } from 'react';
import 'antd/dist/antd.css'
import {
    Form, Input, Button, DatePicker, Select, Col, Slider, Spin
  } from 'antd'

  const { TextArea } = Input;
const { MonthPicker, RangePicker } = DatePicker;
const { Option } = Select;
let numAdults = 1;

let cityNeighborhood = "Midtown";
let city = "New York City";
let neighborhoodInCity = "";

let destinations =
[
    "New York City",
    "San Francisco",
    "Seattle",
    "Boston"
]

let bostonNeighorhoods = 
[
    "East Boston",
    "Charlestown",
    "West End",
    "North End",
    "Downtown",
    "Beacon Hill",
    "Chinatown",
    "Bay Village",
    "Back Bay",
    "South End",
    "South Boston",
]

let sanFranciscoNeighborhoods = 
[
    "Mission",
    "North Beach",
    "South of Market",
    "Western Addition",
    "Marina",
    "Inner Richmond",
    "Potrero Hill",
    "Nob Hill",
    "Downtown/Civic Center",
    "Chinatown",
]

let seattleNeighborhoods =
[
    "Pike-Market",
    "Pioneer Square",
    "Lower Queen Anne",
    "South Lake Union",
    "Central Business District",
    "Atlantic",
    "Madrona",
    "Wallingford",
    "First Hill",
    "Belltown",
    "Broadway",
    "Eastlake"
]


// let neighborhoods = 
// [
//   "Upper West Side",
//   "Hell's Kitchen",
//   "Midtown",
//   "Upper East Side",
//   "Flushing",
//   "Jackson Heights"
// ]

let newYorkCityneighborhoods =
[
    "Bedford-Stuyvesant",
    "Harlem",
    "Midtown",
    "Hell's Kitchen",
    "Upper West Side",
    "Upper East Side",
    "Chinatown",
    "Chelsea",
    "Flatiron District",
    "Lower East Side",
    "West Village",
    "Forest Hills",
    "Williamsburg",
    "Flushing",
    "Jackson Heights",
    "Greenpoint",
    "Long Island City",
    "SoHo",
    "Greenwich Village",
    "Bronxdale"
]

class TextForm extends Component {
    state = {
        submitted:false,
        currentNeighborhoods: newYorkCityneighborhoods,
        selectedCity: ""
    }  

    receivedResultsHandler = (listings) => {
        
        // Create new Tab
        console.log("...received", listings)
        this.props.addTab(listings);
        this.setState({
            submitted: !this.state.submitted,
            bioValue: ""
        })
    }


    createTable = () => {
        let table = [];
        let numberOfGuests = 16; // Max on AirBnB.com

        let options = [];
        for (let i = 1; i <= numberOfGuests; i++) {
            options.push(<Option key={"option"+i} value={i}>{i} Adults</Option>)
        }

        table.push(<Select key={"select"} placeholder="1 Adults"  onChange={this.handleSelectChange}>{options}</Select>)
        return table;
    }

    handleSubmit = (e) => {
        console.log("...finding listings", e)
        
        e.preventDefault();
        this.setState({
            submitted: !this.state.submitted
        })
        
        this.props.form.validateFields((err, values) => {
            const duration = 3; // Hard code while still in keywords
            if (!err) {
            console.log('Destination ', values.destination);
            console.log("Neighborhood", values.neighborhood)
            console.log('Slider ', values.slider);
            console.log(values.keyWords.split(" "))
            console.log(values["range-picker"][0]._d)
            console.log("Number of Adults: ", numAdults)
            // console.log("Neighborhood: ", cityNeighborhood)
            console.log("text", values.bio)
                fetch('/api/getListings', {
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
                        duration: duration,
                        neighborhood: values.neighborhood,
                        keywords: values.keyWords.split(", "),
                        bio: values.bio
                    })
                })
                .then(res => res.json())
                .then(d => this.receivedResultsHandler(d))
                .catch(err => console.log(err))
            } else {
                console.log("Printing errors:")
                console.log(err);
                this.setState({
                    submitted: false
                })
            }
        });
    }


  handleSelectChange = (value) => {
    numAdults = value;
  }


  handleNeighborhoodsChange = (value) => {
      cityNeighborhood = this.state.currentNeighborhoods[value];
      neighborhoodInCity = city;
  }

  handleDestinationChange = (value) => {
      city = value
      let newNeighborhoods;
      if (city === "New York City") newNeighborhoods = newYorkCityneighborhoods;
      else if (city === "Seattle") newNeighborhoods = seattleNeighborhoods;
      else if (city === "San Francisco") newNeighborhoods = sanFranciscoNeighborhoods;
      else newNeighborhoods = bostonNeighorhoods;

      this.setState({
          currentNeighborhoods: newNeighborhoods,
          selectedCity: city
      })

      // Clear neighborhood selection
  }

  handleTextChange = (val) => {
      console.log(val);
  }

  neighborhoodValidator = (rules, value, callback) => {
      const form = this.props.form;
      console.log(value)
      if (neighborhoodInCity !== this.state.selectedCity) {
        callback("The destination has changed, pick a new neighborhood!")
      }
  }

  render() {
    const { submitted } = this.state;
    const { getFieldDecorator } = this.props.form;
    const rangeConfig = {
        rules: [
            { 
            type: 'array',
            required:true,
            message: 'Please select time!' 
            }
        ],
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
        <Col span={10} style={{display: "block"}}>
            <Form style={{width:"100%"}} >
            <Form.Item label="Destination">
                {getFieldDecorator('destination', {
                    rules: [{
                    required: true,
                    message: "Please choose your destination!"
                    }],
                })(
                    <Select onChange={this.handleDestinationChange}>
                        {destinations.map((d, i) => {
                            return <Option key={"destination"+i} value={d}>{d}</Option>
                        })}
                    </Select>
                )}
            </Form.Item>
            <Form.Item label="Dates of travel">
                {getFieldDecorator('range-picker', rangeConfig)(
                    <RangePicker />
                )}
            </Form.Item>
            <Form.Item label="Neighborhoods">
                {getFieldDecorator('neighborhood', {
                        rules: [{
                            required: true,
                            message: "Please choose your neighborhood!",
                        },{
                            validator: this.neighborhoodValidator
                        }
                        ],
                    })(
                        <Select onChange={this.handleNeighborhoodsChange}>
                            {this.state.currentNeighborhoods.map((d, i) => {
                                return <Option key={"neighborhood"+i} value={d}>{d}</Option>
                            })}
                        </Select>
                    )}
                    {/* {this.createNeighborhoods()} */}
                </Form.Item>
            <Form.Item label="bio">
            {getFieldDecorator('bio', {
                    rules: [{
                    initialValue: "I like big clean rooms with a pool",
                    required: true,
                    message: "Please enter a small bio for personalized results!"
                    }],
                })(
                    <TextArea rows={4} placeholder="I like big clean rooms with a pool"/>
                )}
            </Form.Item>
            </Form>
        </Col>
        
        <Col span={3} style={{display: "block", paddingLeft: "3%"}}>
        </Col>

        <Col span={10} style={{display: "block", paddingLeft: "3%"}}>
            <Form layout="horizontal" style={{width: "100%"}} onSubmit={this.handleSubmit}>
                <Form.Item label="Number of Guests">
                    {this.createTable()}
                </Form.Item>
                <Form.Item label="Key words">
                {getFieldDecorator('keyWords', {
                    rules: [{
                    initialValue: "",
                    required: true,
                    message: "Please enter some Keywords!"
                    }],
                })(
                    <Input placeholder=""/>
                )}
                </Form.Item>
                <Form.Item
                    label="Max Price Per Night"
                >
                    {getFieldDecorator('slider', {
                        rules: [{
                            required: true,
                            message: "Please choose a Maximum Price!"
                        }],
                    })(
                        <Slider min={0} max={1000} marks={{
                        0: '$0', 200: '$200', 400: '$400', 600: '$600', 800: '$800', 1000: '$1000',
                        }}
                        />
                    )}
                </Form.Item>
                <Form.Item style={{float:"right"}}>
                {
                    submitted ? <Spin tip="Loading"></Spin> : 
                    <Button
                        type="primary"
                        htmlType="submit">
                        Submit 
                     </Button>
                }
                </Form.Item>
            </Form> 
        </Col>
        {/* <TextArea rows={4}/> */}
        </div>
    );
  }
}
export default Form.create()(TextForm);;