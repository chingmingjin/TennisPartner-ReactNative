import React, { Component } from "react";
import { Image, View, StyleSheet, TouchableHighlight } from 'react-native';
import { Card, CardItem, Body, Text } from 'native-base';

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
  render() {
    const styles = StyleSheet.create({
      avatar: {
        width: 80, 
        height: 80, 
        borderRadius: 40
      },
      firstName: {
        fontSize: 24,
        marginStart: 10
      },
      birthDate: {
        fontSize: 20,
        color: '#999',
        marginStart: 5
      }
    });
    return (
    <TouchableHighlight style={{ borderRadius: 8 }} onPress={() => this.props.navigation.navigate('UserDetails', {userId: this.props.doc.id}) }>
    <Card borderRadius={8}>
        <CardItem>
          <Body>
          <View style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Image source={{uri: this.props.avatarUrl}}
            style={styles.avatar} />
            <Text style={styles.firstName}>{this.props.firstName}</Text>
            <Text style={styles.birthDate}>{getAge(this.props.birthday)}</Text>
          </View>
          </Body>
        </CardItem>
      </Card>
      </TouchableHighlight>
    );
  }
}
export default withNavigation(PlayerCard);