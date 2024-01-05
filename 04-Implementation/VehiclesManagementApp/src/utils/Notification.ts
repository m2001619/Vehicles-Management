// react native
import { Platform } from "react-native";

// npm packages
import messaging from "@react-native-firebase/messaging";
import { PERMISSIONS } from "react-native-permissions";
import axios from "axios";

// project imports
import ApiConfigs from "../constants/Apiconfigs";
import { askForPermission } from "./Permission";

/** Start Functions **/
export async function getRNFToken(userToken: string) {
  try {
    let isPermission;
    if (Platform.OS === "android") {
      isPermission = await askForPermission(
        PERMISSIONS.ANDROID.POST_NOTIFICATIONS
      );
    } else {
      isPermission = await requestUserPermission();
    }
    if (!isPermission) {
      return;
    }
    const notificationToken = await messaging().getToken();
    await setNotificationToken(notificationToken, userToken);
  } catch (e) {
    console.error("Error in utils / MyNotification / getRNFToken");
  }
}

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission({
    sound: true,
  });
  return (
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL
  );
}

async function setNotificationToken(
  NotificationToken: string,
  userToken: string
) {
  try {
    const res = await axios({
      method: "PATCH",
      url: ApiConfigs.User.setNotificationToken,
      headers: { Authorization: `Bearer ${userToken}` },
      data: {
        token: NotificationToken,
      },
    });
    if (res.status === 200) {
      console.log(res.data.message);
    }
  } catch (e) {
    console.log("Error in utils / Notifications / setNotificationToken");
  }
}
/** End Functions **/
