import React, { Component } from 'react';
import { Linking, Text } from 'react-native';

export default class Link extends Component {
    constructor(props) {
      super(props);
    }
    render() {
      return (
        <Text style={{ textDecorationLine: 'underline', color: '#ffa737' }} 
              onPress={() => Linking.openURL(this.props.url)}>{this.props.children}</Text>
      );
    }
  }