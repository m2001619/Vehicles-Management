// react native
import { Alert, Platform } from "react-native";

// npm packages
import Geolocation from "react-native-geolocation-service";

// packages imports
import { askForPermission } from "./Permission";
import { socket } from "../constants/Apiconfigs";

/** Start Functions **/
export const getCurrentLocation = async (
  updateLocation: ({
    latitude,
    longitude,
  }: {
    latitude: number;
    longitude: number;
  }) => void
) => {
  try {
    let isPermission;
    if (Platform.OS === "android") {
      isPermission = await askForPermission(
        "android.permission.ACCESS_FINE_LOCATION"
      );
    } else {
      isPermission = false;
    }
    if (!isPermission) {
      return;
    }
    Geolocation.watchPosition(
      (position) => {
        updateLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        Alert.alert(error.message.toString());
      },
      {
        showLocationDialog: true,
        enableHighAccuracy: true,
        distanceFilter: 200,
      }
    );
  } catch (e) {
    console.error("Error in utils / Location / getCurrentLocation");
  }
};

export const getLiveLocation = async (
  updateLocation: ({
    latitude,
    longitude,
  }: {
    latitude: number;
    longitude: number;
  }) => void,
  vehicleId: string
) => {
  try {
    let isPermission;
    if (Platform.OS === "android") {
      isPermission = await askForPermission(
        "android.permission.ACCESS_FINE_LOCATION"
      );
    } else {
      isPermission = false;
    }
    if (!isPermission) {
      return;
    }
    Geolocation.watchPosition(
      (position) => {
        socket.emit("UPDATE_VEHICLE_LOCATION", {
          id: vehicleId,
          location: [position.coords.latitude, position.coords.longitude],
        });
        updateLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        Alert.alert(error.message.toString());
      },
      {
        showLocationDialog: true,
        enableHighAccuracy: true,
        distanceFilter: 200,
      }
    );
  } catch (e) {
    console.error("Error in utils / Location / getCurrentLocation");
  }
};
/** End Functions **/
