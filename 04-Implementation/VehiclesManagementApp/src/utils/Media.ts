// react native
import { Alert } from "react-native";

// npm packages
import {
  ImageLibraryOptions,
  launchImageLibrary,
} from "react-native-image-picker";
import { PERMISSIONS } from "react-native-permissions";

// project imports
import { askForPermission } from "./Permission";

/** Start Functions **/
export const pickImage = async () => {
  const options: ImageLibraryOptions = {
    mediaType: "photo",
    includeBase64: false,
    maxHeight: 2000,
    maxWidth: 2000,
  };

  const isPermission = await askForPermission(
    PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
  );

  if (isPermission) {
    const imagePickerResponse = await launchImageLibrary(
      options,
      (response) => {
        if (response.didCancel) {
          console.log("User cancelled image picker");
        } else if (response.errorCode) {
          console.log("Image picker error: ", response.errorMessage);
        }
      }
    );
    if (imagePickerResponse.assets?.length) {
      return imagePickerResponse.assets[0];
    }
  } else {
    Alert.alert(
      "Waring",
      "The permission to access your local device has blocked, Go to setting and accept it",
      undefined,
      { cancelable: true }
    );
  }

  return null;
};
/** End Functions **/
