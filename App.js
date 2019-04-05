import React, { Component } from 'react';
import { Alert, StyleSheet, StatusBar, View } from 'react-native';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text } from 'native-base';
export default class AnatomyExample extends Component {
  render() {
    return (
      <Container>
       <View>
          <StatusBar backgroundColor="#004ba0" />
       </View>
        <Header style={styles.header}>
          <Left>
            <Button transparent>
              <Icon name='menu' />
            </Button>
          </Left>
          <Body>
            <Title>Tennis Partner</Title>
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
    );
  }
}

const styles = StyleSheet.create({
  header: {
   backgroundColor: '#1976d2'
  }
});