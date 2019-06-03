import React, { Component } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { Button, Icon, Text } from 'native-base';
import { withNavigation } from 'react-navigation';

class ButtonBack extends Component {
    constructor(props) {
        super(props);
    }

    handleClick = () => {
        if(this.props.onClick)
        return this.props.onclick;
        else
        return this.props.navigation.goBack()
    }

    render() {
        const styles = StyleSheet.create({
            icon: {
                color: '#fff',
                fontSize: 25,
            }
        });

        const ButtonBack = Platform.select({
            ios: () => {
                return (
                    <Button transparent onPress={() => this.handleClick()}>
                        <Icon style={styles.icon} name='arrow-back' />
                        <Text style={{ color: '#fff' }}>Back</Text>
                    </Button>
                )
            },
            android: () => {
                return (
                    <Button transparent onPress={() => this.handleClick()}>
                        <Icon style={styles.icon} name='arrow-back' />
                    </Button>
                )
            },
        });
        
        return <ButtonBack />
    }
}

export default withNavigation(ButtonBack);