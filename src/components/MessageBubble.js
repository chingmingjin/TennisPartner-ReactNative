import React from 'react';
import { View, Text } from 'react-native';
import color from "color";

const _renderNickname = (nickname) => {
    return nickname ? (
        <Text style={{fontSize: 9, color: '#7048e8', paddingBottom: 4}}>{nickname}</Text>
    ) : null;
}

const MessageBubble = (props) => {
    return (
        <View style={{maxWidth: 250, padding: 8, borderRadius: 8, 
        backgroundColor: props.isUser ? color('#1976d2').darken(0.03).hex() : '#e6e6e6'}}>
            { props.isUser || !props.isShow ? null : _renderNickname(props.nickname) }
            <View>
                {props.message}
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'flex-end', paddingLeft: 8}}>
                <Text style={{fontSize: 8, color: props.isUser ? '#E9EBEF' : '#878d99'}}>{props.time}</Text>
            </View>
        </View>
    )
}

const styles = {

}

export { MessageBubble };
