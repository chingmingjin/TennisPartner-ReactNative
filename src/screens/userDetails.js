import React, { Component } from "react";
import { View, Dimensions, StyleSheet, Platform } from "react-native";
import { withNavigation, Header } from "react-navigation";
import { Card, CardItem, Body, Text, Icon, Button, Toast } from 'native-base';
import ActionButton from 'react-native-action-button';

import color from "color";
import * as Progress from 'react-native-progress';
import ButtonBack from '../components/ButtonBack';
import ReactNativeParallaxHeader from 'react-native-parallax-header';
import Modal from "react-native-modal";

import firebase from 'react-native-firebase';

const {
  height: SCREEN_HEIGHT,
} = Dimensions.get('window');

const IS_IPHONE_X = SCREEN_HEIGHT === 812 || SCREEN_HEIGHT === 896;
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 44 : 20) : 0;
const HEADER_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 88 : 64) : 64;
const NAV_BAR_HEIGHT = HEADER_HEIGHT - STATUS_BAR_HEIGHT;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  navContainer: {
    height: HEADER_HEIGHT,
    marginHorizontal: 10,
  },
  statusBar: {
    height: STATUS_BAR_HEIGHT,
    backgroundColor: 'transparent',
  },
  navBar: {
    height: NAV_BAR_HEIGHT,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  titleStyle: {
    color: 'white',
    fontSize: 36,
  },
  headerTitle: {
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    paddingLeft: 20,
    paddingBottom: 15
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
    paddingBottom: IS_IPHONE_X ? 35 : 0
  },
  modalContent: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
});

class UserDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      player: null,
      isModalVisible: false
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
        this.setState({ userId: snapshot.id, firstName: firstName, lastName: lastName, avatarUrl: avatarUrl });
    });
  }

  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  renderNavBar = () => (
    <View style={styles.navContainer}>
      <View style={styles.statusBar} />
      <View style={styles.navBar}>
        <ButtonBack />
      </View>
    </View>
  )

  renderContent = () => (
    <View style={{ flex: 1 }}>
      <Card>
        <CardItem header bordered>
          <Text style={{ color: '#999' }}>INFO</Text>
        </CardItem>
        <CardItem bordered>
          <Body>
            <Text>
              NativeBase is a free and open source framework that enable
              developers to build
              high-quality mobile apps using React Native iOS and Android
              apps
              with a fusion of ES6.
                </Text>
          </Body>
        </CardItem>
      </Card>
    </View>
  )

  render() {
    const { userId, firstName, lastName, avatarUrl } = this.state;
    const currentUser = firebase.auth().currentUser;

    if(!firstName || !lastName)
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Progress.Circle style={ styles.progressCircle } color="#ffa737" size={50} borderWidth={4} indeterminate={true} />
        </View>
      )
   else 
    return (
      <View style={styles.container}>
      <ReactNativeParallaxHeader
        headerMinHeight={HEADER_HEIGHT}
        headerMaxHeight={300}
        extraScrollHeight={20}
        navbarColor="#1976d2"
        statusBarColor={color('#1976d2').darken(0.2).hex()}
        title={ firstName + ' ' + lastName }
        titleStyle={styles.titleStyle}
        headerTitleStyle={styles.headerTitle}
        backgroundImage={{ uri: avatarUrl }}
        backgroundImageScale={1.2}
        renderNavBar={this.renderNavBar}
        renderContent={this.renderContent}
        containerStyle={styles.container}
        contentContainerStyle={styles.contentContainer}
        innerContainerStyle={styles.container}
      />
      {(!currentUser || (currentUser !== null && userId !== currentUser.uid)) && (
        <ActionButton
          buttonColor="#ffa737"
          size={64}
          renderIcon={() => (<Icon style={{ color: '#fff', fontSize: 34 }} name='chatboxes' /> )}
          onPress={() => {
            currentUser ?
            this.props.navigation.navigate('Chat', { userId: currentUser.uid, otherUserId: userId }) :
            this.toggleModal()
          }}
        />
      )}
        <Modal
          isVisible={this.state.isModalVisible}
          onBackdropPress={() => this.setState({ isModalVisible: false })}
          backdropTransitionOutTiming={0}
          style={ styles.bottomModal }>
            <View style={ styles.modalContent }>
            <Icon style={{ paddingTop: 20, fontSize: 30 }} type="FontAwesome5" name="user-edit" />
            <Text style={{ padding: 20, fontSize: 20 }}>You need to sign in to continue</Text>
            <Button full warning onPress={() => {
              this.toggleModal();
              this.props.navigation.navigate('Login')
              }}>
              <Text>Sign In</Text>
            </Button>
            </View>
        </Modal>
    </View>
    );
  }
}

export default withNavigation(UserDetails);