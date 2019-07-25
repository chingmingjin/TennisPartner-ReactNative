import React, { Component } from 'react';
import { Dimensions, Platform, StatusBar, View } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Icon } from 'react-native-elements';
import color from "color";

const d = Dimensions.get("window");
const isX = Platform.OS === "ios" && (d.height > 800 || d.width > 800) ? true : false;

class PlacesScreen extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View style={{ height: '100%' }}>
            <StatusBar barStyle='light-content' backgroundColor={color("#1976d2").darken(0.2).hex()} />
            <GooglePlacesAutocomplete
                placeholder='Enter city'
                minLength={2} // minimum length of text to search
                autoFocus={true}
                enablePoweredByContainer={false}
                returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
                listViewDisplayed='true'    // true/false/undefined
                fetchDetails={true}
                renderDescription={row => row.description} // custom description render
                onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                    this.props.getNewLocation(details.geometry.location.lat, details.geometry.location.lng);
                    this.props.togglePicker();
                }}

                getDefaultValue={() => ''}

                query={{
                    // available options: https://developers.google.com/places/web-service/autocomplete
                    key: 'AIzaSyACKQQQmNubjsitW4kE-cH4Leee7Kg-gYE',
                    language: 'en', // language of the results
                    types: '(cities)' // default: 'geocode'
                }}

                styles={{
                    textInputContainer: {
                        ...Platform.select({
                            android: {
                              height: 56,
                            },
                            ios: {
                              height: isX ? 90 : 70,
                              paddingTop: isX ? 0 : 20
                            },
                        }),
                        alignItems: isX ? 'flex-end' : 'center',
                        paddingBottom: isX ? 5 : 0,
                        width: '100%',
                        backgroundColor: '#1976d2',
                    },
                    textInput: {
                        marginBottom: isX ? 4 : 8,
                        height: 35,
                        fontSize: 18,
                    },
                    description: {
                        fontWeight: 'bold'
                    },
                    predefinedPlacesDescription: {
                        color: '#1faadb'
                    }
                }}
                currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
                currentLocationLabel="Current location"
                nearbyPlacesAPI='None' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                GoogleReverseGeocodingQuery={{
                    // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
                }}
                GooglePlacesSearchQuery={{
                    // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                    rankby: 'distance',
                    type: 'cafe'
                }}

                GooglePlacesDetailsQuery={{
                    // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
                    fields: 'formatted_address',
                }}

                filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities

                debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
                renderLeftButton={() => <Icon
                    name='keyboard-arrow-left'
                    color='#fff'
                    size={40}
                    underlayColor='#1976d2'
                    onPress={() => this.props.togglePicker()} />}
            />
            </View>
        );
    }
}

export default PlacesScreen;