import React, { Component } from 'react';
import { Alert, DrawerLayoutAndroid, View, Platform, Image, StyleSheet } from 'react-native';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, StyleProvider } from 'native-base';

import getTheme from '../native-base-theme/components';
import commonColor from '../native-base-theme/variables/commonColor';


export default class HomeScreen extends Component {
    render() {
      const styles = StyleSheet.create({
        navigationView: {
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
        },
        profileImg: {
          height: 100,
          width: 100,
          borderRadius: 40,
        },
      });
      var navigationView = (
        <View style={styles.navigationView}>
          <Image source={require('../images/user.png')} style={styles.profileImg} />
          <Text>Ivan Grubišić</Text>
        </View>
      );
      const ButtonLeft = Platform.select({
        ios: () => {return(<Button transparent><Icon type='FontAwesome5' name='user-cog' /></Button>)},
        android: () => {return(<Button transparent onPress={() => this.refs['drawer'].openDrawer()}><Icon name='menu' /></Button>)},
      });
      return (
        <StyleProvider style={getTheme(commonColor)}>
        <Container>
        <DrawerLayoutAndroid
          ref="drawer"
          drawerWidth={250}
          drawerPosition={DrawerLayoutAndroid.positions.Left}
          renderNavigationView={() => navigationView}>
          <Header>
            <Left>
              <ButtonLeft />
            </Left>
            <Body>
              <Title style={{ color: "white" }}>Tennis Partner</Title>
            </Body>
            <Right>
            <Button transparent 
            onPress={() => {
               Alert.alert('You tapped the button!');
            }}>
                <Icon name='search' />
              </Button>
            </Right>
          </Header>
          <Content>
            <Text>
              This is Content Section
            </Text>
          </Content>
          <Footer>
            <FooterTab>
              <Button vertical active>
              <Icon type="FontAwesome" name="users" />
                <Text>Igrači</Text>
              </Button>
              <Button vertical>
              <Icon type="MaterialCommunityIcons" name="tennis" />
                <Text>Tereni</Text>
              </Button>
            </FooterTab>
          </Footer>
          </DrawerLayoutAndroid>
        </Container>
        </StyleProvider>
      );
    }
  }