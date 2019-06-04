import React, { Component } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { Button, Icon, Text } from 'native-base';
import { withNavigation } from 'react-navigation';

class ButtonBack extends Component {
    constructor(props) {
        super(props);
    }

    handleClick = () => {
        console.log(this.props.onclick);
        if(this.props.click)
        return this.props.click;
        else
        return this.props.navigation.goBack()
    }

    render() {
        const styles = StyleSheet.create({
            button: {
                alignSelf: 'flex-start'
            },
            icon: {
                color: '#fff',
                fontSize: 25,
                marginRight: 3
            }
        });

        const ButtonBack = Platform.select({
            ios: () => {
                return (
                    <Button style={styles.button} transparent onPress={() => this.handleClick()}>
                        <Icon style={styles.icon} name='arrow-back' />
                        <Text style={{ color: '#fff', paddingLeft: 2, paddingRight: 2 }}>Back</Text>
                    </Button>
                )
            },
            android: () => {
                return (
                    <Button style={styles.button} transparent onPress={() => this.handleClick()}>
                        <Icon style={styles.icon} name='arrow-back' />
                    </Button>
                )
            },
        });
        
        return <ButtonBack />
    }
}

export default withNavigation(ButtonBack);