import React, { Component } from "react";
import { FlatList, View } from 'react-native';
import firebase from 'react-native-firebase';

import PlayerCard from '../components/PlayerCard';

import { withNavigation } from 'react-navigation';


class PlayersList extends Component {
  constructor() {
    super();
    this.firebaseRef = firebase.firestore().collection('users');

    this.state = {
      players: [],
    };
  }
  componentDidMount() {
    var players = [];
    this.firebaseRef.get().then(snapshot => {
      snapshot.docs.forEach(doc => {
          const { firstName, lastName, gender, birthday } = doc.data();
          players.push({
            key: doc.id,
            doc, // DocumentSnapshot
            firstName,
            lastName,
            gender,
            birthday,
          });
        });
    });
    this.setState({ 
      players,
   });
  }
  render() {
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