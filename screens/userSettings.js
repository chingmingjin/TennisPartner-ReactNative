import React, { Component } from "react";
import { View, SectionList, Image, Text, StyleSheet, Platform } from "react-native";
import { ListItem, Left, Icon } from "native-base";

export default class UserSettings extends Component {
  render() {
    const styles = StyleSheet.create({
      navigationView: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
      },
      header: {
        backgroundColor: '#ffa737',
        paddingTop: 20,
        paddingBottom: 20,
        alignItems: 'center'
      },
      profileImg: {
        height: 90,
        width: 90,
        borderRadius: 40,
      },
      userName: {
        fontSize: 22,
        color: 'white',
        paddingTop: 8
      },
      sectionHeader: {
        paddingTop: 2,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 2,
        fontSize: 14,
        fontWeight: 'bold',
        backgroundColor: 'rgba(247,247,247,1.0)',
      },
      text: {
        fontWeight: Platform.OS === "ios" ? "500" : "400",
        fontSize: 16,
        marginLeft: 20
      },
    });
    return (
      <View style={styles.navigationView}>
          <View style={styles.header}>
            <Image source={require('../images/user.png')} style={styles.profileImg} />
            <Text style={styles.userName}>Sign in</Text>
          </View>
          <SectionList
            sections={[
              {title: 'Info', data: ['Invite friends', 'About'], icon: ['share-alt', 'info-circle']},
              {title: 'User', data: ['My Games', 'Logout'], icon: ['game', 'sign-out-alt']},
            ]}
            renderItem={({item, index, section }) =>
            <ListItem button noBorder>
            <Left>
              <Icon active type='FontAwesome5' name={section.icon[index]} style={{ color: "#888", fontSize: 22, width: 30 }} />
              <Text style={styles.text}>{item}</Text>
            </Left>
            </ListItem>}
            renderSectionHeader={({section}) => <Text style={styles.sectionHeader}>{section.title}</Text>}
            keyExtractor={(item, index) => index}
          />
        </View>
    );
  }
}