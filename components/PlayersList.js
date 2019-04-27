import React, { Component } from "react";
import { FlatList, View, PermissionsAndroid, Text, Platform, StyleSheet } from 'react-native';
import { Content } from 'native-base';
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
      noPlayersNearby: false,
      user: null
    };

    this.requestLocationPermission = this.requestLocationPermission.bind(this);
  }

  getNearbyPlayers = () => {
    const { user } = this.state;
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
          if(!snapshot.empty) {
            var players = [];
            snapshot.docs.forEach(doc => {
              const { firstName, lastName, gender, birthday, avatarUrl } = doc.data();
              if(!user || user.uid !== doc.id)
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
          } else this.setState({ noPlayersNearby: true });
          
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
        firebase.firestore().collection('players').get().then(snapshot => {
          var players = [];
          snapshot.docs.forEach(doc => {
              const { firstName, lastName, gender, birthday, avatarUrl } = doc.data();
              players.push({
                key: doc.id,
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

    this.unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) this.setState({ user: user, loading: true }); else this.setState({ user: null, loading: true });
      this.getNearbyPlayers();
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe) this.unsubscribe();
  }

  render() {
    const styles = StyleSheet.create({
      contentCenter: { 
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1 
      },
      progressCircle: { 
        alignSelf: 'center',
        marginBottom: 10 
      },
      noPlayersView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      },
      text: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold'
      }
    });

    if (this.state.loading) {
      return (
        <Content contentContainerStyle={ styles.contentCenter }>
          <Progress.Circle style={ styles.progressCircle } color="#ffa737" size={50} borderWidth={4} indeterminate={true} />
          <Text style={ styles.text }>Searching players...</Text>
        </Content>
      )
    }
    if(!this.state.noPlayersNearby)
      return (
        <Content>
          <View style={{ flex: 1 }}>
              <FlatList
                  data={this.state.players}
                  renderItem={({item}) => <PlayerCard {...item} />}
              />
          </View>
        </Content>);
     else
     return (
      <Content contentContainerStyle={ styles.contentCenter }>
        <Text style={styles.text}>No players nearby</Text>
      </Content>);
  }
}
export default withNavigation(PlayersList);