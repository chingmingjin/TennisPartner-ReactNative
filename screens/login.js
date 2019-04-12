import React, { Component } from 'react';
import { View, TextInput, Image, Platform } from 'react-native';
import { Container, Header, Title, Content, Button, Left, Right, Body, Icon, Text, StyleProvider, Item, Input } from 'native-base';

import firebase from 'react-native-firebase';
import PhoneInput from 'react-native-phone-input';
import CountryPicker from 'react-native-country-picker-modal';

import getTheme from '../native-base-theme/components';
import commonColor from '../native-base-theme/variables/commonColor';

const successImageUri = 'https://cdn.pixabay.com/photo/2015/06/09/16/12/icon-803718_1280.png';

export default class PhoneAuthTest extends Component {
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
    };

    this.onPressFlag = this.onPressFlag.bind(this);
    this.selectCountry = this.selectCountry.bind(this);
  }

  componentDidMount() {
    this.unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user: user.toJSON() });
      } else {
        // User has been signed out, reset the state
        this.setState({
          pickerData: this.phone.getPickerData(),
          user: null,
          message: '',
          codeInput: '',
          phoneNumber: '',
          confirmResult: null,
        });
      }
    });
  }

  componentWillUnmount() {
     if (this.unsubscribe) this.unsubscribe();
  }

  signIn = () => {
    const { phoneNumber } = this.state;
    this.setState({ message: 'Sending code ...' });

    firebase.auth().signInWithPhoneNumber(phoneNumber)
      .then(confirmResult => this.setState({ confirmResult, message: 'Code has been sent!' }))
      .catch(error => this.setState({ message: `Sign In With Phone Number Error: ${error.message}` }));
  };

  confirmCode = () => {
    const { codeInput, confirmResult } = this.state;

    if (confirmResult && codeInput.length) {
      confirmResult.confirm(codeInput)
        .then((user) => {
          this.setState({ message: 'Code Confirmed!' });
        })
        .catch(error => this.setState({ message: `Code Confirm Error: ${error.message}` }));
    }
  };

  signOut = () => {
    firebase.auth().signOut();
  }

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
                onChangeText={value => this.setState({ phoneNumber: value })}
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
        <Text>By tapping "Verify Phone Number", you are indicating that you accept our Terms of Service and Privacy Policy. An SMS may be sent. Message & data rates may apply</Text>
      </View>
    );
  }

  renderMessage() {
    const { message } = this.state;

    if (!message.length) return null;

    return (
      <Text style={{ padding: 5, backgroundColor: '#000', color: '#fff' }}>{message}</Text>
    );
  }

  renderVerificationCodeInput() {
    const { codeInput } = this.state;

    return (
      <View style={{ marginTop: 25, padding: 25 }}>
        <Text>Enter verification code below:</Text>
        <TextInput
          autoFocus
          style={{ height: 40, marginTop: 15, marginBottom: 15 }}
          onChangeText={value => this.setState({ codeInput: value })}
          placeholder={'Code ... '}
          value={codeInput}
        />
        <Button title="Confirm Code" color="#841584" onPress={this.confirmCode} />
      </View>
    );
  }

  render() {
    const { user, confirmResult } = this.state;
    const ButtonLeft = Platform.select({
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
            <ButtonLeft />
            </Left>
            <Body>
              <Title style={{ color: "white" }}>Sign in</Title>
            </Body>
            <Right />
          </Header>
          <Content>
          <View style={{ flex: 1 }}>

                {!user && !confirmResult && this.renderPhoneNumberInput()}

                {this.renderMessage()}

                {!user && confirmResult && this.renderVerificationCodeInput()}

                {user && (
                <View
                    style={{
                    padding: 15,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#77dd77',
                    flex: 1,
                    }}
                >
                    <Image source={{ uri: successImageUri }} style={{ width: 100, height: 100, marginBottom: 25 }} />
                    <Text style={{ fontSize: 25 }}>Signed In!</Text>
                    <Text>{JSON.stringify(user)}</Text>
                    <Button title="Sign Out" color="red" onPress={this.signOut} />
                </View>
                )}
            </View>
          </Content>
          </Container>
          </StyleProvider>
    );
  }
}