import React, { Component } from "react";
import {
  Platform,
  AppState,
  PushNotificationIOS
} from "react-native";
import { Root } from 'native-base';

import { createStackNavigator, createAppContainer } from "react-navigation";
import { Provider } from "react-redux";
import store from "./src/store";
import SendBird from 'sendbird';
import firebase from 'react-native-firebase';

import HomeScreen from "./src/screens/home";
import UserDetailsScreen from "./src/screens/userDetails";
import LoginScreen from "./src/screens/login";
import Chat from "./src/screens/chat";
import PlacesScreen from "./src/screens/places";
import {
  sbConnect,
  sbRegisterPushToken
} from './src/sendbirdActions';

const AppNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    Login: LoginScreen,
    UserDetails: UserDetailsScreen,
    Chat: Chat,
    Places: PlacesScreen
  },
  {
    initialRouteName: "Home",
    headerMode: "none"
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default class App extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    const channel = new firebase.notifications.Android.Channel(
      'app.tennispartner.chat',
      'Chat',
      firebase.notifications.Android.Importance.Max
    ).setDescription('Messages from other players');
    firebase.notifications().android.createChannel(channel);

    firebase.messaging().hasPermission()
        .then(enabled => {
          if (enabled) {
            this.onMessageListener = firebase.messaging().onMessage(message => {
              if (Platform.OS === 'ios') {
                const text = message.data.message;
                const payload = JSON.parse(message.data.sendbird);
                const localNotification = new firebase.notifications.Notification({
                  show_in_foreground: true
                })
                  .setNotificationId(message.messageId)
                  .setTitle('New message')
                  .setSubtitle(`Unread message: ${payload.unread_message_count}`)
                  .setBody(text)
                  .setData(payload);
                firebase.notifications().displayNotification(localNotification);
              }
            });
            this.removeNotificationListener = firebase.notifications().onNotification((notification) => {
              firebase.notifications().displayNotification(notification);
            });
          }
        });

    //console.disableYellowBox = true;
    AppState.addEventListener("change", this._handleAppStateChange);

    if(firebase.auth().currentUser) {
      var uid = firebase.auth().currentUser.uid;

      sbConnect(uid).then(() => {
        this.onTokenRefreshListener = firebase.messaging().onTokenRefresh(fcmToken => {
          sbRegisterPushToken()
        });
      });


      var userStatusDatabaseRef = firebase.database().ref('/presence/' + uid);
      var userStatusFirestoreRef = firebase.firestore().doc('players/' + uid);

      // We'll create two constants which we will write to 
      // the Realtime database when this device is offline
      // or online.
      var isOfflineForDatabase = {
        state: 'offline',
        last_changed: firebase.database.ServerValue.TIMESTAMP,
      };

      var isOnlineForDatabase = {
        state: 'online',
        last_changed: firebase.database.ServerValue.TIMESTAMP,
      };

      var isOfflineForFirestore = {
        presence: {
          state: 'offline',
          last_changed: firebase.firestore.FieldValue.serverTimestamp()
        }
      };
    
      var isOnlineForFirestore = {
        presence: {
          state: 'online',
          last_changed: firebase.firestore.FieldValue.serverTimestamp()
        }
      };

      // Create a reference to the special '.info/connected' path in 
      // Realtime Database. This path returns `true` when connected
      // and `false` when disconnected.
      firebase.database().ref('.info/connected').on('value', function (snapshot) {
        // If we're not currently connected, don't do anything.
        if (snapshot.val() == false) {
          // Instead of simply returning, we'll also set Firestore's state
          // to 'offline'. This ensures that our Firestore cache is aware
          // of the switch to 'offline.'
          userStatusFirestoreRef.set(isOfflineForFirestore, {merge: true});
          return;
        };

        // If we are currently connected, then use the 'onDisconnect()' 
        // method to add a set which will only trigger once this 
        // client has disconnected by closing the app, 
        // losing internet, or any other means.
        userStatusDatabaseRef.onDisconnect().set(isOfflineForDatabase).then(function () {
          userStatusDatabaseRef.set(isOnlineForDatabase);
          userStatusFirestoreRef.set(isOnlineForFirestore, {merge: true});
        });
      });
    }
  }
  componentWillUnmount() {
    AppState.removeEventListener("change", this._handleAppStateChange);
    this.onTokenRefreshListener();
    this.onMessageListener();
  }
  render() {
    return (
      <Provider store={store}>
          <Root>
            <AppContainer />
          </Root>
      </Provider>
    );
  }

  _handleAppStateChange = (nextAppState) => {
    const sb = SendBird.getInstance();
    if (sb) {
      if (nextAppState === 'active') {
        if(Platform.OS === 'ios') {
          PushNotificationIOS.setApplicationIconBadgeNumber(0);
        }
        console.log('app is into foreground');
        sb.setForegroundState();
      } else if (nextAppState === 'background') {
        console.log('app is into background');
        sb.setBackgroundState();
      }
    }
  }
}