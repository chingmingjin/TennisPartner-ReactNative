import React, { Component } from 'react';
import { Alert, Platform } from 'react-native';

import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, StyleProvider } from 'native-base';

import getTheme from '../native-base-theme/components';
import commonColor from '../native-base-theme/variables/commonColor';
import { withNavigation } from 'react-navigation';

class HomeContainer extends Component {
  constructor(props) {
    super(props);
    }
    render() {
      const ButtonLeft = Platform.select({
        ios: () => {return(<Button transparent onPress={() => this.props.navigation.navigate('UserSettings')}><Icon style={{fontSize: 24}} type='FontAwesome5' name='user-cog' /></Button>)},
        android: () => {return(<Button transparent onPress={this.props.openDrawer}><Icon name='menu' /></Button>)},
      });
      return (
        <StyleProvider style={getTheme(commonColor)}>
        <Container>
          <Header>
            <Left>
              <ButtonLeft />
            </Left>
            <Body>
              <Title style={{ color: "white" }}>Players</Title>
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
                <Text>Players</Text>
              </Button>
              <Button vertical>
              <Icon type="MaterialCommunityIcons" name="tennis" />
                <Text>Courts</Text>
              </Button>
            </FooterTab>
          </Footer> 
          </Container>
          </StyleProvider>
        );
    }
}
export default withNavigation(HomeContainer);