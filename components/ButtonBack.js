import React, { Component } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { Button, Icon } from 'native-base';
import { withNavigation } from 'react-navigation';

class ButtonBack extends Component {
    
    render() {
        const styles = StyleSheet.create({
            icon: {
                color: '#fff',
                fontSize: 25
            }
        });

        const ButtonBack = Platform.select({
            ios: () => {
                return (
                    <Button transparent onPress={() => this.props.navigation.goBack()}>
                        <Icon style={styles.icon} name='arrow-back' />
                        <Text>Back</Text>
                    </Button>
                )
            },
            android: () => {
                return (
                    <Button transparent onPress={() => this.props.navigation.goBack()}>
                        <Icon style={styles.icon} name='arrow-back' />
                    </Button>
                )
            },
        });
        
        return <ButtonBack />
    }
}

export default withNavigation(ButtonBack);