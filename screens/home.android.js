import React, { Component } from 'react';
import { DrawerLayoutAndroid, View, Image, StyleSheet } from 'react-native';
import { Text } from 'native-base';

import HomeContainer from "./homeContainer/";


export default class HomeScreen extends Component {
    render() {
      const styles = StyleSheet.create({
        navigationView: {
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
        },
        profileImg: {
          height: 100,
          width: 100,
          borderRadius: 40,
        },
      });
      var navigationView = (
        <View style={styles.navigationView}>
          <Image source={require('../images/user.png')} style={styles.profileImg} />
          <Text>Ivan Grubišić</Text>
        </View>
      );
      return (
        <DrawerLayoutAndroid
          ref="drawer"
          drawerWidth={250}
          drawerPosition={DrawerLayoutAndroid.positions.Left}
          renderNavigationView={() => navigationView}>
          <HomeContainer />
          </DrawerLayoutAndroid>
      );
    }
  }