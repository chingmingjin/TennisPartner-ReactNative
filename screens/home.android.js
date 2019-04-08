import React, { Component } from 'react';
import { DrawerLayoutAndroid, View, Image, StyleSheet, List, ListItem, Left } from 'react-native';
import { Text } from 'native-base';

import HomeContainer from "./homeContainer/";

const datas = [
  {
    name: "Invite friends",
    route: "Anatomy",
    icon: "phone-portrait",
    bg: "#C5F442"
  },
  {
    name: "About",
    route: "Header",
    icon: "arrow-up",
    bg: "#477EEA",
    types: "11"
  },
  {
    name: "Logout",
    route: "Footer",
    icon: "arrow-down",
    bg: "#DA4437",
    types: "4"
  },
];

export default class HomeScreen extends Component {
    constructor(props) {
      super(props);
          this.openDrawer = this.openDrawer.bind(this);
      }
      openDrawer() {
        this.refs["drawer"].openDrawer();
      }
    render() {
      const styles = StyleSheet.create({
        navigationView: {
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'stretch',
        },
        header: {
          backgroundColor: '#ffa737',
          paddingTop: 20,
          paddingBottom: 20,
          alignItems: 'center'
        },
        profileImg: {
          height: 100,
          width: 100,
          borderRadius: 40,
        },
        userName: {
          fontSize: 24,
          color: 'white',
          paddingTop: 8
        },
      });
      var navigationView = (
        <View style={styles.navigationView}>
          <View style={styles.header}>
            <Image source={require('../images/user.png')} style={styles.profileImg} />
            <Text style={styles.userName}>Sign in</Text>
          </View>
          <List
            dataArray={datas}
            renderRow={data =>
              <ListItem
                button
                noBorder
                onPress={() => this.props.navigation.navigate(data.route)}
              >
                <Left>
                  <Icon
                    active
                    name={data.icon}
                    style={{ color: "#777", fontSize: 26, width: 30 }}
                  />
                  <Text style={styles.text}>
                    {data.name}
                  </Text>
                </Left>
              </ListItem>}
          />
        </View>
      );
      return (
        <DrawerLayoutAndroid
          ref="drawer"
          drawerWidth={250}
          drawerPosition={DrawerLayoutAndroid.positions.Left}
          renderNavigationView={() => navigationView}>
          <HomeContainer openDrawer={this.openDrawer} />
          </DrawerLayoutAndroid>
      );
    }
  }