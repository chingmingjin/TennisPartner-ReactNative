import React from 'react';
import { View, TextInput, Dimensions, Platform, KeyboardAvoidingView } from 'react-native';
import { Icon } from 'react-native-elements';

const { width } = Dimensions.get('window');

const MessageInput = (props) => {
    return (
        <KeyboardAvoidingView style={styles.containerStyle}>
            <View style={styles.inputViewStyle}>
                <TextInput
                    style={{
                        fontSize: 18,
                        color: '#212529',
                        ...Platform.select({
                            android: {
                                minHeight: 40,
                                width: width - 45
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
                    autoFocus={true}
                    underlineColorAndroid='transparent'
                    value={props.textMessage}
                    onChangeText={props.onChangeText}
                />
            </View>
            <Icon
                containerStyle={{ justifyContent: 'center', alignItems: 'flex-end' }}
                name='md-send'
                type='ionicon'
                color={props.textMessage.length > 0 ? '#ffa737' : '#494e57'}
                size={30}
                onPress={props.onRightPress}
            />
        </KeyboardAvoidingView>
    )
}

const styles = {
    containerStyle: {
        borderTopWidth: 1,
        borderTopColor: '#EEE',
        flexDirection: 'row',
        backgroundColor:'#fff',
        position: 'absolute',
        bottom: 0
    },
    inputViewStyle: {
        paddingLeft: 8
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
