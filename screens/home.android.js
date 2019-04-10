import React, { Component } from 'react';
import { DrawerLayoutAndroid } from 'react-native';

import HomeContainer from "./homeContainer/";
import UserSettings from "./userSettings";

export default class HomeScreen extends Component {
    constructor(props) {
      super(props);
          this.openDrawer = this.openDrawer.bind(this);
      }
      openDrawer() {
        this.refs["drawer"].openDrawer();
      }
    render() {
      var navigationView = (
        <UserSettings />
      );
      return (
        <DrawerLayoutAndroid
          ref="drawer"
          drawerWidth={225}
          drawerPosition={DrawerLayoutAndroid.positions.Left}
          renderNavigationView={() => navigationView}>
            <HomeContainer title="Players" openDrawer={this.openDrawer} />
          </DrawerLayoutAndroid>
      );
    }
  }