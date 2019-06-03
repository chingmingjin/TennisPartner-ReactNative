import React, { Component } from 'react';
import { View, Platform, Dimensions, PermissionsAndroid } from 'react-native';

import { Footer, FooterTab, Button, Icon, Text, Content } from 'native-base';
import { Header } from 'react-native-elements';
import { createIconSetFromFontello } from 'react-native-vector-icons';
import fontelloConfig from '../config.json';

import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoder';
import AsyncStorage from '@react-native-community/async-storage';

import color from "color";
import PlayersList from '../components/PlayersList';
import CourtList from '../components/CourtList';
import Settings from './userSettings';
import PlacesScreen from './places';

const d = Dimensions.get("window");
const isX = Platform.OS === "ios" && (d.height > 800 || d.width > 800) ? true : false;

const TennisIcons = createIconSetFromFontello(fontelloConfig);

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabPlayers: true,
      tabCourts: false,
      tabSettings: false,
      latitude: 0,
      longitude: 0,
      title: 'Players nearby',
      showPicker: false
    }
    Geocoder.fallbackToGoogle("AIzaSyACKQQQmNubjsitW4kE-cH4Leee7Kg-gYE");
    this.requestLocationPermission = this.requestLocationPermission.bind(this);
  }

  componentDidMount() {
    this.getLocationCoord();
  }

  toggleTabPlayers() {
    this.setState({
      title: 'Players in ' + this.state.city,
      tabPlayers: true,
      tabCourts: false,
      tabSettings: false
    });
  }
  toggleTabCourts() {
    this.setState({
      title: 'Courts in ' + this.state.city,
      tabPlayers: false,
      tabCourts: true,
      tabSettings: false
    });
  }
  toggleTabSettings() {
    this.setState({
      title: 'Settings',
      tabPlayers: false,
      tabCourts: false,
      tabSettings: true,
    });
  }

  storeLocation = async (lat, lng) => {
    try {
      await AsyncStorage.setItem('lat', lat.toString());
      await AsyncStorage.setItem('lng', lng.toString());
    } catch (e) {
      console.error(e)
    }
  }

  getLocationCoord = async (lat = null, lng  = null) => {
    try {
      if(lat !== null && lng !== null) this.storeLocation(lat, lng);
      var latitude = lat ? lat : await AsyncStorage.getItem('lat');
      var longitude = lng ? lng : await AsyncStorage.getItem('lng');
      if (latitude !== null && longitude !== null) {
        latitude = parseFloat(latitude);
        longitude = parseFloat(longitude);
        this.setState({
          latitude: latitude,
          longitude: longitude
        });
        this.getCity(latitude, longitude);
      } else {
        if (Platform.OS === 'android')
          this.requestLocationPermission();
        else if (Platform.OS === 'ios') {
          this.getLocation();
        }
      }
    } catch (e) {
      console.error(e)
    }
  }

  getLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;
        this.storeLocation(lat, lon);
        this.getCity(lat, lon);
        this.setState({
          latitude: lat,
          longitude: lon
        });
      },
      (error) => {
        // See error code charts below.
        console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }

  getCity = (lat, lon) => {
    Geocoder.geocodePosition({ lat: lat, lng: lon }).then(res => {
      for(var i = res.length-1; i > 0; i--) {
        if(res[i].locality !== null) {
          this.setState({
            title: 'Players in ' + res[i].locality,
            city: res[i].locality
          });
          return;
        }
      }
    })
      .catch(err => console.log(err))
  }

  async requestLocationPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message:
            'Tennis Partner needs access to your location ' +
            'so we could find courts nearby.',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.getLocation();
      }
    } catch (err) {
      console.warn(err);
    }
  }

  togglePicker = () => {
    if (this.state.showPicker)
      this.setState({ showPicker: false })
    else this.setState({ showPicker: true })
  }

  render() {
    const { tabPlayers, tabCourts, tabSettings, showPicker } = this.state;

    if(showPicker) {
    return (
      <PlacesScreen getNewLocation={this.getLocationCoord} togglePicker={this.togglePicker} />
    ) } else {
    return (
      <View style={{ flex: 1 }}>
        <Header
          statusBarProps={{
            barStyle: 'light-content',
            backgroundColor: color("#1976d2").darken(0.2).hex()
          }}
          containerStyle={{
            backgroundColor: "#1976d2",
            ...Platform.select({
              android: {
                height: 56,
                paddingTop: -10
              },
              ios: {
                height: isX ? 97 : 64
              },
            })
          }}
          placement="left"
          leftComponent={{ icon: 'room', underlayColor: "#1976d2", color: '#fff', onPress: () => this.togglePicker() }}
          centerComponent={{ text: this.state.title, style: { color: '#fff', fontSize: 18 }, onPress: () => this.togglePicker() }}
          rightComponent={{ icon: 'search', underlayColor: "#1976d2", color: '#fff', onPress: () => alert("You pressed the button") }}
        />
        {this.state.latitude == 0 && (<Content padder />)}
        {tabPlayers && this.state.latitude != 0 && (<PlayersList latitude={this.state.latitude} longitude={this.state.longitude} city={this.state.city} />)}
        {tabCourts && this.state.latitude != 0 && (<CourtList latitude={this.state.latitude} longitude={this.state.longitude} />)}
        {tabSettings && (<Settings />)}
        <Footer>
          <FooterTab>
            <Button vertical active={this.state.tabPlayers} onPress={() => this.toggleTabPlayers()}>
              <Icon type="FontAwesome" name="users" />
              <Text>Players</Text>
            </Button>
            <Button vertical active={this.state.tabCourts} onPress={() => this.toggleTabCourts()}>
              <TennisIcons color="white" size={28} name="tennis-court" />
              <Text>Courts</Text>
            </Button>
            <Button vertical active={this.state.tabSettings} onPress={() => this.toggleTabSettings()}>
              <Icon name="cog" />
              <Text>Settings</Text>
            </Button>
          </FooterTab>
        </Footer>
      </View>
    )}
  }
}
export default HomeScreen;