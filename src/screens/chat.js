import React, { Component } from 'react';
import { Dimensions, View, FlatList, Text, Alert, Platform, Image, KeyboardAvoidingView } from "react-native";
import { Container, Left, Right, Body, Title, StyleProvider } from "native-base";
import { Header, Avatar, Badge } from 'react-native-elements'
import firebase from 'react-native-firebase'
import color from "color";
import ButtonBack from "../components/ButtonBack";
import getTheme from '../../native-base-theme/components';
import commonColor from '../../native-base-theme/variables/commonColor';
import * as Progress from 'react-native-progress';
import { connect } from 'react-redux';
import {
  openChannelProgress,
  groupChannelProgress,
  initChatScreen,
  getChannelTitle,
  createChatHandler,
  onSendButtonPress,
  getPrevMessageList,
  onUserBlockPress,
  onFileButtonPress,
  typingStart,
  typingEnd,
  channelExit
} from "../actions";
import { Button, Spinner, TextItem, FileItem, MessageInput, Message, AdminMessage } from "../components";
import { BarIndicator } from "react-native-indicators";
import { sbCreateGroupChannel, sbCreatePreviousMessageListQuery, sbAdjustMessageList, sbIsImageMessage, sbMarkAsRead, sbRegisterPushToken } from "../sendbirdActions";

const d = Dimensions.get("window");
const isX = Platform.OS === "ios" && (d.height > 800 || d.width > 800) ? true : false;


class Chat extends Component {
  constructor(props) {
    super(props);
    this.flatList = null;
    this.state = {
      channel: null,
      isLoading: true,
      previousMessageListQuery: null,
      textMessage: ""
    };
  }

  componentDidMount() {
    this.props.initChatScreen();
    const { navigation } = this.props;
    var userIds = [
      navigation.getParam('userId', '0'),
      navigation.getParam('otherUserId', '0').trim()
    ];
    sbCreateGroupChannel(userIds, true).then(channel => {
      this.setState({ channel }, () => this._componentInit())
      firebase.messaging().hasPermission()
        .then(enabled => {
          if (enabled) {
            sbRegisterPushToken()
          } else {
            firebase.messaging().requestPermission()
              .then(() => {
              })
              .catch(error => {
              });
          }
        });
    }).catch(
      (error) => console.error(error)
    );
  }

  componentDidUpdate() {
    const { channel } = this.state;
    if (channel) {
      this.state.textMessage ? this.props.typingStart(channel.url) : this.props.typingEnd(channel.url);
    }
  }

  componentWillReceiveProps(props) {
    const { list, exit } = props;

    if (list !== this.props.list) {
      this.setState({ isLoading: false });
    }

    if (exit) {
      this.setState({ isLoading: false }, () => {
        this.props.navigation.goBack();
      });
    }
  }

  _componentInit = () => {
    const { channel } = this.state;
    const channelUrl = channel.url;
    this.props.groupChannelProgress(false);
    this.props.getChannelTitle(channelUrl, false);
    this.props.createChatHandler(channelUrl, false);
    this._getMessageList(true);
    sbMarkAsRead({
      channelUrl,
      channel
    });
  };

  _onTextMessageChanged = textMessage => {
    this.setState({ textMessage });
  };

  _onUserBlockPress = userId => {
    Alert.alert("User Block", "Are you sure want to block user?", [{ text: "Cancel" }, { text: "OK", onPress: () => this.props.onUserBlockPress(userId) }]);
  };

  _getMessageList = init => {
    if (!this.state.previousMessageListQuery && !init) {
      return;
    }
    const { channel } = this.state;
    this.setState({ isLoading: true }, () => {
      if (init) {
        sbCreatePreviousMessageListQuery(channel.url, false)
          .then(previousMessageListQuery => {
            this.setState({ previousMessageListQuery }, () => {
              this.props.getPrevMessageList(this.state.previousMessageListQuery);
            });
          })
          .catch(error => console.error(error));
      } else {
        this.props.getPrevMessageList(this.state.previousMessageListQuery);
      }
    });
  };

  _onSendButtonPress = () => {
    if (this.state.textMessage) {
      const { textMessage, channel } = this.state;
      this.setState({ textMessage: "" }, () => {
        this.props.onSendButtonPress(channel.url, false, textMessage);
        if (this.props && this.props.list && this.props.list.length > 0) {
          this.flatList.scrollToIndex({
            index: 0,
            viewOffset: 0
          });
        }
      });
    }
  };

  _renderFileMessageItem = rowData => {
    const message = rowData.item;
    if (message.isUserMessage()) {
      return <TextItem isUser={message.isUser} message={message.message} />;
    } else if (sbIsImageMessage(message)) {
      return <ImageItem isUser={message.isUser} message={message.url.replace("http://", "https://")} />;
    } else {
      return <FileItem isUser={message.isUser} message={message.name} />;
    }
  };

  _renderList = rowData => {
    const message = rowData.item;
    const { channel } = this.state;
    if (message.isUserMessage() || message.isFileMessage()) {
      return (
        <Message
          key={message.messageId ? message.messageId : message.reqId}
          isShow={message.sender.isShow}
          isUser={message.isUser}
          profileUrl={message.sender.profileUrl.replace("http://", "https://")}
          onPress={() => this._onUserBlockPress(message.sender.userId)}
          nickname={message.sender.nickname}
          time={message.time}
          readCount={false || channel.getReadReceipt(message) === channel.memberCount}
          message={this._renderFileMessageItem(rowData)}
        />
      );
    } else if (message.isAdminMessage()) {
      return <AdminMessage message={message.message} />;
    } else {
      return <View />;
    }
  };

  _renderTyping = () => {
    return (
      <View style={styles.renderTypingViewStyle}>
        <View style={{ opacity: this.props.typing ? 1 : 0, marginRight: 8 }}>
          <BarIndicator count={4} size={10} animationDuration={900} color="#cbd0da" />
        </View>
        <Text style={{ color: "#cbd0da", fontSize: 10 }}>{this.props.typing}</Text>
      </View>
    );
  };

  _renderTitle = () => {
    const { channel } = this.state;
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start' }}>
        {channel.memberCount === 2 &&
          (<View style={{ flexDirection: 'row' }}>
            <View>
              <Avatar
                containerStyle={{ alignSelf: 'center' }}
                rounded
                source={{
                  uri:
                    this.props.navigation.getParam('avatarUrl', ''),
                }}
                title={this.props.title[0]}
              />
              {this.props.navigation.getParam('state', 'offline') == 'online' && (
                <Badge
                  status="success"
                  badgeStyle={{ width: 12, height: 12, borderRadius: 40 }}
                  containerStyle={{ position: 'absolute', bottom: 4, right: 0 }}
                />)}
            </View>
            <View style={{ marginStart: 8 }}>
              <Text style={{ color: 'white', fontSize: 18 }}>{this.props.title}</Text>
              <Text style={{ color: '#eee', fontSize: 12 }}>active {this.props.navigation.getParam('last_changed', 'unknown')}</Text>
            </View>
          </View>)}
        {channel.memberCount > 2 && (
          <Text style={{ color: 'white', fontSize: 18 }}>{this.props.title}</Text>
        )}
      </View>
    );
  }

  render() {
    const { channel, isLoading } = this.state;
    if (!channel)
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Progress.Circle style={styles.progressCircle} color="#ffa737" size={50} borderWidth={4} indeterminate={true} />
        </View>)
    else
      return (
        <StyleProvider style={getTheme(commonColor)}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : null}
            style={{ flex: 1 }}>
            <Header
              statusBarProps={{
                barStyle: 'light-content',
                backgroundColor: color("#1976d2").darken(0.2).hex()
              }}
              containerStyle={{
                paddingTop: 0,
                paddingLeft: 0,
                backgroundColor: "#1976d2",
                ...Platform.select({
                  ios: {
                    height: isX ? 97 : 64
                  },
                  android: {
                    height: 56
                  }
                })
              }}
              placement="left"
              leftComponent={<ButtonBack />}
              centerComponent={this._renderTitle()}
            />
            <View style={styles.messageListViewStyle}>
              {isLoading && (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <Progress.Circle style={styles.progressCircle} color="#ffa737" size={50} borderWidth={4} indeterminate={true} />
                </View>
              )}
              <FlatList
                ref={elem => this.flatList = elem}
                renderItem={this._renderList}
                data={this.props.list}
                extraData={this.state}
                keyExtractor={(item, index) => item.messageId + ''}
                onEndReached={() => this._getMessageList(false)}
                onEndReachedThreshold={0}
              />
            </View>
            <View style={styles.messageInputViewStyle}>
              {this._renderTyping()}
              <MessageInput
                onRightPress={this._onSendButtonPress}
                textMessage={this.state.textMessage}
                onChangeText={this._onTextMessageChanged}
              />
            </View>
          </KeyboardAvoidingView>
        </StyleProvider>
      )
  }
}

function mapStateToProps({ chat }) {
  let { title, memberCount, list, exit, typing } = chat;
  list = sbAdjustMessageList(list);
  return { title, memberCount, list, exit, typing };
}

export default connect(mapStateToProps, {
  openChannelProgress,
  groupChannelProgress,
  initChatScreen,
  getChannelTitle,
  createChatHandler,
  onSendButtonPress,
  getPrevMessageList,
  onUserBlockPress,
  onFileButtonPress,
  typingStart,
  typingEnd,
  channelExit
})(Chat);

const styles = {
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
  },
  renderTypingViewStyle: {
    flexDirection: "row",
    marginLeft: 14,
    marginRight: 14,
    marginTop: 4,
    marginBottom: 0,
    paddingBottom: 0,
    height: 14
  },
  containerViewStyle: {
    flex: 1
  },
  messageListViewStyle: {
    flex: 10,
    transform: [{ scaleY: -1 }]
  },
  messageInputViewStyle: {
    flex: 1,
    marginBottom: 0,
    paddingBottom: isX ? 35 : 0,
    flexDirection: "column",
    justifyContent: "center"
  }
};
