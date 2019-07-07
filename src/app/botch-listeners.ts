import { Platform } from 'react-native'
import FCM, {
    FCMEvent,
    NotificationType,
    RemoteNotificationResult,
    WillPresentNotificationResult,
} from 'react-native-fcm'
import {NavigationStore} from '../../components/navigation/navigation-store';


// fixme: The integration is not complete, as the preferred method would be to use https://github.com/invertase/react-native-firebase
// Pushes were integrated in a haste for a proof of concept.
export function registerAppListener(navigation: NavigationStore) {
  FCM.on(FCMEvent.Notification, notif => {
    if (Platform.OS === 'ios' && notif._notificationType === NotificationType.WillPresent && !notif.local_notification) {
      notif.finish(WillPresentNotificationResult.All)
      return
    }

    if (notif.opened_from_tray) {
      if (notif.targetScreen === 'chat') {
        setTimeout(() => {
          navigation.navigateTo('Chat')
        }, 500)
      }
    }

    if (Platform.OS === 'ios') {
      switch (notif._notificationType) {
        case NotificationType.Remote:
          notif.finish(RemoteNotificationResult.NewData)
          break
        case NotificationType.NotificationResponse:
          notif.finish()
          break
        case NotificationType.WillPresent:
          notif.finish(WillPresentNotificationResult.All)
          break
      }
    }
  })
}
