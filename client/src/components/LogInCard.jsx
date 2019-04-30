import { Card, Icon, Spin, Form, Input, Button, Modal } from 'antd';
import 'antd/dist/antd.css'
import React, { Component } from 'react';
import '../App.css';
import CollectionsPage from './CollectionsPage';
import { Route, Redirect } from "react-router-dom";
import Cookies from 'universal-cookie';
import NavBar from './NavBar'
const cookies = new Cookies();
// cookies.set('myCat', 'Pacman', { path: '/' });
// console.log(cookies.get('myCat'));

const titleFont = {
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'",
    color:"black",
    fontSize:"25px",
  }

// Look at Login react-router component
class LogInCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
        email : '',
        password: '',
        guest: false,
        submitted: false,
        ModalText: 'Content of the modal',
        visible: false,
        confirmLoading: false,
        redirecting: false,
        guestRedirect: false,
    };
  }
  showModal = (d) => {
    d.preventDefault();
    this.setState({
      visible: true,
    });
  }

  handleOk = (d) => {
    console.log(d);
    this.setState({
      ModalText: 'The modal will be closed after two seconds',
      confirmLoading: true,
    });
    setTimeout(() => {
      this.setState({
        visible: false,
        confirmLoading: false,
      });
    }, 2000);
  }

  handleCancel = () => {
    console.log('Clicked cancel button');
    this.setState({
      visible: false,
    });
  }

  guestSignIn = () => {
    console.log("guest")
    this.setState({ 
      guestRedirect: !this.state.guestRedirect
    });     

    // Just redirect!

  //   fetch('/api/guestLogIn', {
  //     method: 'GET',
  //     headers: {
  //         'Accept': 'application/json',
  //         'Content-Type': 'application/json',
  //     }
  // })    
  // .then(res => {
  //     if (res.status === 200) {
  //       // TODO: Save Cookie
  //       console.log(cookies.get('token'))
  //       console.log("Logged In");
  //       console.log(res)
  //       this.setState({
  //         redirecting: !this.state.redirecting
  //       });          
  //       return res.body;
  //     } else {
  //       alert('Incorrect User Name or Password, Please try again')
  //     }
  //   })
  }

  handleLogIn = (d) => {
      fetch('/api/login', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: d.username,
            password: d.password,
        })
    })    
    .then(res => {
        if (res.status === 200) {
          // TODO: Save Cookie
        
          console.log(cookies.get('token'))

          console.log("Logged In");
          console.log(res)
          this.setState({
            redirecting: !this.state.redirecting
          });          
          return res.body;
        } else {
          alert('Incorrect User Name or Password, Please try again')
        }
      })
      .then((body) => console.log(body))
      .catch(err => {
        console.error(err);
        alert('Incorrect User Name or Password, Please try again');
      });   
  }


  handleSubmit = (d) => {
      console.log("SUBMITTED")

      this.setState({
          submitted: !this.state.submitted
      });

      d.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (!err) {
        console.log('Destination ', values.Username);
        console.log('Slider ', values.Password);
        } else {
          console.log("ERROR", err)
          return;
        }

        console.log("REGISTERING", values)

        fetch('/api/register', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: values.Username,
                password: values.Password,
            })
        })
        .then(res => {
          if (res.status === 200) {
            // TODO: Save Cookie
            console.log("Logged In");
            this.setState({
              submitted: !this.state.submitted,
              redirecting: !this.state.redirecting
            });          
  
          } else {
            alert('Please Input a valid username and password')
          }
        })
        .catch(err => {
          console.error(err);
          alert('Please Input a valid username and password');
        });   
    });
  }

  usernameValidator = (rules, value, callback) => {
    console.log(value)
    if (!value || value.length <= 4) callback("Username must be atleast 5 characters long")
    else callback();
}

  render() {
    const { getFieldDecorator } = this.props.form;
    const { visible, confirmLoading, ModalText } = this.state;
    const { redirecting, guestRedirect } = this.state

    if (redirecting) return <Redirect to={'/home/'} />;
    if (guestRedirect) return <Redirect to={'/guestHome/'} />;

    return (
      <div>
        <Card
          style={{ width: '60%', height:"50%", padding:"none" }}
        >
            <div style={{padding:"auto"}}><p><b style={titleFont}>Sign Up Now!</b></p></div>
            <div>
                <p>TripIt! is an Itinerary planner personalized to your interests. Sign up for an account to save your trips!</p>
            </div>
            <Form layout="horizontal" style={{width: "100%"}} onSubmit={this.handleSubmit}>
                <Form.Item label="username">
                    {getFieldDecorator('Username', {
                        rules: [{
                            required: true, 
                            message: 'Please input your Username!'
                        }, {
                          validator: this.usernameValidator
                        }],
                    })(
                        <Input placeholder="User Name"/>
                    )}
                </Form.Item>
                <Form.Item label="password">
                  {getFieldDecorator('Password', {
                      rules: [{
                      required: true, 
                      message: 'Please input your Password!'
                      },{
                        validator: this.usernameValidator
                      }],
                  })(
                      <Input.Password placeholder="Password" />
                  )}
                </Form.Item>
                <Form.Item style={{paddingTop:"40%", textAlign:"center"}}>
                    <Button
                    type="primary"
                    htmlType="submit"
                    style={{width:"100%", paddingBottom:"none"}}>
                    Create New Account 
                    </Button>
                  {/* {
                    this.state.submitted ? <Spin tip="Loading"></Spin> : 
                    <Button
                    type="primary"
                    htmlType="submit"
                    style={{width:"100%", paddingBottom:"none"}}>
                    Create New Account 
                    </Button>
                  } */}
            </Form.Item>
            </Form> 
            <Button
                    onClick={this.guestSignIn}
                    style={{width:"100%", paddingTop:"none"}}>
                    Continue as Guest 
              </Button>
              <CollectionsPage login={this.handleLogIn}></CollectionsPage>
        </Card>       
      </div>
    );
  }
}

export default Form.create()(LogInCard);;