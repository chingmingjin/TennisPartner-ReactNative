import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Content } from 'native-base';
import { connect } from 'react-redux';
import { NavigationActions, StackActions } from 'react-navigation';
import {
    sbConnect,
    sbGetChannelTitle
} from '../sendbirdActions';
import * as Progress from 'react-native-progress';
import firebase from 'react-native-firebase';

class StartChat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false
        };
    }

    componentDidMount() {
        const user = firebase.auth().currentUser;
            if (user) {
                this.setState({ isLoading: true }, () => {
                    sbConnect(user.uid)
                        .then(() => {
                            this.setState({ isLoading: false }, () => {
                                console.log(this.props.navigation.getParam('userId', null));
                                console.log(user);
                            });
                        })
                        .catch((err) => {
                            this.setState({ isLoading: false }, () => {
                                this.redirectTo("Login");
                            });
                        });
                });
            } else {
                this.setState({ isLoading: false }, () => {
                    this.redirectTo("Login");
                });
            }
    }

    redirectTo(page, params) {
        this.props.navigation.dispatch(StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: page, params: params })
            ]
        }));
    }
    render() {
        
        return (
            <Content contentContainerStyle={styles.contentCenter}>
                <Progress.Circle visible={this.state.isLoading} style={styles.progressCircle} color="#ffa737" size={50} borderWidth={4} indeterminate={true} />
            </Content>
        );
    }
}

function mapStateToProps({ login }) {
    const { error, user } = login;
    return { error, user };
};

export default connect(mapStateToProps, {})(StartChat);

const styles = StyleSheet.create({
    contentCenter: { 
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1 
    },
    progressCircle: { 
        alignSelf: 'center',
        marginBottom: 10 
      },
      text: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold'
      }
});
