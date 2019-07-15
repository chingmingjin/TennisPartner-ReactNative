import React, { Component } from "react";
import { FlatList, View, Text, Platform, StyleSheet } from 'react-native';
import { Content, Icon } from 'native-base';
import * as Progress from 'react-native-progress';
import firebase from 'react-native-firebase';
import { haversine } from '../utils/haversine';

import PlayerCard from '../components/PlayerCard';

import { GeoFirestore } from 'geofirestore';

import { withNavigation } from 'react-navigation';
import equal from "fast-deep-equal";

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
    this.unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) this.setState({ user: user, loading: true }, () => this.getNearbyPlayers(this.props.distance)); 
      else this.setState({ user: null, loading: true }, () => this.getNearbyPlayers(this.props.distance));
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe) this.unsubscribe();
  }

  componentDidUpdate(prevProps) {
    if(!equal(this.props.distance, prevProps.distance)) {
      this.setState({ loading: true }, () => this.getNearbyPlayers(this.props.distance));
    }
  }

  getNearbyPlayers = (distance) => {
    const { latitude, longitude, remoteLat, remoteLon } = this.props;
    const { user } = this.state;
    const geofirestore = new GeoFirestore(firebase.firestore());

    // Create a GeoCollection reference
    const geocollection = geofirestore.collection('players');
    const center =
      (remoteLat != 0 && remoteLon != 0) ?
        new firebase.firestore.GeoPoint(remoteLat, remoteLon) :
        new firebase.firestore.GeoPoint(latitude, longitude);
    // Create a GeoQuery based on a location
    const query = geocollection.near({
      center: center,
      radius: distance
    });

    // Get query (as Promise)
    query.get().then((snapshot) => {
      if (!snapshot.empty) {
        var players = [];
        snapshot.docs.forEach(doc => {
          const { firstName, lastName, gender, birthday, avatarUrl, l, presence } = doc.data();
          if (!user || user.uid !== doc.id) {
            var distance = haversine(this.props.latitude, this.props.longitude, l.latitude, l.longitude).toFixed(1);
            var state = presence.state;
            var last_changed = presence.last_changed;
            players.push({
              key: doc.id,
              doc, // DocumentSnapshot
              firstName,
              lastName,
              gender,
              birthday,
              avatarUrl,
              distance,
              state,
              last_changed
            });
          }
        });
        players.sort((a,b) => (a.distance > b.distance) ? 1 : ((b.distance > a.distance) ? -1 : 0)); 
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
        fontSize: 18,
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
                  renderItem={({item}) => <PlayerCard {...this.props} {...item} />}
              />
          </View>
        </Content>);
     else
     return (
      <Content contentContainerStyle={ styles.contentCenter }>
        <Icon style={{ fontSize: 50, marginBottom: 10 }} type="FontAwesome5" name="frown" />
        <Text style={styles.text}>There are currently no players in {this.props.city}</Text>
      </Content>);
  }
}
export default withNavigation(PlayersList);