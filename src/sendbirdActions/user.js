import SendBird from 'sendbird';
import {
    Platform,
    AsyncStorage
} from 'react-native';
import firebase from 'react-native-firebase';

const APP_ID = '42C504AB-D68E-4636-8C4B-A766E513DB44';

export const sbRegisterPushToken = () => {
    return new Promise((resolve, reject) => {
        const sb = SendBird.getInstance();
        if(sb) {
            if(Platform.OS === 'ios') {
                // WARNING! FCM token doesn't work in request to APNs.
                // Use APNs token here instead.
                firebase.messaging().ios.getAPNSToken()
                    .then(token => {
                        if(token) {
                            sb.registerAPNSPushTokenForCurrentUser(token, (result, error) => {
                                if(!error) {
                                    resolve();
                                }
                                else reject(error);
                            });
                        } else {
                            resolve();
                        }
                    })
                    .catch(error => {
                        reject(error);
                    });
            } else {
                firebase.messaging().getToken()
                    .then(token => {
                        console.log('Token:', token)
                        if (token) {
                            sb.registerGCMPushTokenForCurrentUser(token, (result, error) => {
                                if(!error) {
                                    resolve();
                                }
                                else reject(error);
                            });
                        } else {
                            resolve();
                        }
                    })
                    .catch(error => {
                        reject(error);
                    });
            }
        } else {
            reject('SendBird is not initialized');
        }
    });
};
export const sbUnregisterPushToken = () => {
    return new Promise((resolve, reject) => {
        firebase.messaging().getToken()
            .then(token => {
                const sb = SendBird.getInstance();
                if(sb) {
                    if(Platform.OS === 'ios') {
                        firebase.messaging().ios.getAPNSToken()
                            .then(token => {
                                sb.unregisterAPNSPushTokenForCurrentUser(token, (result, error) => {
                                    if(!error) {
                                        resolve();
                                    }
                                    else reject(error);
                                });
                            })
                            .catch(err => reject(err));
                    } else {
                        sb.unregisterGCMPushTokenForCurrentUser(token, (result, error) => {
                            if(!error) {
                                resolve();
                            }
                            else reject(error);
                        });
                    }
                } else {
                    reject('SendBird is not initialized');
                }
            })
            .catch(err => reject(err));
    });
};

export const sbConnect = (userId) => {
    return new Promise((resolve, reject) => {
        if (!userId) {
            reject('UserID is required.');
            return;
        }
        const sb = new SendBird({'appId': APP_ID});
        sb.connect(userId, (user, error) => {
            if (error) {
                reject('SendBird Login Failed.');
            } else {
                resolve(user);
            }
        })
    })
};

export const sbUpdateProfile = (nickname, avatarUrl) => {
    return new Promise((resolve, reject) => {
        if (!nickname) {
            reject('Nickname is required.');
            return;
        }
        if (!avatarUrl) {
            reject('mage is required.');
            return;
        }
        let sb = SendBird.getInstance();
        if(!sb) sb = new SendBird({'appId': APP_ID});
        sb.updateCurrentUserInfo(nickname, avatarUrl, (user, error) => {
            if (error) {
                reject('Update profile failed.')
            } else {
                resolve(user);
            }
        })
    })
}

export const sbDisconnect = () => {
    return new Promise((resolve, reject) => {
        const sb = SendBird.getInstance();
        if (sb) {
            sb.disconnect(() => {
                resolve(null);
            });
        } else {
            resolve(null);
        }
    })
}

export const sbGetCurrentInfo = () => {
    const sb = SendBird.getInstance();
    if(sb.currentUser) {
        return {
            profileUrl: sb.currentUser.profileUrl,
            nickname: sb.currentUser.nickname
        }
    }
    return {};
}

export const sbUserBlock = (blockUserId) => {
    return new Promise((resolve, reject) => {
        const sb = SendBird.getInstance();
        sb.blockUserWithUserId(blockUserId, (user, error) => {
            if (error) {
                reject(error);
            } else {
                resolve(user);
            }
        })
    });
}

export const sbUserUnblock = (unblockUserId) => {
    return new Promise((resolve, reject) => {
        const sb = SendBird.getInstance();
        sb.unblockUserWithUserId(unblockUserId, (user, error) => {
            if (error) {
                reject(error);
            } else {
                resolve(user);
            }
        })
    });
}

export const sbCreateBlockedUserListQuery = () => {
    const sb = SendBird.getInstance();
    return sb.createBlockedUserListQuery();
}

export const sbGetBlockUserList = (blockedUserListQuery) => {
    return new Promise((resolve, reject) => {
        blockedUserListQuery.next((blockedUsers, error) => {
            if (error) {
                reject(error);
            } else {
                resolve(blockedUsers);
            }
        });
    });
}
