import React, { Component } from 'react';
import {
    Button, Modal, Form, Input, Radio,
  } from 'antd';
  
  const CollectionCreateForm = Form.create({ name: 'form_in_modal' })(
    class extends React.Component {
      render() {
        const {
          visible, onCancel, onCreate, form,
        } = this.props;
        const { getFieldDecorator } = form;
        return (
          <Modal
            visible={visible}
            title="Log In"
            okText="Log In"
            onCancel={onCancel}
            onOk={onCreate}
          >
            <Form layout="vertical">
              <Form.Item>
                {getFieldDecorator('username', {
                  rules: [{ required: true, message: 'Please enter your Username' }],
                })(
                  <Input placeholder="Username"/>
                )}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator('password', {
                    rules: [{
                    required: true, 
                    message: 'Please input your Password!'
                    }],
                })(
                    <Input.Password placeholder="Password" />
                )}
            </Form.Item>
            </Form>
          </Modal>
        );
      }
    }
  );
  
  class CollectionsPage extends React.Component {
    state = {
      visible: false,
    };
  
    showModal = (d) => {
      d.preventDefault();
      this.setState({ visible: true });
    }
  
    handleCancel = () => {
      this.setState({ visible: false });
    }
  
    handleCreate = () => {
      const form = this.formRef.props.form;
      form.validateFields((err, values) => {
        console.log("submitted")
        if (err) {
          return;
        }
  
        this.props.login(values);
        // console.log('Received values of form: ', values);
        form.resetFields();
        this.setState({ visible: false });
      });
    }
  
    saveFormRef = (formRef) => {
      this.formRef = formRef;
    }
  
    render() {
      return (
        <div>
          {/* <Button type="primary" onClick={this.showModal}>New Collection</Button> */}
          <div style={{textAlign:"center"}}>Have an account already? <a href="" onClick={this.showModal}>Log In!</a></div>
          <CollectionCreateForm
            wrappedComponentRef={this.saveFormRef}
            visible={this.state.visible}
            onCancel={this.handleCancel}
            onCreate={this.handleCreate}
          />
        </div>
      );
    }
  }

export default CollectionsPage;