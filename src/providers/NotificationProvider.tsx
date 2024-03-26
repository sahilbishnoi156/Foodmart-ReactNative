import React, { PropsWithChildren } from "react";
import registerForPushNotificationsAsync from "../lib/notifications";
import * as Notifications from "expo-notifications";
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthProvider";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const NotificationProvider = ({ children }: PropsWithChildren) => {
  //! Getting user
  const { profile } = useAuth();
  //!Local states
  const [expoPushToken, setExpoPushToken] = React.useState<
    string | undefined
  >();
  const [notification, setNotification] =
    React.useState<Notifications.Notification>();
  const notificationListener = React.useRef<Notifications.Subscription>();
  const responseListener = React.useRef<Notifications.Subscription>();

  //! Save push notification
  const savePushToken = async (newToken: string | undefined) => {
    setExpoPushToken(newToken);
    if (!newToken) return;

    // update to database
    const {data, error} = await supabase
      .from("profiles")
      .update({ expo_push_token: newToken })
      .eq("id", profile?.id!).single();
  };

  //! Notification listener
  React.useEffect(() => {
    registerForPushNotificationsAsync().then((token) => savePushToken(token));

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        // console.log(response);
      });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);
  return <>{children}</>;
};
