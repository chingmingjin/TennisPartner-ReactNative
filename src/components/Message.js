import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import { MessageAvatar } from './MessageAvatar';
import { MessageContainer } from './MessageContainer';

class Message extends Component {
    constructor(props) {
        super(props);
    }

    _renderMessageAvatar = () => {
        return this.props.isUser ? null : (
            <MessageAvatar 
                isShow={this.props.isShow}
                uri={this.props.profileUrl}
                nickname={this.props.nickname}
                onPress={this.props.onPress}
            />
        )
    }

    _renderUnreadCount = (readCount) => {
        return readCount ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end' }}>
                <Icon size={12} name='done' color='#878d99' />
                <Text style={{ fontSize: 12, color: '#878d99', marginEnd: 4 }}>Seen</Text>
            </View>
        ) : null;
    }
    

    render() {
        return (
             <View style={styles.messageViewStyle}>
                <View style={{flexDirection: this.props.isUser ? 'row-reverse' : 'row', paddingLeft: 14, paddingRight: 14, paddingTop: 4, paddingBottom: 4}}>
                    { this._renderMessageAvatar() }
                    <View>
                    {this.props.isShow && (
                    <Text style={{ color: '#878d99', fontSize: 12, marginBottom: 4 }}>{ this.props.isUser || !this.props.isShow ? null : this.props.nickname }</Text>
                    )}
                    <MessageContainer 
                        isShow={this.props.isShow}
                        isUser={this.props.isUser}
                        nickname={this.props.nickname}
                        message={this.props.message}
                        time={this.props.time}
                    />
                    { this.props.isUser ? this._renderUnreadCount(this.props.readCount) : null }
                    </View>
                </View>
            </View>
        )
    }
}

const AdminMessage = (props) => {
    return (
        <View style={[
                styles.messageViewStyle, 
                {
                    padding: 8, 
                    marginTop: 8, 
                    marginBottom: 8, 
                    marginLeft: 14,
                    marginRight: 14,
                    backgroundColor: '#e6e9f0'
                },
            ]}>
            <Text>{ props.message }</Text>
        </View>
    )
}

const styles = {
    messageViewStyle: {
        transform: [{ scaleY: -1 }]
    }
};

export { Message, AdminMessage };
