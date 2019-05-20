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

import HomeScreen from "./screens/home/";
import UserSettingsiOS from "./screens/userSettingsiOS";
import UserDetailsScreen from "./screens/userDetails";
import LoginScreen from "./screens/login/";

const AppNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    UserSettings: UserSettingsiOS,
    Login: LoginScreen,
    UserDetails: UserDetailsScreen,
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
    console.log('app is launched');
    AppState.addEventListener("change", this._handleAppStateChange);
  }
  componentWillUnmount() {
    console.log('app is killed');
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