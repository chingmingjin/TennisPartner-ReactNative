import React from 'react';
import { View, Text } from 'react-native';
import { MessageBubble } from './MessageBubble';

const MessageContainer = (props) => {
    return (
        <View style={{flexDirection: props.isUser ? 'row-reverse' : 'row'}}>
            <MessageBubble
                isShow={props.isShow}
                isUser={props.isUser}
                nickname={props.nickname}
                message={props.message}
                time={props.time}
            />
            <View style={{flexDirection: 'column-reverse', paddingLeft: 4, paddingRight: 4}}>
            </View>
        </View>
    )
}

const styles = {

}

export { MessageContainer };
