// react native
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// project imports
import { activeOpacity, Colors, Sizes } from "../../constants/styles";

// assets
import Ionicons from "react-native-vector-icons/Ionicons";

// interfaces and types
import { GarageType } from "../../GlobalData/GlobalData";

// constants
const { width } = Dimensions.get("window");

const GarageCard = ({
  item,
  navigation,
}: {
  item: GarageType;
  navigation: any;
}) => {
  // Handler Functions
  const onPress = () => navigation.push("GarageScreen", { item: item });

  /** Start Main Return **/
  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      onPress={onPress}
      style={styles.cardContainerStyle}
    >
      <Image source={{ uri: item.photo }} style={styles.garageImageStyle} />
      <View style={{ marginTop: 5 }}>
        <Text style={styles.garageTitleStyle} numberOfLines={1}>
          {item.name}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons
            name={"location-outline"}
            size={18}
            color={Colors.grayColor}
          />
          <Text style={{ color: Colors.grayColor, marginLeft: 3 }}>
            {item.address}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  /** End Main Return **/
};

export default GarageCard;

const styles = StyleSheet.create({
  cardContainerStyle: {
    width: (width - Sizes.fixPadding * 2) / 2 - Sizes.fixPadding * 2,
    marginHorizontal: Sizes.fixPadding,
  },
  garageImageStyle: {
    height: 100,
    borderTopRightRadius: Sizes.fixPadding,
    borderTopLeftRadius: Sizes.fixPadding,
  },
  garageTitleStyle: {
    fontSize: 16,
    color: Colors.blackColor,
    fontWeight: "500",
    marginBottom: Sizes.fixPadding * 0.5,
  },
});
