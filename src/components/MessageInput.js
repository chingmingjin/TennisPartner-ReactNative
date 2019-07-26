import React from 'react';
import { View, TextInput, Dimensions, Platform } from 'react-native';
import { Icon } from 'react-native-elements';

const d = Dimensions.get('window');
const width = d.width;
const isX = Platform.OS === "ios" && (d.height > 800 || d.width > 800) ? true : false;

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
                                minHeight: 43,
                                width: width - 45
                            },
                            ios: {
                                minHeight: isX ? 45 : 40,
                                width: width - 45
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
        </View>
    )
}

const styles = {
    containerStyle: {
        flexDirection: 'row',
        backgroundColor:'#fff',
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
