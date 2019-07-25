import React, { Component } from "react";
import { StyleSheet, Alert, View, Linking, Platform, Image, Dimensions } from 'react-native';
import { Content } from 'native-base';
import { Overlay, Text, Button, Input, Icon } from 'react-native-elements'
import firebase from 'react-native-firebase';
import MapView, { Marker, Callout } from 'react-native-maps';

import { GeoFirestore } from 'geofirestore';
import { Geokit } from 'geokit';

import { withNavigation } from 'react-navigation';
import equal from "fast-deep-equal";

const latitudeDelta = 0.0922
const longitudeDelta = 0.0421

class CourtList extends Component {
  
  constructor(props) {
    super(props);

    this.lat = (this.props.remoteLat != 0) ? this.props.remoteLat : this.props.latitude;
    this.lon = (this.props.remoteLon != 0) ? this.props.remoteLon : this.props.longitude;

    this.state = {
      courts: [],
      mapType: this.props.mapType,
      courtInfo: false,
      region: {
        latitudeDelta,
        longitudeDelta,
        latitude: this.lat,
        longitude: this.lon
      },
      courtNameEmpty: '',
    };
  }
    
  componentDidMount() {
    const { latitude, longitude, remoteLat, remoteLon } = this.props;
    const currentUser = firebase.auth().currentUser;

    const geofirestore = new GeoFirestore(firebase.firestore());

    // Create a GeoCollection reference
    const geocollection = geofirestore.collection('courts');

    // Create a GeoQuery based on a location
    const query = geocollection.near({
      center: (remoteLat != 0 && remoteLon != 0) ?
      new firebase.firestore.GeoPoint(remoteLat, remoteLon) :
      new firebase.firestore.GeoPoint(latitude, longitude),
      radius: 50
    });

    // Get query (as Promise)
    query.onSnapshot(function(snapshot) {
      if (!snapshot.empty) {
        var courts = [];
        snapshot._querySnapshot.docs.forEach(function (doc) {
          const { name, phone, l } = doc.data();
          const number = doc.data().number ? doc.data().number : null;
          courts.push({
            key: doc.id,
            name, phone, number, l
          });
        });
      } else Alert.alert(
        'No courts nearby',
        'We don\'t have any courts listed in your city yet. Can you help us and add them on the map?',
        [
          {
            text: 'Add court',
            onPress: () => {
              currentUser ? this.props.addMarker() : this.props.toggleModal()
            }
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ],
      );

      this.setState({ courts });
    }.bind(this));
  }

  componentDidUpdate(prevProps) {
    if (!equal(this.props.mapType, prevProps.mapType)) this.setState({ mapType: this.props.mapType });
    if (!equal(this.props.courtInfo, prevProps.courtInfo)) this.setState({ courtInfo: this.props.courtInfo });
  }

  addMarker = () => {
    const { region, courtName, courtPhone, courtNo } = this.state;
    if(!courtName){
      this.setState({ courtNameEmpty: 'Name cannot be empty!' })
      return
    }
    firebase.firestore().collection('courts').add({
      name: courtName,
      phone: courtPhone,
      number: courtNo,
      l: new firebase.firestore.GeoPoint(region.latitude, region.longitude),
      g: Geokit.hash({ lat: region.latitude,  lng: region.longitude })
    }).then((value) => {
      this.setState({
        courtNameEmpty: ''
      }, () => {
        this.props.toggleCourtInfo()
        this.props.markerAdded()
      })
    })
  }

  onRegionChange = region => {
    this.setState({
      region
    })
  }

  render() {
    const { region } = this.state
    
    return (
      <Content contentContainerStyle={{ ...StyleSheet.absoluteFillObject }}>
        <MapView
          style={{ ...StyleSheet.absoluteFillObject }}
          initialRegion={region}
          onRegionChangeComplete={this.onRegionChange}
          mapType={this.state.mapType}
        >
          {this.state.courts && this.state.courts.map(court => (
            <Marker
              key={court.key}
              coordinate={{ latitude: court.l.latitude, longitude: court.l.longitude }}
              centerOffset={{ x: 0, y: -45 }}
              title={court.name}
              image={require('../images/tennis_court_marker.png')}
            >
              <Callout
              onPress={() => Linking.openURL((Platform.OS === 'ios' ? 'tel://' : 'tel:') + court.phone)}>
                <View style={{ flexDirection: 'row' }}>
                  {court.phone && (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginEnd: 8 }}>
                    <Icon name='phone' />
                  </View>
                  )}
                  <View>
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{court.name}</Text>
                    <Text>{court.phone}</Text>
                    {court.number && (
                      <Text>{court.number} courts</Text>
                    )}
                  </View>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>
        {this.props.marker && (
            <View style={styles.markerFixed}>
            <Image style={styles.marker} source={require('../images/tennis_court_marker_add.png')} />
          </View>
          )}
        {
          this.state.courtInfo && (
            <Overlay isVisible height={Dimensions.get('window').height*0.35}>
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text style={{
                  fontSize: 18,
                  marginTop: 8,
                  marginStart: 8,
                  fontWeight: 'bold'
                }}>Court Info</Text>
                <Input
                  placeholder='Name *'
                  name='name'
                  onChangeText={(text) => this.setState({courtName: text})}
                  errorMessage={this.state.courtNameEmpty}
                />
                <Input
                  placeholder='Phone Number'
                  keyboardType='phone-pad'
                  name='phone'
                  onChangeText={(text) => this.setState({courtPhone: text})}
                />
                <Input
                  placeholder='Number of courts'
                  keyboardType='number-pad'
                  name='num_courts'
                  onChangeText={(text) => this.setState({courtNo: text})}
                />
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  marginTop: 16,
                  marginBottom: 16
                }}>
                  <Button
                    buttonStyle={{ marginEnd: 16, width: 75 }}
                    titleStyle={{ color: '#ffa737' }}
                    title="Cancel"
                    type="outline"
                    onPress={() => this.props.toggleCourtInfo()}
                  />
                  <Button
                    buttonStyle={{ backgroundColor: '#ffa737', width: 75 }}
                    title="Add"
                    onPress={() => this.addMarker() }
                  />
                </View>
                </View>
            </Overlay>
          )
        }
      </Content>
    );
  }
}
export default withNavigation(CourtList);

const styles = StyleSheet.create({
  markerFixed: {
    left: '50%',
    marginLeft: -24,
    marginTop: -48,
    position: 'absolute',
    top: '50%'
  },
  marker: {
    height: 56,
    width: 56
  }
})