import React, { Component } from "react";
import { FlatList, View, PermissionsAndroid, Text, Platform } from 'react-native';
import * as Progress from 'react-native-progress';
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

  getNearbyPlayers = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const geofirestore = new GeoFirestore(firebase.firestore());

        // Create a GeoCollection reference
        const geocollection = geofirestore.collection('players');
        
        // Create a GeoQuery based on a location
        const query = geocollection.near({ 
          center: new firebase.firestore.GeoPoint(position.coords.latitude, position.coords.longitude), 
          radius: 50 
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
        this.getNearbyPlayers();
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
    if(Platform.OS === 'android')
    this.requestLocationPermission();
    else if(Platform.OS === 'ios'){
      this.getNearbyPlayers();
    }
  }
  render() {
    if (this.state.loading) {
      return (
        <View style={{ flex: 1 }}>
          <Progress.Circle style={{ alignSelf: 'center', marginTop: 50 }} color="#ffa737" size={45} borderWidth={3} indeterminate={true} />
          <Text style={{ textAlign: 'center' }}>Searching players...</Text>
        </View>
      )
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