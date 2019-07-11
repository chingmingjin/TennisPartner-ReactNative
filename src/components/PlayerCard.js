import React, { Component } from "react";
import { Image, View, StyleSheet, Platform, Text } from 'react-native';
import { ListItem } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';
import { getAge } from '../utils/age';

import { withNavigation } from 'react-navigation';

class PlayerCard extends Component {
  constructor(props) {
    super(props);
  }

  _renderNameAge = (name, age, distance, state, last_changed) => {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
      <View style={{ flexDirection: 'row' }}>
        <Text style={ styles.firstName }>{name}</Text>
        <Text style={ styles.age }>{age}</Text>
      </View>
      <Text>{ distance } km away</Text>
      </View>
    );
  }

  render() {

    return (
      <ListItem
        Component={TouchableScale}
        containerStyle={ styles.container }
        friction={90} //
        tension={100} // These props are passed to the parent component (here TouchableScale)
        activeScale={0.95} //
        leftAvatar={{ 
          avatarStyle: styles.avatar, 
          showEditButton: (this.props.state=='online') ? true : false, 
          editButton: { name: 'tennis', type: 'material-community', color: '#2f9c2f', containerStyle: { borderRadius: 40, backgroundColor: '#EEFFFFFF'} },
          rounded: true, 
          size: 'large', 
          title: this.props.firstName[0], 
          source: { uri: this.props.avatarUrl } 
        }}
        title={this._renderNameAge(this.props.firstName, getAge(this.props.birthday), this.props.distance, this.props.state, this.props.last_changed)}
        chevron={{ 
          color: '#666', 
          size: 30,
          ...Platform.select({
            ios: {
                marginRight: 10
            },
        })
        }}
        onPress={() => this.props.navigation.navigate('UserDetails', {userId: this.props.doc.id})}
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
    fontSize: 22,
    color: 'black',
    fontWeight: 'bold'
  },
  age: {
    alignSelf: 'center',
    marginStart: 5,
    fontSize: 20,
    color: '#888',
  }
});

export default withNavigation(PlayerCard);