import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker, InfoWindow, Polyline } from 'google-maps-react';

const mapStyles = {
  width: '50%',
  height: '50%'
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
        <Polyline
          path={triangleCoords}
          geodesic={true}
          strokeColor="#0000FF"
          strokeOpacity={0.8}
          strokeWeight={2} />
        <Marker
          onClick={this.onMarkerClick}
          name={'Kenyatta International Convention Centre'}
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