import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { supabase } from "./supabase";
import { Tables } from "../types";

export default async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas.projectId,
      })
    ).data;
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}

// Can use this function below or use Expo's Push Notification Tool from: https://expo.dev/notifications
export async function sendPushNotification(
  expoPushToken: string,
  title: string,
  body: string,
  deeplink?: string
) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title,
    body,
    data: { deeplink },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}

const getUserToken = async (userId: string) => {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  return data?.expo_push_token;
};
const getAllAdminTokens = async () => {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("group", "ADMIN");
  const tokens = data?.map((user) => user?.expo_push_token);
  return tokens;
};

//! Notifying the user when order status is changed
export const notifyUserAboutOrderUpdate = async (order: Tables<"orders">) => {
  const token = await getUserToken(order.user_id);
  let title = `Order #${order.id} Updated`;
  let body = '';

  switch (order.status) {
    case 'Cooking':
      body = 'Your delicious meal is now being prepared. Thank you for choosing us!';
      break;
    case 'Delivering':
      body = 'Your order is on its way to you. Get ready to indulge!';
      break;
    case 'Delivered':
      body = 'Your order has been delivered. Bon appétit! We hope you enjoy your meal!';
      break;
    default:
      body = `Your order is now in ${order.status} status. Thank you for your patience and understanding.`;
      break;
  }

  if (token) {
    sendPushNotification(token, title, body, `/user/orders/${order.id}`);
  }
};

//! Notifying all the admins when new order is created
export const notfiyAdminWhenOrderIsCreated = async (
  order: Tables<"orders">
) => {
  const tokens = await getAllAdminTokens();
  tokens?.forEach((token) => {
    const title = `New Order Arrived`;
    const body = `A new order has been placed. Please review the details below:\nOrder Number: #${order.id}\nTotal Amount: ₹${order.total}
\nThank you for your attention.`;
    if (token) {
      sendPushNotification(token, title, body, `/user/orders/${order?.id}`);
    }
  });
};
