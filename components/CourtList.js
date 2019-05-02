import React, { Component } from "react";
import { FlatList, View, PermissionsAndroid, Text, Platform, StyleSheet } from 'react-native';
import { Content } from 'native-base';
import firebase from 'react-native-firebase';
import MapView from 'react-native-maps';

import Geolocation from 'react-native-geolocation-service';
import { GeoFirestore } from 'geofirestore';

import { withNavigation } from 'react-navigation';

class CourtList extends Component {
  
    constructor() {
        super();
    
        this.state = {
          courts: [],
          noCourtsNearby: false,
          lat: 0,
          lon: 0
        };
    
        this.requestLocationPermission = this.requestLocationPermission.bind(this);
      }
    
      getNearbyCourts = () => {
        const { user } = this.state;
        Geolocation.getCurrentPosition(
          (position) => {
            this.setState({ lat: position.coords.latitude, lon: position.coords.longitude });

            const geofirestore = new GeoFirestore(firebase.firestore());
    
            // Create a GeoCollection reference
            const geocollection = geofirestore.collection('courts');
            
            // Create a GeoQuery based on a location
            const query = geocollection.near({ 
              center: new firebase.firestore.GeoPoint(position.coords.latitude, position.coords.longitude), 
              radius: 50 
            });
            
            // Get query (as Promise)
            query.get().then((snapshot) => {
              if(!snapshot.empty) {
                var courts = [];
                snapshot.docs.forEach(doc => {
                  const { name, phone } = doc.data();
                    courts.push({
                      name, phone
                    });
                });
              } else this.setState({ noCourtssNearby: true });
              
              this.setState({ 
                courts,
                loading: false,
              });
            });
          },
          (error) => {
              // See error code charts below.
              console.log(error.code, error.message);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      }
    
      async requestLocationPermission() {      
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Permission',
              message:
                'Tennis Partner needs access to your location ' +
                'so we could find courts nearby.',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            this.getNearbyCourts();
          } 
        } catch (err) {
          console.warn(err);
        }
      }
    
      componentDidMount() {
        if(Platform.OS === 'android')
        this.requestLocationPermission();
        else if(Platform.OS === 'ios'){
          this.getNearbyCourts();
        }
      }

  render() {
    return (
        <Content contentContainerStyle={{...StyleSheet.absoluteFillObject }}>
          <MapView
            style={{ ...StyleSheet.absoluteFillObject }}
            region={{
            latitude: this.state.lat,
            longitude: this.state.lon,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
            }}
            />
        </Content>
    );
  }
}
export default withNavigation(CourtList);