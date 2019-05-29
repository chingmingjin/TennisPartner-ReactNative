import React, { Component } from 'react';
import { View, Platform } from 'react-native';

import { Footer, FooterTab, Button, Icon, Text } from 'native-base';
import { Header } from 'react-native-elements';

import color from "color";
import PlayersList from '../components/PlayersList';
import CourtList from '../components/CourtList';
import Settings from './userSettings';

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
        <View style={{ flex: 1 }}>
            <Header
              statusBarProps={{ 
                barStyle: 'light-content', 
                backgroundColor: color("#1976d2").darken(0.2).hex() 
              }}
              containerStyle={{ 
                height: 64,
                backgroundColor: "#1976d2",
                ...Platform.select({
                  android: {
                      height: 56,
                      paddingTop: -10
                  },
                  ios: {
                      minHeight: 70
                  },
              })
              }}
              placement="left"
              leftComponent={{ text: 'Players nearby', style: { color: '#fff', fontSize: 18 } }}
              rightComponent={{ icon: 'search', color: '#fff' }}
            />
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
          </View>
        );
    }
}
export default HomeScreen;