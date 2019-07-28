import React, { Component } from "react";
import { View, StyleSheet, Image, Text } from 'react-native';
import { ListItem, Avatar, Badge, Icon } from 'react-native-elements';
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
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Icon size={16} name="near-me" color="#666" />
      <Text style={ styles.userInfo }> { distance } km</Text>
      </View>
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
        title={this._renderNameAge(this.props.firstName, getAge(this.props.birthday), this.props.distance, this.props.last_changed)}
        rightIcon={(
          <View style={{ flexDirection: 'row', alignItems: 'center', marginEnd: 16 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#888', marginEnd: 8 }}>200</Text>
          <Image style={{ width: 20, height: 20 }} source={require('../images/ball.png')} />
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
    color: '#888'
  }
});

export default withNavigation(PlayerCard);