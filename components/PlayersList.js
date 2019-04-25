import React, { Component } from "react";
import { FlatList, View, PermissionsAndroid } from 'react-native';
import { Spinner } from 'native-base';
import firebase from 'react-native-firebase';

import PlayerCard from '../components/PlayerCard';

import Geolocation from 'react-native-geolocation-service';
import { GeoFirestore } from 'geofirestore';

import { withNavigation } from 'react-navigation';

class PlayersList extends Component {
  constructor() {
    super();

    this.state = {
      players: [],
      loading: true,
    };

    this.requestLocationPermission = this.requestLocationPermission.bind(this);
  }

  async requestLocationPermission() {      
    try {
      var players = [];
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message:
            'Tennis Partner needs access to your location ' +
            'so we could find players nearby.',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Geolocation.getCurrentPosition(
          (position) => {
            const geofirestore = new GeoFirestore(firebase.firestore());
  
            // Create a GeoCollection reference
            const geocollection = geofirestore.collection('players');
            
            // Create a GeoQuery based on a location
            const query = geocollection.near({ 
              center: new firebase.firestore.GeoPoint(position.coords.latitude, position.coords.longitude), 
              radius: 20 
            });
            
            // Get query (as Promise)
            query.get().then((snapshot) => {
              snapshot.docs.forEach(doc => {
                const { firstName, lastName, gender, birthday, avatarUrl } = doc.data();
                players.push({
                  key: doc.id,
                  doc, // DocumentSnapshot
                  firstName,
                  lastName,
                  gender,
                  birthday,
                  avatarUrl
                });
              });
              
              this.setState({ 
                players,
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
      } else {
        firebase.firestore().collection('users').get().then(snapshot => {
          snapshot.docs.forEach(doc => {
              const { firstName, lastName, gender, birthday, avatarUrl } = doc.data();
              players.push({
                key: doc.id,
                doc, // DocumentSnapshot
                firstName,
                lastName,
                gender,
                birthday,
                avatarUrl
              });
            });
            this.setState({ 
              players,
              loading: false,
            });
        });
      }
    } catch (err) {
      console.warn(err);
    }
  }

  componentDidMount() {
    this.requestLocationPermission();
  }
  render() {
    if (this.state.loading) {
      return (
        <Spinner size="large" color='#ffa737' />
      ); // or render a loading icon
    }
    return (
      <View style={{ flex: 1 }}>
          <FlatList
              data={this.state.players}
              renderItem={({item}) => <PlayerCard {...item} />}
          />
      </View>
    );
  }
}
export default withNavigation(PlayersList);