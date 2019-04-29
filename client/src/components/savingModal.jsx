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
            title="Save Itinerary"
            okText="Save"
            onCancel={onCancel}
            onOk={onCreate}
          >
            <Form layout="vertical">
              <Form.Item>
                {getFieldDecorator('itineraryName', {
                  rules: [{ required: true, message: 'Name your Itinerary!' }],
                })(
                  <Input placeholder="My Trip"/>
                )}
              </Form.Item>
            </Form>
          </Modal>
        );
      }
    }
  );
  
  class SavingModal extends React.Component {
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
  
        this.props.save(values);
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
          <Button type="primary" onClick={this.showModal}>Save</Button>
          {/* <div style={{textAlign:"center"}}>Have an account already? <a href="" onClick={this.showModal}>Log In!</a></div> */}
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

export default SavingModal;