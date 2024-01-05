import { ReactElement } from "react";

// react native
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

// project imports
import { activeOpacity, Colors, Sizes } from "../../constants/styles";
import { lng } from "../../utils/Translater";

// assets
import Icon from "react-native-vector-icons/AntDesign";

const Header = ({
  title,
  onPress,
  component,
}: {
  title: string;
  onPress: () => void;
  component?: ReactElement;
}) => {
  /** Start Main Return **/
  return (
    <View style={styles.headerContainerStyle}>
      <TouchableOpacity
        activeOpacity={activeOpacity}
        onPress={onPress}
        style={styles.headerIconStyle}
      >
        <Icon
          name={lng === "ar" ? "arrowright" : "arrowleft"}
          size={24}
          color={Colors.blackColor}
        />
      </TouchableOpacity>
      <Text style={styles.headerTextStyle}>{title}</Text>
      {component ? component : null}
    </View>
  );
  /** End Main Return **/
};

export default Header;

const styles = StyleSheet.create({
  headerContainerStyle: {
    height: 70,
    paddingHorizontal: Sizes.fixPadding * 2,
    flexDirection: "row",
    alignItems: "center",
  },
  headerIconStyle: {
    width: 40,
    height: 40,
    borderRadius: 30,
    borderWidth: 0.5,
    borderColor: Colors.grayColor,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTextStyle: {
    flex: 1,
    color: Colors.blackColor,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginRight: Sizes.fixPadding * 2,
  },
});
