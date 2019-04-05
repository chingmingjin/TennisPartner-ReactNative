import React, { Component } from 'react';
import { Alert } from 'react-native';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, StyleProvider } from 'native-base';

import getTheme from './native-base-theme/components';
import commonColor from './native-base-theme/variables/commonColor';

export default class AnatomyExample extends Component {
  render() {
    return (
      <StyleProvider style={getTheme(commonColor)}>
      <Container>
        <Header>
          <Left>
            <Button transparent>
              <Icon name='menu' />
            </Button>
          </Left>
          <Body>
            <Title style={{ color: "white" }}>Tennis Partner</Title>
          </Body>
          <Right>
          <Button transparent 
          onPress={() => {
             Alert.alert('You tapped the button!');
          }}>
              <Icon name='search' />
            </Button>
          </Right>
        </Header>
        <Content>
          <Text>
            This is Content Section
          </Text>
        </Content>
        <Footer>
          <FooterTab>
            <Button full>
              <Text>Footer</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
      </StyleProvider>
    );
  }
}