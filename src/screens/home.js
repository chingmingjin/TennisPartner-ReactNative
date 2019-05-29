import React, { Component } from 'react';
import { Alert, Platform } from 'react-native';

import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, StyleProvider } from 'native-base';

import PlayersList from '../components/PlayersList';
import CourtList from '../components/CourtList';
import Settings from './userSettings';
import ButtonLeft from '../components/ButtonLeft';

import getTheme from '../../native-base-theme/components';
import commonColor from '../../native-base-theme/variables/commonColor';
import { withNavigation } from 'react-navigation';

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabPlayers: true,
      tabCourts: false,
      tabSettings: false
    };
    }

    toggleTabPlayers() {
      this.setState({
        tabPlayers: true,
        tabCourts: false,
        tabSettings: false
      });
    }
    toggleTabCourts() {
      this.setState({
        tabPlayers: false,
        tabCourts: true,
        tabSettings: false
      });
    }
    toggleTabSettings() {
      this.setState({
        tabPlayers: false,
        tabCourts: false,
        tabSettings: true,
      });
    }

    render() {
      const { tabPlayers, tabCourts, tabSettings } = this.state;
      
      return (
        <StyleProvider style={getTheme(commonColor)}>
        <Container>
          <Header>
            <Body>
              <Title style={{ color: "white" }}>Players nearby</Title>
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
          {tabSettings && (<Settings />) }
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
              <Button vertical active={this.state.tabSettings} onPress={() => this.toggleTabSettings()}>
              <Icon name="cog" />
                <Text>Settings</Text>
              </Button>
            </FooterTab>
          </Footer> 
          </Container>
          </StyleProvider>
        );
    }
}
export default withNavigation(HomeScreen);