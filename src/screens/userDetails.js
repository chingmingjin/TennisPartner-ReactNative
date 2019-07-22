import React, { Component } from "react";
import { View, Dimensions, StyleSheet, Platform, StatusBar } from "react-native";
import { withNavigation } from "react-navigation";
import { Card, CardItem, Body, Text, Button, Icon as NBIcon } from 'native-base';
import { Icon, Badge, Button as PlayButton } from 'react-native-elements';
import color from "color";
import * as Progress from 'react-native-progress';
import ButtonBack from '../components/ButtonBack';
import ReactNativeParallaxHeader from 'react-native-parallax-header';
import Modal from "react-native-modal";
import { getAge } from '../utils/age';
import moment from 'moment';
import { createIconSetFromFontello } from 'react-native-vector-icons';
import fontelloConfig from '../config.json';
import TouchableScale from 'react-native-touchable-scale';

import firebase from 'react-native-firebase';

const {
  height: SCREEN_HEIGHT,
} = Dimensions.get('window');

const IS_IPHONE_X = SCREEN_HEIGHT === 812 || SCREEN_HEIGHT === 896;
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 44 : 20) : 0;
const HEADER_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 88 : 64) : 64;
const NAV_BAR_HEIGHT = HEADER_HEIGHT - STATUS_BAR_HEIGHT;

const TennisIcons = createIconSetFromFontello(fontelloConfig);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  navContainer: {
    height: HEADER_HEIGHT,
  },
  statusBar: {
    height: STATUS_BAR_HEIGHT,
    backgroundColor: 'transparent',
  },
  navBar: {
    height: NAV_BAR_HEIGHT,
    marginTop: IS_IPHONE_X ? 40 : 25
  },
  titleStyle: {
    color: 'white',
    fontSize: 36,
    textShadowColor: 'rgba(0, 0, 0, 0.80)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
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
  info: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginEnd: 20,
    marginStart: 20
  },
  infoTextLabel: {
    textAlign: 'left'
  },
  infoText: {
    textAlign: 'right',
    fontWeight: 'bold'
  },
  playButton: {
    alignSelf: 'flex-end',
    justifyContent: 'space-evenly',
    marginBottom: 20,
    marginEnd: 20,
    borderRadius: 30,
    width: 110,
    height: 60,
    padding: 10,
    backgroundColor: '#1976d2'
  }
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
    this.distance = this.props.navigation.getParam('distance', null);
    this.city = this.props.navigation.getParam('city', null);
    this.country = this.props.navigation.getParam('country', null);
    this.placeId = this.props.navigation.getParam('placeId', null);
    this.countryId = this.props.navigation.getParam('countryId', null);
    this.getUser(userId);
  }
  componentWillUnmount() {
    if (this.unsubscribe) this.unsubscribe();
  }

  getUser = (userId) => {
    firebase.firestore().collection('players').doc(userId).get().then((snapshot) => {
      const { avatarUrl, firstName, birthday, gender, presence } = snapshot.data();
      const cityRating = (snapshot.data().ratings) ? '#' + ratings[this.placeId] : '--';
      const countryRating = (snapshot.data().ratings) ? '#' + ratings[this.countryId] : '--';
      this.setState({
        userId: snapshot.id,
        firstName: firstName,
        avatarUrl: avatarUrl,
        birthday: birthday,
        gender: gender,
        state: presence.state,
        last_changed: moment.unix(presence.last_changed.seconds).fromNow(),
        cityRating: cityRating,
        countryRating: countryRating
      });
    });
  }

  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  renderNavBar = () => (
    <View style={styles.navContainer}>
      <StatusBar backgroundColor='transparent' translucent />
      <View style={styles.navBar}>
        <ButtonBack />
      </View>
    </View>
  )

  renderContent = () => (
    <View style={{ flex: 1 }}>
      <Card>
        <CardItem bordered>
          <Body>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ 
                flex: 1, 
                justifyContent: 'center', 
                alignItems: 'center',
                borderRightWidth: 1,
                borderRightColor: '#CCC'
                 }}>
                <Icon size={43} type='font-awesome' color='#CCC' name='address-card' />
              </View>
              <View style={{ flex: 3, justifyContent: 'center' }}>
                <View style={styles.info}>
                  <Text style={styles.infoTextLabel}>Age</Text>
                  <Text style={styles.infoText}>{getAge(this.state.birthday)}</Text>
                </View>
                <View style={styles.info}>
                  <Text style={styles.infoTextLabel}>Gender</Text>
                  <Text style={styles.infoText}>{this.state.gender}</Text>
                </View> 
                <View style={styles.info}>
                  <Text style={styles.infoTextLabel}>Active</Text>
                  <Text style={styles.infoText}>{this.state.last_changed}</Text>
                </View>
                <View style={styles.info}>
                  <Text style={styles.infoTextLabel}>Distance</Text>
                  <Text style={styles.infoText}>{this.distance} km</Text>
                </View>
              </View>
            </View>
          </Body>
        </CardItem>
      </Card>
      <Card>
        <CardItem>
          <Body>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderRightWidth: 1, borderRightColor: '#CCC'}}>
                <NBIcon type='FontAwesome' name='list-ol' style={{ fontSize: 40, color: '#b0b0b0' }} />
              </View>
              <View style={{ flex: 3, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
              <View>
                <Text>{ this.city }</Text>
                <Text style={{ fontWeight: 'bold', fontSize: 30 }}>{this.state.cityRating}</Text>
              </View>
              <View>
                <Text>{ this.country }</Text>
                <Text style={{ fontWeight: 'bold', fontSize: 30 }}>{this.state.countryRating}</Text>
              </View>
              </View>
            </View>
          </Body>
        </CardItem>
      </Card>
    </View>
  )

  render() {
    const { userId, firstName, avatarUrl, state, last_changed } = this.state;
    const currentUser = firebase.auth().currentUser;

    if (!firstName)
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Progress.Circle style={styles.progressCircle} color="#ffa737" size={50} borderWidth={4} indeterminate={true} />
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
            title={(
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.titleStyle}>{ firstName }</Text>
              {state == 'online' && (
              <Badge
                status="success"
                badgeStyle={{ width: 15, height: 15, borderRadius: 40, marginStart: 10 }}
                //containerStyle={{ position: 'absolute', bottom: 2, right: 2 }}
              />)}
              </View>
            )}
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
            <PlayButton
              TouchableComponent={TouchableScale}
              friction={90} //
              tension={100}
              activeScale={0.97}
              buttonStyle={styles.playButton}
              onPress={() => {
                currentUser ?
                  this.props.navigation.navigate('Chat', {
                    userId: currentUser.uid,
                    otherUserId: userId,
                    avatarUrl: avatarUrl,
                    state: state,
                    last_changed: last_changed
                  }) :
                  this.toggleModal()
              }}

              icon={
                <TennisIcons color='white' size={26} name='squash-rackets' />
              }
              title="Play"
              titleStyle={{ fontSize: 20 }}
            />
          )}
          <Modal
            isVisible={this.state.isModalVisible}
            onBackdropPress={() => this.setState({ isModalVisible: false })}
            backdropTransitionOutTiming={0}
            style={styles.bottomModal}>
            <View style={styles.modalContent}>
              <Icon containerStyle={{ paddingTop: 20 }} size={40} type='font-awesome' name='sign-in' />
              <Text style={{ paddingBottom: 20, fontSize: 20 }}>You need to sign in to continue</Text>
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