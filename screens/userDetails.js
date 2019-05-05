import React, { Component } from "react";
import { Share, View, Text, SectionList, Image, StyleSheet, Platform, TouchableHighlight } from "react-native";
import { withNavigation } from "react-navigation";
import { Header } from 'react-navigation';

import HeaderImageScrollView, { TriggeringView } from 'react-native-image-header-scroll-view';

import firebase from 'react-native-firebase';

class UserDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      player: null
    };
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

    const userId = this.props.navigation.getParam('userId', null);
    this.getUser(userId);
  }
  componentWillUnmount() {
    if (this.unsubscribe) this.unsubscribe();
  }

  getUser = (userId) => {
    firebase.firestore().collection('players').doc(userId).get().then((snapshot) => {
        const{ avatarUrl, firstName, lastName } = snapshot.data();
        this.setState({ firstName: firstName, lastName: lastName, avatarUrl: avatarUrl });
    });
  }

  render() {
    const styles = StyleSheet.create({
      playerView: {
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
      },
      userName: {
        fontSize: 25,
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

    const { user, firstName, lastName, avatarUrl } = this.state;

    return (
        <View style={{ flex: 1 }}>
            <HeaderImageScrollView
                maxHeight={300}
                minHeight={Header.HEIGHT}
                minOverlayOpacity={0.1}
                headerImage={{ uri: avatarUrl }}
                foregroundExtrapolate={null}
                renderForeground={() => (
                    <View style={{ height: 300, justifyContent: 'flex-end', alignItems: 'flex-start' }} >
                        <Text style={{ paddingLeft: 15, paddingBottom: 20, backgroundColor: "transparent", fontSize: 36, color: '#FFF' }}>{firstName + ' ' + lastName}</Text>
                    </View>
                )}
            >
                <View style={{ height: 1000 }}>
                    <TriggeringView>
                        <Text>Scroll Me!</Text>
                    </TriggeringView>
                </View>
            </HeaderImageScrollView>
        </View>
          );
  }
}

export default withNavigation(UserDetails);