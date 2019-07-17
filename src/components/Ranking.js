import React, { Component } from "react";
import { FlatList, View, Text, Platform, StyleSheet } from 'react-native';
import { Content, Icon } from 'native-base';
import { ButtonGroup, ListItem } from 'react-native-elements';
import * as Progress from 'react-native-progress';
import firebase from 'react-native-firebase';

import { withNavigation } from 'react-navigation';

class Ranking extends Component {
    constructor(props) {
        super(props);

        this.state = {
            players: [],
            loading: true,
            noPlayersNearby: false,
            user: null,
            selectedIndex: 0
        };

        this.updateIndex = this.updateIndex.bind(this)
    }

    componentDidMount() {
        this.unsubscribe = firebase.auth().onAuthStateChanged((user) => {
            if (user) this.setState({ user: user, loading: true }, () => this.getRankings());
            else this.setState({ user: null, loading: true }, () => this.getRankings());
        });
    }

    componentWillUnmount() {
        if (this.unsubscribe) this.unsubscribe();
    }

    updateIndex(selectedIndex) {
        this.setState({ selectedIndex })
    }

    getRankings = () => {
        const { placeId } = this.props;

        // Create a GeoCollection reference
        const players = firebase.firestore().collection('players');

        // Create a GeoQuery based on a location
        const query = players.where("cities", "array-contains", placeId);

        // Get query (as Promise)
        query.get().then((snapshot) => {
            if (!snapshot.empty) {
                var players = [];
                snapshot.docs.forEach(doc => {
                    const { firstName, lastName, gender, birthday, avatarUrl } = doc.data();
                    players.push({
                        key: doc.id,
                        doc, // DocumentSnapshot
                        firstName,
                        lastName,
                        gender,
                        birthday,
                        avatarUrl
                    });
                });
            } else this.setState({ noPlayersNearby: true });

            this.setState({
                players,
                loading: false,
            });
        });
    }

    keyExtractor = (item, index) => index.toString()

    renderItem = ({ item }) => (
        <ListItem
            title={item.firstName + ' ' + item.lastName}
            leftAvatar={{
                source: item.avatarUrl && { uri: item.avatarUrl },
                title: item.firstName[0] + item.lastName[0]
            }}
        />
    )

    render() {
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
            noPlayersView: {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            },
            text: {
                textAlign: 'center',
                fontSize: 18,
            }
        });

        const buttons = [this.props.city, this.props.country];
        const { selectedIndex } = this.state;

        if (this.state.loading) {
            return (
                <Content contentContainerStyle={styles.contentCenter}>
                    <Progress.Circle style={styles.progressCircle} color="#ffa737" size={50} borderWidth={4} indeterminate={true} />
                    <Text style={styles.text}>Loading rankings...</Text>
                </Content>
            )
        }
        if (!this.state.noPlayersNearby)
            return (
                <Content>
                    <View style={{ flex: 1 }}>
                        <ButtonGroup
                            onPress={this.updateIndex}
                            selectedIndex={selectedIndex}
                            buttons={buttons}
                            containerStyle={{ height: 35 }}
                        />
                        <FlatList
                            keyExtractor={this.keyExtractor}
                            data={this.state.players}
                            renderItem={this.renderItem}
                        />
                    </View>
                </Content>);
        else
            return (
                <Content contentContainerStyle={styles.contentCenter}>
                    <Icon style={{ fontSize: 50, marginBottom: 10 }} type="FontAwesome5" name="frown" />
                    <Text style={styles.text}>There are currently no players in {this.props.city}</Text>
                </Content>);
    }
}
export default withNavigation(Ranking);