import React, { Component } from 'react';
import { View, Platform, Dimensions, PermissionsAndroid } from 'react-native';

import { Footer, FooterTab, Button, Icon, Text, Content, StyleProvider } from 'native-base';
import { Header } from 'react-native-elements';
import { createIconSetFromFontello } from 'react-native-vector-icons';
import fontelloConfig from '../config.json';
import getTheme from '../../native-base-theme/components';
import platform from '../../native-base-theme/variables/platform';

import BottomSheet from 'reanimated-bottom-sheet';
import Slider from '@react-native-community/slider';

import firebase from 'react-native-firebase';

import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';
//import AsyncStorage from '@react-native-community/async-storage';

import color from "color";
import PlayersList from '../components/PlayersList';
import CourtList from '../components/CourtList';
import Ranking from '../components/Ranking';
import Settings from './userSettings';
import PlacesScreen from './places';

const d = Dimensions.get("window");
const isX = Platform.OS === "ios" && (d.height > 800 || d.width > 800) ? true : false;

const TennisIcons = createIconSetFromFontello(fontelloConfig);

function format(raw) {
  const address = {
    position: {},
    formattedAddress: raw.formatted_address || '',
    feature: null,
    streetNumber: null,
    streetName: null,
    postalCode: null,
    locality: null,
    country: null,
    countryCode: null,
    adminArea: null,
    subAdminArea: null,
    subLocality: null,
    placeId: null
  };

  if (raw.geometry && raw.geometry.location) {
    address.position = {
      lat: raw.geometry.location.lat,
      lng: raw.geometry.location.lng,
    }
  }
  
  if(raw.place_id) {
    address.placeId = raw.place_id;
  }
  
  raw.address_components.forEach(component => {
    if (component.types.indexOf('route') !== -1) {
      address.streetName = component.long_name;
    }
    else if (component.types.indexOf('street_number') !== -1) {
      address.streetNumber = component.long_name;
    }
    else if (component.types.indexOf('country') !== -1) {
      address.country = component.long_name;
      address.countryCode = component.short_name;
    }
    else if (component.types.indexOf('locality') !== -1) {
      address.locality = component.long_name;
    }
    else if (component.types.indexOf('postal_code') !== -1) {
      address.postalCode = component.long_name;
    }
    else if (component.types.indexOf('administrative_area_level_1') !== -1) {
      address.adminArea = component.long_name;
    }
    else if (component.types.indexOf('administrative_area_level_2') !== -1) {
      address.subAdminArea = component.long_name;
    }
    else if (component.types.indexOf('sublocality') !== -1 || component.types.indexOf('sublocality_level_1') !== -1) {
      address.subLocality = component.long_name;
    }
    else if (component.types.indexOf('point_of_interest') !== -1 || component.types.indexOf('colloquial_area') !== -1) {
      address.feature = component.long_name;
    }
  });

  return address;
}

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabPlayers: true,
      tabCourts: false,
      tabRanking: false,
      tabSettings: false,
      latitude: 0,
      longitude: 0,
      title: 'Players nearby',
      showPicker: false
    }
    Geocoder.init("AIzaSyACKQQQmNubjsitW4kE-cH4Leee7Kg-gYE");
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
      tabRanking: false,
      tabSettings: false
    });
  }
  toggleTabCourts() {
    this.setState({
      title: 'Courts in ' + this.state.city,
      tabPlayers: false,
      tabCourts: true,
      tabRanking: false,
      tabSettings: false
    });
  }
  toggleTabRanking() {
    this.setState({
      title: 'Rankings',
      tabPlayers: false,
      tabCourts: false,
      tabRanking: true,
      tabSettings: false
    });
  }
  toggleTabSettings() {
    this.setState({
      title: 'Settings',
      tabPlayers: false,
      tabCourts: false,
      tabRanking: false,
      tabSettings: true,
    });
  }
/* If you want to kepp showing the selected remote city then uncomment these lines
  storeLocation = async (lat, lng) => {
    try {
      await AsyncStorage.setItem('lat', lat.toString());
      await AsyncStorage.setItem('lng', lng.toString());
    } catch (e) {
      console.error(e)
    }
  }
*/
  getLocationCoord = async (lat = null, lng  = null) => {
    try {
      //if(lat !== null && lng !== null) this.storeLocation(lat, lng);
      var latitude = lat //? lat : await AsyncStorage.getItem('lat');
      var longitude = lng //? lng : await AsyncStorage.getItem('lng');
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
    Geocoder.from(lat, lon)
      .then(json => {
        const res = format(json.results[0]);
        this.setState({
          title: 'Players in ' + res.locality,
          city: res.locality,
          country: res.country,
          placeId: res.placeId
        });
        const uid = firebase.auth().currentUser.uid;
        const location = new firebase.firestore.GeoPoint(lat, lon);
        const city = new firebase.firestore.FieldValue.arrayUnion(res.placeId);
        const playerData = {
          cities: city,
          l: location
        };
        firebase.firestore().collection('players').doc(uid).update(playerData).catch(error => console.error(error));
      })
      .catch(error => console.warn(error));
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

  renderInner = () => (
    <View style={{ flex: 1, padding: 20 }}>
      <Slider
        minimumValue={1}
        maximumValue={100}
      />
    </View>
  )

  renderHeader = () => {
    /* render */
  }

  render() {
    const { tabPlayers, tabCourts, tabRanking, tabSettings, showPicker } = this.state;

    if(showPicker) {
    return (
      <PlacesScreen getNewLocation={this.getLocationCoord} togglePicker={this.togglePicker} />
    ) } else {
    return (
      <StyleProvider style={getTheme(platform)}>
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
        {tabRanking && this.state.latitude != 0 && (<Ranking city={this.state.city} country={this.state.country}placeId={this.state.placeId}/>)}
        {tabSettings && (<Settings />)}
        <BottomSheet
          style={{ marginBottom: 55 }}
          snapPoints = {[250, 100, 0]}
          renderContent = {this.renderInner}
          renderHeader = {this.renderHeader}
        />
        <Footer>
          <FooterTab>
            <Button vertical active={this.state.tabPlayers} onPress={() => this.toggleTabPlayers()}>
              <Icon type="FontAwesome" name="users" />
              <Text>Players</Text>
            </Button>
            <Button vertical active={this.state.tabCourts} onPress={() => this.toggleTabCourts()}>
              <TennisIcons color={Platform.OS === 'android' ? 'white' : '#666'} size={26} name="tennis-court" />
              <Text>Courts</Text>
            </Button>
            <Button vertical active={this.state.tabRanking} onPress={() => this.toggleTabRanking()}>
              <Icon color={Platform.OS === 'android' ? 'white' : '#666'} type='FontAwesome' name="list-ol" />
              <Text>Rankings</Text>
            </Button>
            <Button vertical active={this.state.tabSettings} onPress={() => this.toggleTabSettings()}>
              <Icon name="cog" />
              <Text>Settings</Text>
            </Button>
          </FooterTab>
        </Footer>
      </View>
      </StyleProvider>
    )}
  }
}
export default HomeScreen;