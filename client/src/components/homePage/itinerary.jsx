import React, { Component } from 'react';
import { Button, Form } from 'antd';
import 'antd/dist/antd.css'
import SavingModal from '../savingModal'



class Itinerary extends Component {
    constructor(props) {
        super(props);
    }

    handleSave = (itineraryName) => {
        console.log(itineraryName);
        console.log("SAVING...")

        fetch("/api/saveListings", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                itineraryName: itineraryName,
                listingID: this.props.listingID,
                venues: this.props.venues,
                listing: this.props.rawListing
            })          
        })
        .then((res) => {
            console.log(res)
            this.props.changeName(itineraryName);
        })
    }

    handleSaveFunc = (savedItinerary) => {
        // this.setState({
        //     saving: !this.state.saving
        // })
        this.handleSave(savedItinerary.itineraryName);
    }

    // state = {
    //     saving: this.props.saving
    // }

    renderButtons = () => {
        if (this.props.saving) {
            return (
                <div>
                <Button onClick={this.handleBack}>Back</Button>
                <Form>
                    <SavingModal save={this.handleSaveFunc}></SavingModal>
                </Form>
                {/* <Button onClick={this.handleSave}>Save</Button>     */}
                {/* <SavingModal></SavingModal> */}
                </div>             
            );
        } else {
            return;
        }
    }

    render () {
        return (
            <div style={{width:'100%', height:'100%', paddingTop:"0%"}}>
                {this.props.listing}
                <div style={{position:"absolute", paddingTop:"18%", width:"90%", height:"100%"}}>{this.props.venueScroller}</div>
                {this.props.gmap}
                {this.renderButtons()}
            </div>
        );
    }
}

export default Itinerary;