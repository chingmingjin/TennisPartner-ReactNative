import React from 'react';
import { View, TextInput, Dimensions, Platform } from 'react-native';
import { Icon } from 'react-native-elements';

const { width } = Dimensions.get('window');

const MessageInput = (props) => {
    return (
        <View style={styles.containerStyle}>
            <View style={styles.inputViewStyle}>
                <TextInput
                    style={{
                        fontSize: 18,
                        color: '#212529',
                        ...Platform.select({
                            android: {
                                minHeight: 60,
                                width: width - 60
                            },
                            ios: {
                                minHeight: 40,
                                width: width - 66
                            },
                        })
                    }}
                    placeholder={'Your message'}
                    autoCapitalize='none'
                    autoCorrect={false}
                    underlineColorAndroid='transparent'
                    value={props.textMessage}
                    onChangeText={props.onChangeText}
                />
            </View>
            <Icon
                name='md-send'
                type='ionicon'
                color={props.textMessage.length > 0 ? '#ffa737' : '#494e57'}
                size={30}
                onPress={props.onRightPress}
            />
        </View>
    )
}

const styles = {
    containerStyle: {
        flexDirection: 'row',
        backgroundColor:'#fff'
    },
    inputViewStyle: {
        paddingLeft: 8,
        paddingRight: 8
    },
    inputStyle: {
        fontSize:13,
        backgroundColor:'#fff'
    },
    sendButton: {
        justifyContent: 'center',
        alignSelf: 'center'
    }
}

export { MessageInput }
