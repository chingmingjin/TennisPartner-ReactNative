import React, { Component } from "react";
import { FlatList, View, Text, Platform, StyleSheet } from 'react-native';
import { Content } from 'native-base';
import * as Progress from 'react-native-progress';
import firebase from 'react-native-firebase';

import PlayerCard from '../components/PlayerCard';

import { GeoFirestore } from 'geofirestore';

import { withNavigation } from 'react-navigation';

class PlayersList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      players: [],
      loading: true,
      noPlayersNearby: false,
      user: null
    };
  }

  componentDidMount() {
    this.getNearbyPlayers();
    this.unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) this.setState({ user: user, loading: true }); else this.setState({ user: null, loading: true });
      this.getNearbyPlayers();
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe) this.unsubscribe();
  }

  getNearbyPlayers = () => {
    const { latitude, longitude } = this.props;
    const { user } = this.state;
    const geofirestore = new GeoFirestore(firebase.firestore());

    // Create a GeoCollection reference
    const geocollection = geofirestore.collection('players');

    // Create a GeoQuery based on a location
    const query = geocollection.near({
      center: new firebase.firestore.GeoPoint(latitude, longitude),
      radius: 100
    });

    // Get query (as Promise)
    query.get().then((snapshot) => {
      if (!snapshot.empty) {
        var players = [];
        snapshot.docs.forEach(doc => {
          const { firstName, lastName, gender, birthday, avatarUrl } = doc.data();
          if (!user || user.uid !== doc.id)
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