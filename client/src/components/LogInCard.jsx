import { Card, Icon, Spin, Form, Input, Button, Modal } from 'antd';
import 'antd/dist/antd.css'
import React, { Component } from 'react';
import '../App.css';

const titleFont = {
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'",
    color:"black",
    fontSize:"25px",
  }

const bodyStyles = {
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'",
    color:"black",
    fontSize:"18px",
  }

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
    };
  }
  showModal = (d) => {
    d.preventDefault();
    this.setState({
      visible: true,
    });
  }

  handleOk = () => {
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
      console.log("here")
  }

  handleLogIn = (d) => {
      d.preventDefault();
      let username = "alisha" // Hard code for now
      let password = "asdfadf"
      fetch('/api/login', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            password: password,
        })
    })
    .then(res => {
        // Left off here: Need to figure out what this this.props.history.push thing is to
        // save the cookies returned. Need to make sure that when its not successful it doesn't
        // crash with the other methods. Need to make the secret token an environment variable. 
        if (res.status === 200) {
          console.log("Logged In");
          // this.context.history.push('/path'); // wtf is this
        } else {
          alert('Incorrect User Name or Password, Please try again')
        }
      })
      .catch(err => {
        console.error(err);
        alert('Incorrect User Name or Password, Please try again');
      });   
  }

  handleSubmit = (d) => {
      this.setState({
          submitted: !this.state.submitted
      });

      d.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (!err) {
        console.log('Destination ', values.Username);
        console.log('Slider ', values.Password);
        }

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
        .then((res) => {
            this.setState({
                submitted: !this.state.submitted
            });
            console.log(res)
        })
        .catch(err => console.log(err))
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { visible, confirmLoading, ModalText } = this.state;

    let onChange = (_) => {
        this.setState({
            guest: !this.state.guest
        })
    }

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
                <Form.Item>
                    {getFieldDecorator('Username', {
                        rules: [{
                            required: this.state.guest || true, 
                            message: 'Please input your Username!'
                        }],
                    })(
                        <Input placeholder="User Name"/>
                    )}
                </Form.Item>
                <Form.Item>
                {getFieldDecorator('Password', {
                    rules: [{
                    required: this.state.guest || true, 
                    message: 'Please input your Password!'
                    }],
                })(
                    <Input.Password placeholder="Password" />
                )}
            </Form.Item>
            <Form.Item style={{paddingTop:"40%", textAlign:"center"}}>
            {
                    this.state.submitted ? <Spin tip="Loading"></Spin> : 
                    <Button
                    type="primary"
                    htmlType="submit"
                    style={{width:"100%", paddingBottom:"none"}}>
                    Create New Account 
                    </Button>
                }
                <Button
                    type="secondary"
                    onClick={this.guestSignIn}
                    style={{width:"100%", paddingTop:"none"}}>
                    Continue as Guest 
                </Button>
                <div style={{textAlign:"center"}}>Have an account already? <a href="" onClick={this.showModal}>Log In!</a></div>
            </Form.Item>
            </Form> 
        </Card>
        <Modal
          title="Log In"
          visible={visible}
          onOk={this.handleOk}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
        >
          <p>{ModalText}</p>
        </Modal>        
        {/* <CardBody tabList={this.state.tabList} key={this.state.key} onTabChange={this.onTabChange} content={this.state.contentList[this.state.key]}></CardBody> */}
      </div>
    );
  }
}

export default Form.create()(LogInCard);;