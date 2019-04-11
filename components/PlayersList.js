import React, { Component } from "react";
import { FlatList, View } from 'react-native';
import { Spinner } from 'native-base';
import firebase from 'react-native-firebase';

import PlayerCard from '../components/PlayerCard';

import { withNavigation } from 'react-navigation';


class PlayersList extends Component {
  constructor() {
    super();
    this.firebaseRef = firebase.firestore().collection('users');

    this.state = {
      players: [],
      loading: true,
    };
  }
  componentDidMount() {
    var players = [];
    this.firebaseRef.get().then(snapshot => {
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
  render() {
    if (this.state.loading) {
      return (
      <View style={{
        flex: 1, 
        alignItems: 'center',
        justifyContent: 'center'}}>
        <Spinner size='large' color='#ffa737' />
      </View>); // or render a loading icon
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