// react native
import { Image, StyleSheet, View } from "react-native";

// project imports
import { Colors } from "../../constants/styles";

const SectionLoading = ({ isLoading }: { isLoading: boolean }) => {
  /** Start Main Return **/
  return (
    <View
      style={{ ...styles.loadingStyle, display: isLoading ? "flex" : "none" }}
    >
      <Image
        source={require("../../constants/images/loading.gif")}
        style={{ width: 100, height: 100 }}
      />
    </View>
  );
  /** End Main Return **/
};

export default SectionLoading;

const styles = StyleSheet.create({
  loadingStyle: {
    backgroundColor: Colors.whiteColor,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
