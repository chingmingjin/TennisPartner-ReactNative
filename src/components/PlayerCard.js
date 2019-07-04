import React, { Component } from "react";
import { Image, View, StyleSheet, Platform, Text } from 'react-native';
import { ListItem } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';
import LinearGradient from 'react-native-linear-gradient';
import { getAge } from '../sendbirdActions/user';

import { withNavigation } from 'react-navigation';

class PlayerCard extends Component {
  constructor(props) {
    super(props);
  }

  _renderNameAge = (name, age) => {
    return (
      <View style={{ flexDirection: 'row' }}>
        <Text style={ styles.firstName }>{name}</Text>
        <Text style={ styles.age }>{age}</Text>
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
        linearGradientProps={{
          colors: ['#ffebd1', '#fff'],
          start: { x: 0.9, y: 0 },
          end: { x: 0.3, y: 0 },
        }}
        ViewComponent={LinearGradient} // Only if no expo
        leftAvatar={{ avatarStyle: styles.avatar, rounded: true, size: 'large', title: this.props.firstName[0], source: { uri: this.props.avatarUrl } }}
        title={this._renderNameAge(this.props.firstName, getAge(this.props.birthday))}
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