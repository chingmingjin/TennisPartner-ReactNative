import React, { Component } from "react";
import { View, StyleSheet, Platform, Text } from 'react-native';
import { ListItem, Avatar, Badge } from 'react-native-elements';
import firebase from 'react-native-firebase';

import TouchableScale from 'react-native-touchable-scale';
import { getAge } from '../utils/age';
import { withNavigation } from 'react-navigation';

class PlayerCard extends Component {
  constructor(props) {
    super(props);
  }

  _renderNameAge = (name, age, distance) => {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
      <View style={{ flexDirection: 'row' }}>
        <Text style={ styles.firstName }>{name}</Text>
        <Text style={ styles.age }>{age}</Text>
      </View>
      <Text style={ styles.userInfo }>{ distance } km away</Text>
      <Text style={ styles.userInfo }>active { this.props.last_changed }</Text>
      </View>
    );
  }

  render() {
    const currentUser = firebase.auth().currentUser;

    return (
      <ListItem
        Component={TouchableScale}
        containerStyle={ styles.container }
        friction={90} //
        tension={100} // These props are passed to the parent component (here TouchableScale)
        activeScale={0.95} //
        leftElement={
          <View>
            <Avatar
              avatarStyle={styles.avatar}
              rounded
              title={this.props.firstName[0]}
              source={{
                uri: this.props.avatarUrl,
              }}
              size="large"
            />
            {this.props.state == 'online' && (
              <Badge
                status="success"
                badgeStyle={{ width: 18, height: 18, borderRadius: 40 }}
                containerStyle={{ position: 'absolute', bottom: 2, right: 2 }}
              />)}
          </View>
        }
        chevron={{ 
          color: '#666', 
          size: 28,
          style: {
            margin: 0
          },
          ...Platform.select({
            ios: {
                marginRight: 10
            }
          })
        }}
        title={this._renderNameAge(this.props.firstName, getAge(this.props.birthday), this.props.distance, this.props.last_changed)}
        rightIcon={(
          /// OVDJE STAVITI BROJ BODOVA
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#888' }}>200</Text>
          <Text style={{ fontSize: 16, color: '#888' }}> pts</Text>
          </View>
        )}
        onPress={() => {
          currentUser ?
            this.props.navigation.navigate('Chat', {
              userId: currentUser.uid,
              otherUserId: this.props.doc.id,
              avatarUrl: this.props.avatarUrl,
              state: this.props.state,
              last_changed: this.props.last_changed
            }) :
            this.toggleModal()
        }}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 40,
    padding: 4,
    marginTop: 4,
    marginBottom: 4,
    marginStart: 8,
    marginEnd: 8,
    elevation: 5
  },
  avatar: {
    borderRadius: 20
  },
  firstName: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold'
  },
  age: {
    alignSelf: 'center',
    marginStart: 5,
    fontSize: 18,
    color: '#888',
  },
  userInfo: {
    fontSize: 14,
  }
});

export default withNavigation(PlayerCard);