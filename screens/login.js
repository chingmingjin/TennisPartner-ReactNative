import React, { Component } from 'react';
import { View, Image, Platform, StyleSheet, TouchableHighlight } from 'react-native';
import { Container, Header, Title, Content, Button, Left, Right, Body, Icon, Text, StyleProvider, Toast, Item, Input, Label, Spinner, ListItem, Radio } from 'native-base';

import firebase from 'react-native-firebase';
import PhoneInput from 'react-native-phone-input';
import CountryPicker from 'react-native-country-picker-modal';
import Link from '../components/Link';
import ButtonBack from '../components/ButtonBack';
import { LoginButton, GraphRequest, GraphRequestManager, AccessToken } from 'react-native-fbsdk';
import DatePicker from 'react-native-datepicker';
import ImagePicker from 'react-native-image-picker';
import * as Progress from 'react-native-progress';
import moment from 'moment';
import Geolocation from 'react-native-geolocation-service';
import { Geokit } from 'geokit';

import getTheme from '../native-base-theme/components';
import commonColor from '../native-base-theme/variables/commonColor';
import { withNavigation } from 'react-navigation';


class PhoneAuth extends Component {
  constructor(props) {
    super(props);
    this.unsubscribe = null;
    this.state = {
      user: null,
      message: '',
      codeInput: '',
      phoneNumber: '',
      confirmResult: null,
      cca2: 'HR',
      loading: false,
      loadingProgress: false,
      title: 'Sign In',
      avatarSource: require('../images/user.png'),
      male: false,
      female: false,
      avatarSelected: false,
      fbLogin: false,
      gender: null
    };

    this.onPressFlag = this.onPressFlag.bind(this);
    this.selectCountry = this.selectCountry.bind(this);
  }

  componentDidMount() {
    this.unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user: user });
      }
    });
  }

  componentWillUnmount() {
     if (this.unsubscribe) this.unsubscribe();
  }

  signIn = () => {
    if(!this.phone.isValidNumber()) {
        this.setState({ message: 'Please enter valid phone number!' });
        return null;
    }
    const phone = this.phone.getValue();
    this.setState({ phoneNumber: phone, message: '', loading: true, loadingText: 'Sending verification code...' });

    firebase.auth().signInWithPhoneNumber(phone)
      .then(confirmResult => this.setState({ confirmResult, loading: false }))
      .catch(error => this.setState({ message: error.message }));
  };

  confirmCode = () => {
    const { codeInput, confirmResult } = this.state;
    if(!codeInput.length) {
      this.setState({ message: 'Please enter verification code!' });
      return null;
    }
    this.setState({ message: '', loading: true, loadingText: 'Verifying code...' });

    if (confirmResult) {
      confirmResult.confirm(codeInput)
        .then((user) => {
          if(user.metadata.creationTime === user.metadata.lastSignInTime)
            this.setState({ loading: false, message: '', title: 'Your Info' });
          else this.props.navigation.goBack();
        })
        .catch(error => this.setState({ loading: false, message: error.message }));
    }
  };

  onPressFlag(){
    this.countryPicker.openModal();
    }

    selectCountry(country){
        this.phone.selectCountry(country.cca2.toLowerCase());
        this.setState({ cca2: country.cca2 });
    }

  renderPhoneNumberInput() {
   const { phoneNumber } = this.state;

    return (
      <View style={{ padding: 25 }}>
        <Text>Enter phone number:</Text>
        <PhoneInput 
                style={{ marginTop: 20 }}
                ref={(ref) => { this.phone = ref; }}
                textProps={{autoFocus: true}}
                flagStyle={{ width: 35, height: 25 }}
                textStyle={{ fontSize: 18, fontWeight: 'bold' }}
                value={phoneNumber}
                initialCountry='hr'
                onPressFlag={this.onPressFlag}/>

        <CountryPicker
                ref={(ref) => {
                    this.countryPicker = ref;
                }}
                closeable={true}
                onChange={value => this.selectCountry(value)}
                translation="eng"
                showCallingCode={true}
                transparent = {true}
                cca2={this.state.cca2}
                >
                <View />
        </CountryPicker>
        
        <Button block light style={{ marginTop: 20, marginBottom: 20, padding: 0 }} onPress={this.signIn}><Text style={{ color: '#FFF' }} >Verify Phone Number</Text></Button>
        <Text>By tapping "Verify Phone Number", you are indicating that you accept our <Link url='http://tennispartner.app/tos.html'>Terms of Service</Link> and <Link url='http://tennispartner.app/privacy-policy.html'>Privacy Policy</Link>. An SMS may be sent. Message & data rates may apply</Text>
      </View>
    );
  }

  renderMessage() {
    const { message } = this.state;

    if (!message.length) return null;

    return (
      <Text style={{ marginStart: 20, marginEnd: 20, padding: 15, backgroundColor: '#d9534f', color: '#fff' }}>{message}</Text>
    );
  }

  renderVerificationCodeInput() {
    const { codeInput } = this.state;

    return (
      <View style={{ padding: 25 }}>
        <Text style={{ textAlign: 'center' }}>Enter verification code below:</Text>
        <Item underline>
            <Input 
            autoFocus
            onChangeText={value => this.setState({ codeInput: value })}
            keyboardType='number-pad'
            textContentType='oneTimeCode'
            maxLength={6}
            style={{ textAlign: 'center', fontSize: 24, fontWeight: 'bold' }}
            value={codeInput} />
        </Item>
        <Button block light style={{ marginTop: 20, marginBottom: 20, padding: 0 }} onPress={this.confirmCode}><Text style={{ color: '#FFF' }} >Confirm Code</Text></Button>
      </View>
    );
  }

  openImagePicker() {
    const options = {
      title: 'Select Avatar',
      cameraType: 'front',
      allowsEditing: true
    };

    ImagePicker.showImagePicker(options, (response) => {
    
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const source = { uri: response.uri };
    
        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
    
        this.setState({
          avatarSource: source, avatarSelected: true
        });
      }
    });
  }

  toggleMale() {
    const { male } = this.state;
    if(!male) this.setState({ male: true, female: false });
  }
  toggleFemale() {
    const { female } = this.state;
    if(!female) this.setState({ female: true, male: false });
  }

  logIn() {
    const { user, avatarSelected, avatarSource, fullName, date, male, female, phoneNumber, fbLogin, gender } = this.state;
    if(fbLogin) {
      this.setState({ loading: true, loadingText: 'Signing in...' });
      var fullNameArr = fullName.split(' ');
      Geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const location = new firebase.firestore.GeoPoint(lat, lon);
          const playerData = {
            avatarUrl: avatarSource,
            firstName: fullNameArr[0],
            lastName: fullNameArr[fullNameArr.length-1],
            phoneNumber: phoneNumber,
            gender: gender,
            birthday: date,
            l: location,
            g: Geokit.hash({ lat: lat,  lng: lon })
          }
          firebase.firestore().collection('players').doc(user.uid).set(playerData)
          .then((userRef) => {
            user.updateProfile({displayName: fullName, photoURL: avatarSource }).then(() => {
              this.setState({ loading: false });
              this.props.navigation.goBack()
            });
          }).catch(error => console.error(error));
        },
        (error) => {
            // See error code charts below.
            alert('Cannot get your location!');
            console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } else {
      const fullNameRegex = new RegExp("^[^\d-]([-']?[a-z]+)*( [^\d-]([-']?.+)+)+$");
      if(!avatarSelected) {
        Toast.show({
          text: 'You didn\'t select your avatar!',
          textStyle: { textAlign: 'center' },
          type: 'danger',
          duration: 3500
        });
      } else if(!fullName || !fullNameRegex.test(fullName)) {
        Toast.show({
          text: 'You didn\'t enter your full name!',
          textStyle: { textAlign: 'center' },
          type: 'danger',
          duration: 3500
        });
      } else if(!date) {
        Toast.show({
          text: 'You didn\'t enter your birthday!',
          textStyle: { textAlign: 'center' },
          type: 'danger',
          duration: 3500
        });
      } else if(!male && !female) {
        Toast.show({
          text: 'You didn\'t select your gender!',
          textStyle: { textAlign: 'center' },
          type: 'danger',
          duration: 3500
        });
      } else {
        this.setState({ loadingProgress: true, uploadProgress: 0, loadingText: 'Signing in...' });

        var fullNameArr = fullName.split(' ');

        Geolocation.getCurrentPosition(
          (position) => {
            const ref = firebase.storage().ref('/images/avatars/' + user.uid + '.jpg');
            const uploadTask = ref.putFile(avatarSource.uri, { contentType: 'image/jpeg' });
            const unsubscribe = uploadTask.on(
              firebase.storage.TaskEvent.STATE_CHANGED,
              (snapshot) => {
                var progress = snapshot.bytesTransferred / snapshot.totalBytes;
                this.setState({ uploadProgress: progress });
                if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
                  unsubscribe();
                  const lat = position.coords.latitude;
                  const lon = position.coords.longitude;
                  const location = new firebase.firestore.GeoPoint(lat, lon);
                  const playerData = {
                    avatarUrl: snapshot.downloadURL,
                    firstName: fullNameArr[0],
                    lastName: fullNameArr[fullNameArr.length-1],
                    phoneNumber: phoneNumber,
                    gender: (male) ? 'male' : 'female',
                    birthday: moment(date, "DD.MM.YYYY").format("YYYY-MM-DD"),
                    l: location,
                    g: Geokit.hash({ lat: lat,  lng: lon })
                  }
                  firebase.firestore().collection('players').doc(user.uid).set(playerData)
                  .then((userRef) => {
                    user.updateProfile({displayName: fullName, photoURL: snapshot.downloadURL }).then(() => {
                      this.setState({ loadingProgress: false });
                      this.props.navigation.goBack()
                    });
                  }).catch(error => console.error(error));
                }
              },
              (error) => {
                unsubscribe();
                console.error(error);
              },
            );
          },
          (error) => {
              // See error code charts below.
              alert('Cannot get your location!');
              console.log(error.code, error.message);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      }
    }
  }

  _responseInfoCallback(error, result) {
    if (error) {
      console.log('Error fetching data: ' + error.toString());
    } else {
      console.log(result);
    }
  }

  render() {
    const styles = StyleSheet.create({
      loginInfo: {
        alignItems: 'center',
        padding: 20
      },
      profileImg: {
          width: 120,
          height: 120,
          borderRadius: 60,
          marginTop: 10,
          marginBottom: 10
      },
      radio: {
        marginStart: 2, 
        alignSelf: 'flex-start'
      }
    });
    const { user, confirmResult, loading, loadingText, loadingProgress, uploadProgress, title } = this.state;
    return (
        <StyleProvider style={getTheme(commonColor)}>
        <Container>
          <Header>
          <Left>
            <ButtonBack />
            </Left>
            <Body>
              <Title style={{ color: "white" }}>{ title }</Title>
            </Body>
            <Right />
          </Header>
          <Content>

                { loading && (
                  <View style={{ flex: 1 }}>
                  <Progress.Circle style={{ alignSelf: 'center', marginTop: 50 }} color="#ffa737" size={45} borderWidth={3} indeterminate={true} />
                  <Text style={{ textAlign: 'center' }}>{ loadingText }</Text>
                  </View>
                )}

                { loadingProgress && (
                  <View style={{ flex: 1 }}>
                  <Progress.Circle progress={ uploadProgress } showsText={true} style={{ alignSelf: 'center', marginTop: 50 }} color="#ffa737" size={70} borderWidth={4} />
                  <Text style={{ textAlign: 'center' }}>{ loadingText }</Text>
                  </View>
                )}

                {!user && !confirmResult && !loading && this.renderPhoneNumberInput()}

                {!user && confirmResult && !loading && this.renderVerificationCodeInput()}

                {this.renderMessage()}

                {user && !(loading || loadingProgress) && (
                  <View style={styles.loginInfo}>
                  <TouchableHighlight style={{ borderRadius: 60 }} onPress={() => this.openImagePicker()}>
                    <Image source={this.state.avatarSource} style={styles.profileImg} />
                  </TouchableHighlight>
                  <Item style={{ marginTop: 10, marginBottom: 10 }} floatingLabel>
                    <Label>Full name</Label>
                    <Input onChangeText={value => this.setState({ fullName: value })} />
                  </Item>
                    <DatePicker
                        style={{ alignSelf: 'stretch', marginTop: 5, marginBottom: 5 }}
                        date={this.state.date}
                        mode="date"
                        androidMode="spinner"
                        placeholder="Birthday"
                        format="DD.MM.YYYY"
                        minDate="01-01-1920"
                        maxDate={new Date()}
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        customStyles={{
                          dateInput: {
                            borderWidth: 0,
                            borderBottomWidth: 1,
                            borderBottomColor: '#EEE',
                          },
                          dateIcon: {
                            position: 'absolute',
                            right: 4,
                            bottom: 10
                          },
                          placeholderText: {
                            position: 'absolute',
                            color: '#555',
                            fontSize: 16.5,
                            left: 2
                          }, 
                          dateText: {
                            position: 'absolute',
                            color: '#000',
                            fontSize: 16.5,
                            left: 5,
                          }
                        }}
                        onDateChange={(date) => {this.setState({date: date})}}
                      />
                    <ListItem onPress={() => this.toggleMale()} style={styles.radio}>
                      <Left>
                        <Text>Male</Text>
                      </Left>
                      <Right>
                        <Radio onPress={() => this.toggleMale()} selectedColor={"#1976d2"} selected={this.state.male} />
                      </Right>
                    </ListItem>
                    <ListItem onPress={() => this.toggleFemale()} style={styles.radio}>
                      <Left>
                        <Text>Female</Text>
                      </Left>
                      <Right>
                        <Radio onPress={() => this.toggleFemale()} selectedColor={"#1976d2"} selected={this.state.female} />
                      </Right>
                    </ListItem>
                  <Button onPress={() => this.logIn()} style={{ marginTop: 20, marginBottom: 20, height: 40 }} block light>
                    <Text style={{ color: 'white' }}>Continue</Text>
                  </Button>
                  <View style={{flexDirection: 'row'}}>
                      <View style={{backgroundColor: '#CCC', height: 1, flex: 1, alignSelf: 'center'}} />
                      <Text style={{ alignSelf:'center', color: '#CCC', paddingHorizontal: 5, fontSize: 16 }}>OR</Text>
                      <View style={{backgroundColor: '#CCC', height: 1, flex: 1, alignSelf: 'center'}} />
                  </View>
                    <View>
                    <LoginButton
                      style={{ width: 200, height: 30, marginTop: 20 }}
                      readPermissions={["user_birthday", "user_gender"]}
                      onLoginFinished={
                        (error, result) => {
                          if (error) {
                            alert("Login error: " + error.message);
                          } else {
                            AccessToken.getCurrentAccessToken().then(
                              (data) => {
                                let accessToken = data.accessToken;
                                console.log(accessToken);
                  
                                const responseInfoCallback = (error, result) => {
                                  if (error) {
                                    console.log(error);
                                    console.log('Error fetching data: ' + error.toString());
                                  } else {
                                    this.setState({ 
                                      fbLogin: true, 
                                      fullName: result.name, 
                                      avatarSource: 'https://graph.facebook.com/' + result.id + '/picture?width=300',
                                      gender: result.gender,
                                      date: moment(result.birthday, "MM/DD/YYYY").format("YYYY-MM-DD")
                                    });
                                    this.logIn();
                                  }
                                }
                  
                                const infoRequest = new GraphRequest(
                                  '/me',
                                  {
                                    accessToken: accessToken,
                                    parameters: {
                                      fields: {
                                        string: 'name,first_name,last_name,birthday,gender'
                                      }
                                    }
                                  },
                                  responseInfoCallback
                                );
                  
                                // Start the graph request.
                                new GraphRequestManager().addRequest(infoRequest).start()
                  
                              }
                            )
                          }
                        }
                      }/>
                  </View>

              </View>
                )}
          </Content>
          </Container>
          </StyleProvider>
    );
  }
}

export default withNavigation(PhoneAuth);