import React, { Component } from "react";
import { Image, View, StyleSheet, TouchableHighlight, Text } from 'react-native';
import { ListItem } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';
import LinearGradient from 'react-native-linear-gradient';

import { withNavigation } from 'react-navigation';

function getAge(dateString) {
  var today = new Date();
  var birthDate = new Date(dateString);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
  }
  return age;
}

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
          colors: ['#eaeaea', '#fff'],
          start: { x: 0.8, y: 0 },
          end: { x: 0.07, y: 0 },
        }}
        ViewComponent={LinearGradient} // Only if no expo
        leftAvatar={{ avatarStyle: styles.avatar, rounded: true, size: 'large', title: this.props.firstName[0], source: { uri: this.props.avatarUrl } }}
        title={this._renderNameAge(this.props.firstName, getAge(this.props.birthday))}
        chevron={{ color: '#666', size: 30 }}
        onPress={() => this.props.navigation.navigate('UserDetails', {userId: this.props.doc.id})}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 8,
    marginTop: 10,
    marginStart: 8,
    marginEnd: 8,
   
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