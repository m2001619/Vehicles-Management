import { useLayoutEffect, useState } from "react";

// react native
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// third party packages
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useTranslation } from "react-i18next";

// project imports
import { activeOpacity, Colors, Sizes } from "../../constants/styles";
import { pickImage } from "../../utils/Media";
import ImageDialog from "../Dialogs/ImageDialog";

// assets
import Ionicons from "react-native-vector-icons/Ionicons";

// interfaces and types
import { Asset } from "react-native-image-picker/src/types";

type UseStateType = {
  file: Asset | null;
  showImage: boolean;
};

// constants
const { width } = Dimensions.get("window");

const UploadImage = ({
  setImage,
  imageFile = null,
}: {
  setImage: (file: Asset) => void;
  imageFile: Asset | null;
}) => {
  const { t } = useTranslation();

  // Local state
  const [state, setState] = useState<UseStateType>({
    showImage: false,
    file: imageFile,
  });
  const { showImage, file } = state;
  const updateState = (data: any) =>
    setState((prevState) => ({ ...prevState, ...data }));

  // Handler functions
  const onPress = async () => updateState({ file: await pickImage() });
  const cancelImage = () => updateState({ showImage: false });

  useLayoutEffect(() => {
    if (file) {
      setImage(file);
    } else {
      setImage({});
    }
  }, [file]);

  /** Start Main Return **/
  return (
    <View>
      {file ? ImageFound() : ImageNotFound()}
      {file?.uri && (
        <ImageDialog
          show={showImage}
          uri={file?.uri}
          cancelImage={cancelImage}
        />
      )}
    </View>
  );

  /** End Main Return **/

  /** Start Component Functions **/
  function ImageFound() {
    const onDelete = () => updateState({ file: null });
    const onView = () => updateState({ showImage: true });

    return (
      <View style={styles.uploadContainerStyle}>
        <View
          style={{ ...styles.cloudIconStyle, borderColor: Colors.greenColor }}
        >
          <Ionicons name="checkmark" size={28} color={Colors.greenColor} />
        </View>
        <Text style={{ ...styles.uploadTextStyle, color: Colors.greenColor }}>
          {t("Image Uploaded Successfully")}
        </Text>
        <View style={styles.buttonContainerStyle}>
          <TouchableOpacity
            activeOpacity={activeOpacity}
            onPress={onDelete}
            style={{
              ...styles.buttonStyle,
              backgroundColor: Colors.errorColor,
            }}
          >
            <Text style={styles.buttonTextStyle}>{t("Delete")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={activeOpacity}
            onPress={onView}
            style={{
              ...styles.buttonStyle,
              backgroundColor: Colors.primaryColor,
            }}
          >
            <Text style={styles.buttonTextStyle}>{t("View")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function ImageNotFound() {
    return (
      <TouchableOpacity
        activeOpacity={activeOpacity}
        onPress={onPress}
        style={styles.uploadContainerStyle}
      >
        <View
          style={{ ...styles.cloudIconStyle, borderColor: Colors.grayColor }}
        >
          <MaterialCommunityIcons
            name={"cloud-upload"}
            size={28}
            color={Colors.grayColor}
          />
        </View>
        <Text style={{ ...styles.uploadTextStyle, color: Colors.grayColor }}>
          {t("Image Uploaded Successfully")}
        </Text>
      </TouchableOpacity>
    );
  }

  /** End Component Functions **/
};

export default UploadImage;

const styles = StyleSheet.create({
  uploadContainerStyle: {
    height: width / 2,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Sizes.fixPadding,
    borderWidth: 1.5,
    borderColor: Colors.grayColor,
    borderStyle: "dashed",
  },
  cloudIconStyle: {
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 35,
    borderWidth: 1.5,
  },
  uploadTextStyle: {
    marginTop: Sizes.fixPadding,
    fontWeight: "500",
  },
  buttonContainerStyle: {
    marginTop: Sizes.fixPadding * 3,
    marginHorizontal: Sizes.fixPadding,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: width / 2,
  },
  buttonStyle: {
    padding: Sizes.fixPadding,
    borderRadius: 5,
    minWidth: 80,
  },
  buttonTextStyle: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.whiteColor,
    textAlign: "center",
  },
});
