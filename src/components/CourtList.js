import React, { Component } from "react";
import { FlatList, View, Text, Platform, StyleSheet } from 'react-native';
import { Content } from 'native-base';
import firebase from 'react-native-firebase';
import MapView, { Marker } from 'react-native-maps';

import { GeoFirestore } from 'geofirestore';

import { withNavigation } from 'react-navigation';

class CourtList extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      courts: [],

    };
  }
    
  componentDidMount() {
    const { latitude, longitude } = this.props;

    const geofirestore = new GeoFirestore(firebase.firestore());

    // Create a GeoCollection reference
    const geocollection = geofirestore.collection('courts');

    // Create a GeoQuery based on a location
    const query = geocollection.near({
      center: new firebase.firestore.GeoPoint(latitude, longitude),
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
      } else alert('No courts nearby!');

      this.setState({ courts });
    });
  }

  render() {
    return (
        <Content contentContainerStyle={{...StyleSheet.absoluteFillObject }}>
          <MapView
            style={{ ...StyleSheet.absoluteFillObject }}
            region={{
            latitude: this.props.latitude,
            longitude: this.props.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
            }}>
            {this.state.courts && this.state.courts.map(court => (
                <Marker
                coordinate={{latitude: court.l.latitude, longitude: court.l.longitude}}
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