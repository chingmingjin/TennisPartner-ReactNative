import React, { Component } from "react";
import { Share, View, FlatList, Image, StyleSheet, Platform, TouchableHighlight } from "react-native";
import { Left, Icon, Text, ListItem } from 'native-base';
import { withNavigation } from "react-navigation";
import { Avatar } from 'react-native-elements';
import color from 'color'
import {
  sbDisconnect
} from '../sendbirdActions';

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
      if (user && user.displayName) {
        this.setState({ user: user });
      } else {
        this.setState({
          user: null,
        });
      }
    });
    this.unsubscribeUserChange = firebase.auth().onUserChanged((userInfo) => {
      if (userInfo && userInfo.displayName) {
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
    if (this.unsubscribeUserChange) this.unsubscribeUserChange();

 }

 link(item) {
  const { user } = this.state;
  if(item == 'Invite friends') Share.share({
    message: 'Get new Tennis Partner app!',
    url: 'https://tennispartner.app/get'
  },{
    dialogTitle: 'Invite via…'
  });
  if(item == 'Logout') if(user) {
    var uid = firebase.auth().currentUser.uid;
    var userStatusDatabaseRef = firebase.database().ref('/status/' + uid);
    var isOfflineForDatabase = {
      state: 'offline',
      last_changed: firebase.database.ServerValue.TIMESTAMP,
    };
    userStatusDatabaseRef.set(isOfflineForDatabase);
    firebase.auth().signOut();
    sbDisconnect();
  }
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
        backgroundColor: color('#ffa737').lighten(0.05).hex(),
        paddingTop: 20,
        paddingBottom: 20,
        alignItems: 'center'
      },
      profileImg: {
        height: 150,
        width: 150,
        borderRadius: 40,
      },
      userName: {
        fontSize: 24,
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
console.log(user)
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
              <Avatar
                source={{ uri: user.photoURL }}
                size='xlarge'
                rounded
                showEditButton={true}
                editButton={{ name: 'mode-edit', type: 'material', size: 40, color: '#fff', underlayColor: '#000' }}
                title={user.displayName.charAt(0)}
              />
              <Text style={styles.userName}>{user.displayName}</Text>
            </View>
          </TouchableHighlight>
        )}
          <FlatList
            data={[
              { key: 'Invite friends', icon: 'share-alt' },
              { key: 'About', icon: 'info-circle' },
              user ? { key: 'Logout', icon: 'sign-out-alt' } : {}
            ]}
            renderItem={({ item }) =>
            <ListItem button noBorder onPress={() => this.link(item.key)}>
            <Left>
              <Icon active type='FontAwesome5' name={item.icon} style={{ color: "#888", fontSize: 22, width: 30 }} />
              <Text style={styles.text}>{item.key}</Text>
            </Left>
            </ListItem>}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
    );
  }
}

export default withNavigation(UserSettings);