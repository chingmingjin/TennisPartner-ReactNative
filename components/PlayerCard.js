import React, { Component } from "react";
import { Image } from 'react-native';
import { Card, CardItem, Body, Text } from 'native-base';

import { withNavigation } from 'react-navigation';


class PlayerCard extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
    <Card borderRadius={8}>
        <CardItem>
          <Body>
          <Image source={{uri: this.props.avatarUrl}}
          style={{width: 80, height: 80, borderRadius: 40}} />
          </Body>
        </CardItem>
      </Card>
    );
  }
}
export default withNavigation(PlayerCard);