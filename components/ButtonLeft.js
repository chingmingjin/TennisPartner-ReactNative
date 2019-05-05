import React, { Component } from 'react';
import { Platform } from 'react-native';
import { Button, Icon } from 'native-base';
import { withNavigation } from 'react-navigation';

class ButtonLeft extends Component {
    
    render() {
        const ButtonLeft = Platform.select({
            ios: () => {
                return (
                    <Button transparent onPress={() => this.props.navigation.navigate('UserSettings')}>
                        <Icon style={{ fontSize: 24 }} type='FontAwesome5' name='user-cog' />
                    </Button>
                )
            },
            android: () => {
                return (
                    <Button transparent onPress={this.props.openDrawer}>
                        <Icon name='menu' />
                    </Button>
                )
            },
        });
        
        return <ButtonLeft />
    }
}

export default withNavigation(ButtonLeft);