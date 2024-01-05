// react native
import {
  Dimensions,
  Image,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// third party packages
import { useTranslation } from "react-i18next";

// project imports
import { activeOpacity, Colors, Sizes } from "../../constants/styles";

// assets
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

// interfaces and types
import { ImageSourcePropType } from "react-native/Libraries/Image/Image";
import { VehicleType } from "../../GlobalData/GlobalData";

// constants
const { width } = Dimensions.get("window");

const VehicleCard = ({
  item,
  navigation,
  style,
}: {
  item: VehicleType;
  navigation: any;
  style?: StyleProp<any>;
}) => {
  const { t } = useTranslation();

  // navigations route params
  const { images, make, year, model, garage, numSeats } = item;
  const imageSource: ImageSourcePropType =
    images.length === 0
      ? require("../../constants/images/authIcon.png")
      : { uri: images[0] };

  // Handler functions
  const onPress = () =>
    navigation.push("VehicleScreen", { item: item, garageInfo: garage });

  /** Start Main Return **/
  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      style={{ ...styles.vehicleCardStyle, ...style }}
      onPress={onPress}
    >
      <Image source={imageSource} style={styles.vehicleImageStyle} />
      <View style={styles.vehicleCardInfoStyle}>
        <Text style={styles.vehicleCardTitleStyle} numberOfLines={1}>
          {make} {model} {year}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons
            name={"location-outline"}
            size={18}
            color={Colors.grayColor}
          />
          <Text style={{ color: Colors.grayColor, marginLeft: 3 }}>
            {garage.name}
          </Text>
        </View>
        <View style={styles.vehicleCardSeatStyle}>
          <MaterialIcons
            name="event-seat"
            size={18}
            color={Colors.primaryColor}
          />
          <Text style={styles.vehicleCardSeatTextStyle}>
            {numSeats} {t("Seats")}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  /** End Main Return **/
};

export default VehicleCard;

const styles = StyleSheet.create({
  vehicleCardStyle: {
    width: width / 2 - Sizes.fixPadding * 2,
    height: 250,
    marginHorizontal: Sizes.fixPadding,
    borderRadius: Sizes.fixPadding * 2,
  },
  vehicleImageStyle: {
    flex: 1,
    borderTopRightRadius: Sizes.fixPadding * 2,
    borderTopLeftRadius: Sizes.fixPadding * 2,
  },
  vehicleCardInfoStyle: {
    backgroundColor: Colors.bodyColor,
    borderBottomRightRadius: Sizes.fixPadding * 2,
    borderBottomLeftRadius: Sizes.fixPadding * 2,
    paddingHorizontal: Sizes.fixPadding * 0.5,
    paddingVertical: Sizes.fixPadding,
  },
  vehicleCardTitleStyle: {
    fontSize: 16,
    color: Colors.blackColor,
    fontWeight: "500",
    marginBottom: Sizes.fixPadding * 0.5,
  },
  vehicleCardSeatStyle: {
    marginVertical: Sizes.fixPadding,
    flexDirection: "row",
    alignItems: "center",
  },
  vehicleCardSeatTextStyle: {
    marginLeft: 5,
    fontSize: 14,
    color: Colors.blackColor,
    fontWeight: "500",
  },
});
