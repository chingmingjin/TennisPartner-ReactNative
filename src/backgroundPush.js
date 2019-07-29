import firebase from 'react-native-firebase';

export default async (message) => {
  try {
    const payload = JSON.parse(message.data.sendbird);
    const localNotification = new firebase.notifications.Notification({
      show_in_foreground: true
    })
      .android.setChannelId('app.tennispartner.chat')
      .android.setSmallIcon(require('./images/rackets.png'))
      .android.setLargeIcon(payload.sender.profile_url)
      .android.setPriority(firebase.notifications.Android.Priority.High)
      .setNotificationId(payload.channel.channel_url)
      .setTitle(payload.sender.name)
      .setSubtitle(payload.unread_message_count + ' messages')
      .setBody(payload.message)
      .setData(payload);
    return firebase.notifications().displayNotification(localNotification);
  } catch (e) {
    return Promise.resolve();
  }
}