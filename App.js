import React from "react";
import { Root } from 'native-base';

import { createStackNavigator, createAppContainer } from "react-navigation";

import HomeScreen from "./screens/home/";
import UserSettingsiOS from "./screens/userSettingsiOS";
import LoginScreen from "./screens/login/";

const AppNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    UserSettings: UserSettingsiOS,
    Login: LoginScreen,
  },
  {
    initialRouteName: "Home",
    headerMode: "none"
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default () =>
  <Root>
    <AppContainer />
  </Root>;