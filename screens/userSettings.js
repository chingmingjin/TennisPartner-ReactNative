import React, { Component } from "react";
import { Alert, View, SectionList, Image, StyleSheet, Platform, TouchableHighlight } from "react-native";
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
    this.unsubscribe = firebase.auth().onAuthStateChanged((userInfo) => {
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
 }

 link(item) {
  if(item == 'Logout') firebase.auth().signOut();
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

    return (
        <View style={styles.navigationView}>
        {!user && (
          <View style={styles.header}>
            <TouchableHighlight style={{ borderRadius: 40 }} onPress={() => this.props.navigation.navigate('Login')}>
              <Image source={require('../images/user.png')} style={styles.profileImg} />
            </TouchableHighlight>
            <Text style={styles.userName}>Sign in</Text>
          </View>
        )}
        {user && (
          <View style={styles.header}>
            <TouchableHighlight style={{ borderRadius: 40 }}>
              <Image source={user.photoURL} style={styles.profileImg} />
            </TouchableHighlight>
            <Text style={styles.userName}>{ user.displayName }</Text>
          </View>
        )}
          <SectionList
            sections={[
              {data: ['Invite friends', 'About'], icon: ['share-alt', 'info-circle']},
              {title: 'User', data: ['My Games', 'Logout'], icon: ['baseball-ball', 'sign-out-alt']}
            ]}
            renderItem={({item, index, section }) =>
            <ListItem button noBorder onPress={() => this.link(item)}>
            <Left>
              <Icon active type='FontAwesome5' name={section.icon[index]} style={{ color: "#888", fontSize: 22, width: 30 }} />
              <Text style={styles.text}>{item}</Text>
            </Left>
            </ListItem>}
            renderSectionHeader={({section}) => <Text style={styles.sectionHeader}>{section.title}</Text>}
            keyExtractor={(item, index) => index}
          />
        </View>
    );
  }
}

export default withNavigation(UserSettings);