// react native
import { Image, StyleSheet, Text, TouchableOpacity } from "react-native";

// project imports
import { activeOpacity, Colors, Sizes } from "../../constants/styles";
import GlobalData from "../../GlobalData/GlobalData";

const FormButton = ({
  text,
  onPress,
  disable = false,
}: {
  text: string;
  onPress: () => void;
  disable?: boolean;
}) => {
  // Global state
  const formLoading = GlobalData((state) => state.formLoading);

  /** Start Main Return **/
  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      onPress={onPress}
      disabled={disable}
      style={{
        ...styles.buttonStyle,
        opacity: disable ? 0.8 : 1,
        backgroundColor: formLoading ? "rgba(0,0,0,0.05)" : Colors.primaryColor,
      }}
    >
      {formLoading ? (
        <Image
          source={require("../../constants/images/loading.gif")}
          style={{ width: 40, height: 40 }}
        />
      ) : (
        <Text style={styles.textStyle}>{text}</Text>
      )}
    </TouchableOpacity>
  );
  /** End Main Return **/
};

export default FormButton;

const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: Colors.primaryColor,
    height: 50,
    borderRadius: Sizes.fixPadding,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: Sizes.fixPadding,
  },
  textStyle: {
    fontSize: 20,
    color: Colors.whiteColor,
    fontWeight: "500",
  },
});
