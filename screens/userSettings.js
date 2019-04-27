import React, { Component } from "react";
import { Share, View, SectionList, Image, StyleSheet, Platform, TouchableHighlight } from "react-native";
import { Left, Icon, Text, ListItem } from 'native-base';
import { withNavigation } from "react-navigation";

import firebase from 'react-native-firebase';

class UserSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null
    };
    this.link = this.link.bind(this);
  }

  componentDidMount() {
    this.unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user: user });
      } else {
        this.setState({
          user: null,
        });
      }
    });
    this.unsubscribeUserChange = firebase.auth().onUserChanged((userInfo) => {
      if (userInfo) {
        this.setState({ user: userInfo });
      } else {
        this.setState({
          user: null,
        });
      }
    });
  }
  componentWillUnmount() {
    if (this.unsubscribe) this.unsubscribe();
    if (this.unsubscribeUserChange) this.unsubscribe();

 }

 link(item) {
  const { user } = this.state;
  if(item == 'Invite friends') Share.share({
    message: 'Get new Tennis Partner app!\nhttps://tennispartner.app/get',
    url: 'https://tennispartner.app/get'
  },{
    dialogTitle: 'Invite via…'
  });
  if(item == 'Logout') if(user) firebase.auth().signOut();
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
        height: 90,
        width: 90,
        borderRadius: 40,
      },
      userName: {
        fontSize: 22,
        color: 'white',
        paddingTop: 8
      },
      sectionHeader: {
        paddingTop: 2,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 2,
        fontSize: 14,
        fontWeight: 'bold',
        backgroundColor: 'rgba(247,247,247,1.0)',
      },
      text: {
        fontWeight: Platform.OS === "ios" ? "500" : "400",
        fontSize: 16,
        marginLeft: 20
      },
    });

    const { user } = this.state;

    const userMenu = user ? {title: 'User', data: ['My Games', 'Logout'], icon: ['baseball-ball', 'sign-out-alt']} : {data: []};

    return (
        <View style={styles.navigationView}>
        {!user && (
        <TouchableHighlight onPress={() => this.props.navigation.navigate('Login')}>
          <View style={styles.header}>
              <Image source={require('../images/user.png')} style={styles.profileImg} />
            <Text style={styles.userName}>Sign in</Text>
          </View>
        </TouchableHighlight>
        )}
        {user && (
        <TouchableHighlight>
          <View style={styles.header}>
              <Image source={{uri: user.photoURL}} style={styles.profileImg} />
            <Text style={styles.userName}>{ user.displayName }</Text>
          </View>
        </TouchableHighlight>
        )}
          <SectionList
            sections={[
              {data: ['Invite friends', 'About'], icon: ['share-alt', 'info-circle']},
              userMenu
            ]}
            renderItem={({item, index, section }) =>
            <ListItem button noBorder onPress={() => this.link(item)}>
            <Left>
              <Icon active type='FontAwesome5' name={section.icon[index]} style={{ color: "#888", fontSize: 22, width: 30 }} />
              <Text style={styles.text}>{item}</Text>
            </Left>
            </ListItem>}
            renderSectionHeader={({section}) => section.title ? <Text style={styles.sectionHeader}>{section.title}</Text> : (null)}
            keyExtractor={(item, index) => index}
          />
        </View>
    );
  }
}

export default withNavigation(UserSettings);