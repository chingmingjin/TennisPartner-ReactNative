import React, { Component } from "react";
import { Card, CardItem, Body, Text } from 'native-base';

import { withNavigation } from 'react-navigation';


class PlayerCard extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
    <Card>
        <CardItem>
          <Body>
            <Text>
               {this.props.firstName}
            </Text>
            <Text>
               {this.props.lastName}
            </Text>
          </Body>
        </CardItem>
      </Card>
    );
  }
}
export default withNavigation(PlayerCard);