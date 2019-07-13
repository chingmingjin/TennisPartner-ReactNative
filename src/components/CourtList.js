import React, { Component } from "react";
import { StyleSheet, Alert } from 'react-native';
import { Content } from 'native-base';
import firebase from 'react-native-firebase';
import MapView, { Marker } from 'react-native-maps';

import { GeoFirestore } from 'geofirestore';

import { withNavigation } from 'react-navigation';
import equal from "fast-deep-equal";

class CourtList extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      courts: [],
      mapType: this.props.mapType,
    };
  }
    
  componentDidMount() {
    const { latitude, longitude, remoteLat, remoteLon } = this.props;

    const geofirestore = new GeoFirestore(firebase.firestore());

    // Create a GeoCollection reference
    const geocollection = geofirestore.collection('courts');

    // Create a GeoQuery based on a location
    const query = geocollection.near({
      center: (remoteLat != 0 && remoteLon != 0) ?
      new firebase.firestore.GeoPoint(remoteLat, remoteLon) :
      new firebase.firestore.GeoPoint(latitude, longitude),
      radius: 50
    });

    // Get query (as Promise)
    query.get().then((snapshot) => {
      if (!snapshot.empty) {
        var courts = [];
        snapshot.docs.forEach(doc => {
          const { name, phone, l } = doc.data();
          courts.push({
            key: doc.id,
            name, phone, l
          });
        });
      } else Alert.alert(
        'No courts nearby',
        'We don\'t have any courts listed in your city yet. Can you help us and add them on the map?',
        [
          { text: 'Add court', onPress: () => console.log('Ask me later pressed') },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ],
      );

      this.setState({ courts });
    });
  }

  componentDidUpdate(prevProps) {
    if(!equal(this.props.mapType, prevProps.mapType)) // Check if it's a new user, you can also use some unique property, like the ID  (this.props.user.id !== prevProps.user.id)
    {
      this.setState({ mapType: this.props.mapType });
    }
    if(!equal(this.props.addMarker, prevProps.addMarker)) // Check if it's a new user, you can also use some unique property, like the ID  (this.props.user.id !== prevProps.user.id)
    {
      this.setState({ addMarker: this.props.addMarker });
    }
  }

  addMarker = (coordinates) => {
    console.log(coordinates);
  }

  render() {
    const lat = (this.props.remoteLat != 0) ? this.props.remoteLat : this.props.latitude;
    const lon = (this.props.remoteLon != 0) ? this.props.remoteLon : this.props.longitude;
    return (
      <Content contentContainerStyle={{ ...StyleSheet.absoluteFillObject }}>
        <MapView
          style={{ ...StyleSheet.absoluteFillObject }}
          region={{
            latitude: lat,
            longitude: lon,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          mapType={this.state.mapType}
        >
          {this.state.addMarker && (
            <Marker draggable
            coordinate={{ latitude: lat, longitude: lon }}
            image={require('../images/tennis_court_marker_add.png')}
            onDragEnd={(e) => this.addMarker(e.nativeEvent.coordinate)}
          />
              )}
          {this.state.courts && this.state.courts.map(court => (
            <Marker
              key={court.key}
              coordinate={{ latitude: court.l.latitude, longitude: court.l.longitude }}
              centerOffset={{ x: 0, y: -45 }}
              title={court.name}
              image={require('../images/tennis_court_marker.png')}
            />
          ))}
        </MapView>
      </Content>
    );
  }
}
export default withNavigation(CourtList);