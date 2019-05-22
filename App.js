import React, { Component } from "react";
import {
  Platform,
  AppState,
  PushNotificationIOS
} from "react-native";
import { Root } from 'native-base';

import { createStackNavigator, createAppContainer } from "react-navigation";
import { Provider } from "react-redux";
import store from "./src/store";
import SendBird from 'sendbird';
import firebase from 'react-native-firebase';

import HomeScreen from "./src/screens/home";
import UserSettingsiOS from "./src/screens/userSettingsiOS";
import UserDetailsScreen from "./src/screens/userDetails";
import LoginScreen from "./src/screens/login";
import StartChat from "./src/screens/startchat"

const AppNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    UserSettings: UserSettingsiOS,
    Login: LoginScreen,
    UserDetails: UserDetailsScreen,
    StartChat: StartChat
  },
  {
    initialRouteName: "Home",
    headerMode: "none"
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default class App extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    const channel = new firebase.notifications.Android.Channel(
      'app.tennispartner',
      'Tennis Partner',
      firebase.notifications.Android.Importance.Max
    );
    firebase.notifications().android.createChannel(channel);

    console.disableYellowBox = true;
    AppState.addEventListener("change", this._handleAppStateChange);
  }
  componentWillUnmount() {
    AppState.removeEventListener("change", this._handleAppStateChange);
  }
  render() {
    return (
      <Provider store={store}>
        <Root>
          <AppContainer />
        </Root>
      </Provider>
    );
  }

  _handleAppStateChange = (nextAppState) => {
    const sb = SendBird.getInstance();
    if (sb) {
      if (nextAppState === 'active') {
        if(Platform.OS === 'ios') {
          PushNotificationIOS.setApplicationIconBadgeNumber(0);
        }
        console.log('app is into foreground');
        sb.setForegroundState();
      } else if (nextAppState === 'background') {
        console.log('app is into background');
        sb.setBackgroundState();
      }
    }
  }
}