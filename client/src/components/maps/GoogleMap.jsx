import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker, InfoWindow, Polyline } from 'google-maps-react';

const mapStyles = {
  width: '40%',
  height: '50%',
  left: '55%',
  top: "40%"
};

export class GoogleMap extends Component {
    state = {
        showingInfoWindow: false,  //Hides or the shows the infoWindow
        activeMarker: {},          //Shows the active marker upon click
        selectedPlace: {}          //Shows the infoWindow to the selected place upon a marker
      };

    onMarkerClick = (props, marker, e) =>
      this.setState({
        selectedPlace: props,
        activeMarker: marker,
        showingInfoWindow: true
      });
  
    onClose = props => {
      if (this.state.showingInfoWindow) {
        this.setState({
          showingInfoWindow: false,
          activeMarker: null
        });
      }
    };


  // Will make center be airbnb and all the restauarunts be other pins on the map
  render() {
    const triangleCoords = [
        {lat: 40.7447766, lng: -73.9101444},
        {lat: 40.6, lng: -73.9},
      ];

    return (
      <Map
        google={this.props.google}
        zoom={14}
        style={mapStyles}
        initialCenter={{ lat: this.props.lat || 40.6, lng: this.props.long || -73.9 }}
      >
        {this.props.venues.map((venue) => {
          let lat = venue.latitude;
          let long = venue.longitude;
          let markerKey = this.props.listingID + "" + venue.name
          
          return <Marker key={markerKey} name={venue.name} onClick={this.onMarkerClick} position={{lat:lat, lng:long}}/>
        })}

        {/* {this.props.venueCoords.map((coords) => {
          return <Marker key={this.props.listingID} position={{lat:coords[0], lng: coords[1]}}/>
        })} */}

        <Marker
          onClick={this.onMarkerClick}
          name={this.props.airbnbName}
        />
        <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}
          onClose={this.onClose}
        >
          <div>
            <h4>{this.state.selectedPlace.name}</h4>
          </div>
        </InfoWindow>
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyC_3WomJNrWVK5uNqwNf-9CGfANQ_RRqYY"
})(GoogleMap);