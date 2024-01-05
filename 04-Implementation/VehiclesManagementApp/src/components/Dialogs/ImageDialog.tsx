// react native
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// third party packages
import DialogContainer from "react-native-dialog/lib/Container";
import { useTranslation } from "react-i18next";

// project imports
import { activeOpacity, Colors, Sizes } from "../../constants/styles";

const ImageDialog = ({
  show,
  cancelImage,
  uri,
}: {
  show: boolean;
  cancelImage: () => void;
  uri: string;
}) => {
  const { t } = useTranslation();

  /** Start Main Return **/
  return (
    <DialogContainer
      visible={show}
      onBackdropPress={cancelImage}
      contentStyle={styles.imageDialogStyle}
      headerStyle={{ margin: 0.0, padding: 0.0 }}
    >
      <Image source={{ uri }} style={{ flex: 1 }} resizeMode={"stretch"} />
      <View
        style={{
          padding: Sizes.fixPadding,
          backgroundColor: "rgba(0,0,0,0.2)",
        }}
      >
        <TouchableOpacity
          activeOpacity={activeOpacity}
          onPress={cancelImage}
          style={{
            ...styles.buttonStyle,
            backgroundColor: Colors.primaryColor,
          }}
        >
          <Text style={styles.buttonTextStyle}>{t("Close")}</Text>
        </TouchableOpacity>
      </View>
    </DialogContainer>
  );
  /** End Main Return **/
};

export default ImageDialog;

const styles = StyleSheet.create({
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
  imageDialogStyle: {
    flex: 1,
    padding: 0,
    position: "relative",
  },
});
