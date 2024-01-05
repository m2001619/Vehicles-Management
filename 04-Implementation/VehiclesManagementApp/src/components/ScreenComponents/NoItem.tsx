// react native
import { Dimensions, Text, View } from "react-native";

// third party packages
import { useTranslation } from "react-i18next";

// project imports
import { Colors } from "../../constants/styles";

// constants
const { width } = Dimensions.get("window");

const NoItem = () => {
  const { t } = useTranslation();

  /** Start Main Return **/
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        minHeight: 150,
        width,
      }}
    >
      <Text
        style={{ fontSize: 18, fontWeight: "bold", color: Colors.blackColor }}
      >
        {t("No Item Found")}
      </Text>
    </View>
  );
  /** End Main Return **/
};

export default NoItem;
