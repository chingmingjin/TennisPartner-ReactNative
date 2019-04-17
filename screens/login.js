import React, { Component } from 'react';
import { View, Image, Platform, StyleSheet, TouchableHighlight } from 'react-native';
import { Container, Header, Title, Content, Button, Left, Right, Body, Icon, Text, StyleProvider, Item, Input, Label, Spinner, ListItem, Radio } from 'native-base';

import firebase from 'react-native-firebase';
import PhoneInput from 'react-native-phone-input';
import CountryPicker from 'react-native-country-picker-modal';
import Link from '../components/Link';
import { LoginButton } from 'react-native-fbsdk';
import DatePicker from 'react-native-datepicker';
import ImagePicker from 'react-native-image-picker';

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
      title: 'Sign In',
      avatarSource: require('../images/user.png'),
      male: false,
      female: false
    };

    this.onPressFlag = this.onPressFlag.bind(this);
    this.selectCountry = this.selectCountry.bind(this);
  }

  componentDidMount() {
    this.unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user: user.toJSON() });
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
          this.setState({ loading: false, message: '', title: 'Your Info' });
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
      console.log('Response = ', response);
    
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };
    
        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
    
        this.setState({
          avatarSource: source,
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
      separator: {
        alignSelf: 'stretch',
        fontSize: 14,
        color: '#999',
        textAlign: 'center'
      },
      radio: {
        marginStart: 2, 
        alignSelf: 'flex-start'
      }
    });
    const { user, confirmResult, loading, loadingText, title } = this.state;
    const ButtonBack = Platform.select({
        ios: () => {
            return(
            <Button transparent onPress={() => this.props.navigation.goBack()}>
                <Icon name='arrow-back' />
                <Text>Back</Text>
            </Button>
            )},
        android: () => {
            return(
            <Button transparent onPress={() => this.props.navigation.goBack()}>
                <Icon name='arrow-back' />
            </Button>
            )},
      });
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
                  <Spinner color='#ffa737' />
                  <Text style={{ textAlign: 'center' }}>{ loadingText }</Text>
                  </View>
                )}

                {!user && !confirmResult && !loading && this.renderPhoneNumberInput()}

                {!user && confirmResult && !loading && this.renderVerificationCodeInput()}

                {this.renderMessage()}

                {user && !loading && (
                  <View style={styles.loginInfo}>
                  <TouchableHighlight style={{ borderRadius: 60 }} onPress={() => this.openImagePicker()}>
                    <Image source={this.state.avatarSource} style={styles.profileImg} />
                  </TouchableHighlight>
                  <Item style={{ marginTop: 10, marginBottom: 10 }} floatingLabel>
                    <Label>Full name</Label>
                    <Input />
                  </Item>
                    <DatePicker
                        style={{ alignSelf: 'stretch', marginTop: 5, marginBottom: 5 }}
                        date={this.state.date}
                        mode="date"
                        androidMode="spinner"
                        placeholder="Birthday"
                        format="DD.MM.YYYY"
                        minDate="01-01-1920"
                        maxDate={"01-01-2019"}
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
                  <Button style={{ marginTop: 20, marginBottom: 20, height: 40 }} block light>
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
                      readPermissions={["user_birthday user_gender"]}
                      onLoginFinished={
                        (error, result) => {
                          if (error) {
                            alert("Login error: " + error.message);
                          } else {
                            alert("Login was successful with permissions: " + result.grantedPermissions)
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