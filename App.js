import React, { Component } from 'react';

import { createDrawerNavigator, createStackNavigator, createAppContainer } from "react-navigation";
import Home from "./screens/home/";
import SideBar from "./screens/sidebar";



const Drawer = createDrawerNavigator(
  {
    Home: { screen: Home },
  },
  {
    initialRouteName: "Home",
    contentComponent: props => <SideBar {...props} />
  }
);

const AppNavigator = createStackNavigator(
  {
    Drawer: { screen: Drawer },
  },
  {
    initialRouteName: "Drawer",
    headerMode: "none"
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default AppContainer;