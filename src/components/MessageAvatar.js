import React from 'react';
import { View } from 'react-native';
import { Avatar } from 'react-native-elements';

const _renderAvatar = (isShow, uri, nickname, onImagePress) => {
    if (!isShow) {
        uri = '';
    }

    return uri ? (
        <Avatar 
            small
            rounded
            title={nickname[0]}
            source={!uri ? '' : { uri } }
            onPress={onImagePress}
        />
    ) : null;
}

const MessageAvatar = (props) => {
    return (
        <View style={styles.viewStyle}>
            {_renderAvatar(props.isShow, props.uri, props.nickname, props.onPress)}
        </View>
    )
}

const styles = {
    viewStyle: {
        backgroundColor: 'transparent',
        marginRight: 8,
        width: 34,
        height: 34,
        alignSelf: 'flex-end'
    }
}

export { MessageAvatar };
