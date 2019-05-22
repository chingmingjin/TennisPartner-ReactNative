import React, { Component } from "react";
import { Alert } from "react-native";
import { Container, Header, Title, Content, Button, Left, Right, Body, Icon, Text, StyleProvider } from 'native-base';

import getTheme from '../../native-base-theme/components';
import commonColor from '../../native-base-theme/variables/commonColor';

import UserSettings from './userSettings';

export default class UserSettingsiOS extends Component {
  render() {
    return (
      <StyleProvider style={getTheme(commonColor)}>
        <Container>
          <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
            <Icon name='arrow-back' />
            <Text>Back</Text>
            </Button>
            </Left>
            <Body>
              <Title style={{ color: "white" }}>Settings</Title>
            </Body>
            <Right />
          </Header>
          <Content>
          <UserSettings />
          </Content>
          </Container>
          </StyleProvider>
    );
  }
}