import {
  PushNotifications,
  type ActionPerformed,
  type PushNotificationSchema,
  type Token,
} from "@capacitor/push-notifications";

import api from "../api/api";

const APP_ID = "com.rediq.investment";
const CHANNEL_ID = "rediq_default";

let initialized = false;

async function registerDevice(token: string): Promise<void> {
  try {
    await api.post("/investment/notifications/devices", {
      token,
      platform: "android",
      app_id: APP_ID,
    });

    console.info("[Push] Device registered with backend");
  } catch (error) {
    console.error("[Push] Failed to register device", error);
  }
}

export async function initializePushNotifications(): Promise<void> {
  if (initialized) {
    return;
  }

  try {
    const permission = await PushNotifications.checkPermissions();

    let permissionStatus = permission.receive;

    if (permissionStatus !== "granted") {
      const requested = await PushNotifications.requestPermissions();
      permissionStatus = requested.receive;
    }

    if (permissionStatus !== "granted") {
      console.warn("[Push] Notification permission was not granted");
      return;
    }

    await PushNotifications.createChannel({
      id: CHANNEL_ID,
      name: "REDIQ Notifications",
      description: "REDIQ account and investment notifications",
      importance: 5,
      visibility: 1,
      sound: "default",
      vibration: true,
      lights: true,
    });

    await PushNotifications.addListener(
      "registration",
      async (token: Token) => {
        console.info("[Push] FCM registration received");
        await registerDevice(token.value);
      }
    );

    await PushNotifications.addListener("registrationError", (error) => {
      console.error("[Push] Registration error", error);
    });

    await PushNotifications.addListener(
      "pushNotificationReceived",
      (notification: PushNotificationSchema) => {
        console.info("[Push] Notification received", notification);
      }
    );

    await PushNotifications.addListener(
      "pushNotificationActionPerformed",
      (action: ActionPerformed) => {
        console.info("[Push] Notification action", action);
      }
    );

    await PushNotifications.register();

    initialized = true;
    console.info("[Push] Registration started");
  } catch (error) {
    initialized = false;
    console.error("[Push] Initialization failed", error);
  }
}
