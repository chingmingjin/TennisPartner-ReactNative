import React, { Component } from 'react';
import { Alert, Platform } from 'react-native';

import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, StyleProvider } from 'native-base';

import PlayersList from '../components/PlayersList';
import CourtList from '../components/CourtList';

import firebase from 'react-native-firebase';

import getTheme from '../native-base-theme/components';
import commonColor from '../native-base-theme/variables/commonColor';
import { withNavigation } from 'react-navigation';

class HomeContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabPlayers: true,
      tabCourts: false
    };

    }

    toggleTabPlayers() {
      this.setState({
        tabPlayers: true,
        tabCourts: false
      });
    }
    toggleTabCourts() {
      this.setState({
        tabPlayers: false,
        tabCourts: true
      });
    }

    render() {
      const { tabPlayers, tabCourts } = this.state;
      const ButtonLeft = Platform.select({
        ios: () => {return(<Button transparent onPress={() => this.props.navigation.navigate('UserSettings')}><Icon style={{fontSize: 24}} type='FontAwesome5' name='user-cog' /></Button>)},
        android: () => {return(<Button transparent onPress={this.props.openDrawer}><Icon name='menu' /></Button>)},
      });
      return (
        <StyleProvider style={getTheme(commonColor)}>
        <Container>
          <Header>
            <Left>
              <ButtonLeft />
            </Left>
            <Body>
              <Title style={{ color: "white" }}>{ this.props.title }</Title>
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
          {tabPlayers && (<PlayersList />) }
          {tabCourts && (<CourtList />) }
          <Footer>
            <FooterTab>
              <Button vertical active={this.state.tabPlayers} onPress={() => this.toggleTabPlayers()}>
              <Icon type="FontAwesome" name="users" />
                <Text>Players</Text>
              </Button>
              <Button vertical active={this.state.tabCourts} onPress={() => this.toggleTabCourts()}>
              <Icon type="MaterialCommunityIcons" name="tennis" />
                <Text>Courts</Text>
              </Button>
            </FooterTab>
          </Footer> 
          </Container>
          </StyleProvider>
        );
    }
}
export default withNavigation(HomeContainer);