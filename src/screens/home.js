import React, { Component } from 'react';
import { View, Platform, Dimensions, PermissionsAndroid, StyleSheet } from 'react-native';

import { Footer, FooterTab, Button, Icon, Text, Content, StyleProvider, Toast } from 'native-base';
import { Header, Icon as RNEIcon } from 'react-native-elements';
import { createIconSetFromFontello } from 'react-native-vector-icons';
import fontelloConfig from '../config.json';
import getTheme from '../../native-base-theme/components';
import platform from '../../native-base-theme/variables/platform';

import Snackbar from 'react-native-snackbar';
import RBSheet from "react-native-raw-bottom-sheet";
import Slider from '@react-native-community/slider';
import ModalDropdown from 'react-native-modal-dropdown';

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
import { format } from '../utils/format';

const d = Dimensions.get("window");
const isX = Platform.OS === "ios" && (d.height > 800 || d.width > 800) ? true : false;

const TennisIcons = createIconSetFromFontello(fontelloConfig);

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabPlayers: true,
      tabCourts: false,
      tabRanking: false,
      tabSettings: false,
      openFilter: false,
      latitude: 0,
      longitude: 0,
      remoteLat: 0,
      remoteLon: 0,
      distance: 50,
      title: 'Players nearby',
      showPicker: false,
      mapType: 'standard',
      marker: false
    }
    this.state.distanceSlide = this.state.distance;
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
          remoteLat: latitude,
          remoteLon: longitude
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
        const currentUser = firebase.auth().currentUser;
        if (currentUser) {
          const uid = currentUser.uid;
          const city = new firebase.firestore.FieldValue.arrayUnion(res.placeId);
          const playerData = {
            cities: city,
          };
          firebase.firestore().collection('players').doc(uid).update(playerData).catch(error => console.error(error));
        }
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

  toggleFilter = () => {
    const { openFilter } = this.state;
    this.setState({
      openFilter: !openFilter
    });
    if(openFilter == false) this.RBSheet.open();
    else this.RBSheet.close();
  }

  markerAdded = () => {
    this.setState({ marker: false }, () => {
      Snackbar.dismiss();
      Toast.show({
        text: "Court succesfully added!",
        duration: 3000,
        type: "success"
      });
    })
  }

  addMarker = () => {
    this.setState({ marker: true }, () => {
      Snackbar.show({
        title: 'Drag and drop the marker to court location',
        duration: Snackbar.LENGTH_INDEFINITE,
        action: {
          title: 'CANCEL',
          color: '#ffa737',
          onPress: () => { this.setState({ marker: false }) },
        },
      });
    })
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
          leftComponent={{ 
            icon: (!tabSettings) ? 'map-marker-radius' : 'settings',
            type: (!tabSettings) ? 'material-community' : 'material', 
            underlayColor: "#1976d2", color: '#fff', 
            onPress: () => (this.state.tabSettings) ? null : this.togglePicker() 
          }}
          centerComponent={{ 
            text: this.state.title, 
            style: { color: '#fff', fontSize: 18 }, 
            onPress: () => (this.state.tabSettings) ? null : this.togglePicker() 
          }}
            rightComponent={(
              <View>
                {tabPlayers &&
                  <RNEIcon
                    name='search'
                    underlayColor='#1976d2'
                    color='#fff'
                    onPress={() => this.toggleFilter()}
                  />}
                {tabCourts &&
                  <View style={{ flexDirection: 'row' }}>
                    <RNEIcon
                      name='map-marker-plus'
                      type='material-community'
                      underlayColor='#1976d2'
                      color='#fff'
                      containerStyle={{ marginEnd: 16 }}
                      onPress={() => this.addMarker() }
                    />
                    <ModalDropdown
                      ref={el => this.mapType = el}
                      defaultValue=''
                      dropdownStyle={{
                        marginTop: 25,
                        width: 100,
                        height: 85
                      }}
                      onSelect={(idx, value) => {
                        this.setState({ mapType: value.toLowerCase() });
                      }}
                      dropdownTextStyle={{ fontSize: 16, color: '#000' }}
                      options={['Standard', 'Hybrid']}>
                      <RNEIcon
                        name='layers'
                        underlayColor='#1976d2'
                        color='#fff'
                        onPress={() => this.mapType.show()}
                      />
                    </ModalDropdown>
                  </View>}
              </View>
            )}
      />
        {this.state.latitude == 0 && (<Content padder />)}
          {tabPlayers && this.state.latitude != 0 && (
            <PlayersList
              latitude={this.state.latitude}
              longitude={this.state.longitude}
              remoteLat={this.state.remoteLat}
              remoteLon={this.state.remoteLon}
              city={this.state.city}
              placeId={this.state.placeId}
              distance={this.state.distance} />
          )}
          {tabCourts && this.state.latitude != 0 && (
            <CourtList
              latitude={this.state.latitude}
              longitude={this.state.longitude}
              remoteLat={this.state.remoteLat}
              remoteLon={this.state.remoteLon}
              mapType={this.state.mapType}
              marker={this.state.marker}
              addMarker={() => this.addMarker()}
              markerAdded={() => this.markerAdded()} />
          )}
          {tabRanking && this.state.latitude != 0 && (
            <Ranking
              city={this.state.city}
              country={this.state.country}
              placeId={this.state.placeId} />
          )}
        {tabSettings && (<Settings />)}
          <RBSheet
            ref={ref => {
              this.RBSheet = ref;
            }}
            height={200}
            duration={250}
            closeOnDragDown={true}
            onClose={() => this.setState({openFilter: false})}
            customStyles={{
              container: {
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                padding: 20,
                backgroundColor: '#f7f7f7',
                justifyContent: "center",
              }
            }}
          >
            <View style={{ flex: 1 }}>
                <View style={styles.panelHeader}>
                  <View style={styles.panelHandle} />
                </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text>Distance</Text>
              <Text>{this.state.distanceSlide.toFixed(0)} km</Text>
            </View>
            <Slider
              style={{ marginTop: 15, marginBottom: 15 }}
              minimumValue={1}
              maximumValue={100}
              value={this.state.distance}
              minimumTrackTintColor='#ffa737'
              thumbTintColor='#DC851F'
              onValueChange={value => this.setState({ distanceSlide: value })}
              onSlidingComplete={value => this.setState({ distance: value })}
            />
            </View>
          </RBSheet>
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
              <Icon type="MaterialIcons" name="settings" />
              <Text>Settings</Text>
            </Button>
          </FooterTab>
        </Footer>
      </View>
      </StyleProvider>
    )}
  }
}

const styles = StyleSheet.create({
  panelHeader: {
    alignItems: 'center',
    paddingBottom: 20
  },
  panelHandle: {
    width: 40,
    height: 5,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10,
  },
  panel: {
    height: 200,
    padding: 10,
    backgroundColor: '#f7f5eee8',
  }
});
export default HomeScreen;