// npm packages
import admin from "firebase-admin";
import { Message } from "firebase-admin/lib/messaging";

// models
import UserModel from "../models/userModel";

// Initialize the Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(require("../firebase-adminsdk.json")),
});

/** Start Functions **/
// Send a push notification to a React Native app
export const sendNotificationToUser = async (
  deviceToken: string,
  data: { title: string; body: string }
) => {
  const message: Message = {
    notification: {
      title: data.title,
      body: data.body,
    },
    android: {
      notification: {
        icon: "stock_ticker_update",
        color: "#7e55c3",
      },
    },
    token: deviceToken,
  };

  try {
    await admin.messaging().send(message);
  } catch (e) {
    console.log(e);
    console.log("Error in Send Notification");
  }
};

// Send a push notification to a React.js web app
export const sendNotificationToAdmin = async (notification: {
  title: string;
  body: string;
}) => {
  const adminData = await UserModel.findOne({ role: "admin" });
  const message: Message = {
    notification,
    webpush: {
      notification: {
        icon: "path/to/notification-icon.png",
      },
    },
    token: adminData.notificationToken,
  };

  try {
    await admin.messaging().send(message);
  } catch (e) {
    console.log(e);
  }
};
/** End Functions **/
