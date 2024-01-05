import { useEffect, useState } from "react";

// react native
import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// third party packages
import axios from "axios/index";
import { useTranslation } from "react-i18next";

// project imports
import { activeOpacity, Colors, Sizes } from "../../constants/styles";
import GlobalData, {
  GarageType,
  VehicleType,
} from "../../GlobalData/GlobalData";
import ApiConfigs from "../../constants/Apiconfigs";
import { localAlert } from "../../utils/LocalAlert";
import { lng } from "../../utils/Translater";

// assets
import Icon from "react-native-vector-icons/AntDesign";

// constants
const { width, height } = Dimensions.get("window");
const limit = 3;

const GarageScreen = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const { t } = useTranslation();

  // navigation route params
  const garageInfo: GarageType = route.params.item;
  const { photo, name, address, phoneNumber, _id }: GarageType = garageInfo;
  const apiUrl = ApiConfigs.Vehicle.getGarageVehicles + _id;

  // Global state
  const token = GlobalData((state) => state.token);

  // Local state
  const [vehicles, setVehicles] = useState<VehicleType[]>([]);

  // Handler functions
  useEffect(() => {
    getGarage().catch(console.error);
  }, []);

  /** Start Main Return **/
  return (
    <SafeAreaView style={styles.containerStyle}>
      <StatusBar backgroundColor={Colors.primaryColor} />
      {GarageImage()}
      {GarageInfo()}
      <View style={styles.titleLineStyle} />
      {GarageVehicles()}
    </SafeAreaView>
  );
  /** End Main Return **/

  /** Start Component Functions **/
  function GarageVehicles() {
    const onPress = () =>
      navigation.push("ViewAllVehiclesScreen", {
        title: `${name}`,
        apiUrl,
      });
    const renderItem = ({ item }: { item: VehicleType }) => {
      const onPress = () =>
        navigation.push("VehicleScreen", {
          item: item,
          garageInfo: garageInfo,
        });
      return (
        <TouchableOpacity
          activeOpacity={activeOpacity}
          onPress={onPress}
          style={styles.vehContainerStyle}
        >
          <Image
            source={{ uri: item.images[0] }}
            style={styles.vehicleImageStyle}
            resizeMode={"cover"}
          />
          <View style={styles.vehicleTitleContainerStyle}>
            <Text style={styles.vehicleTitleStyle} numberOfLines={2}>
              {item.make} {item.model} {item.year}
            </Text>
          </View>
        </TouchableOpacity>
      );
    };

    return (
      <>
        <View style={styles.altTitleContainerStyle}>
          <Text style={styles.altTitleStyle}>{t("Vehicles")}</Text>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={onPress}
            style={{ display: vehicles.length <= limit ? "none" : "flex" }}
          >
            <Text style={styles.viewAllStyle}>{t("View All")}</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={vehicles}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          numColumns={3}
          contentContainerStyle={{ marginBottom: Sizes.fixPadding * 2 }}
        />
      </>
    );
  }

  function GarageInfo() {
    return (
      <View style={{ marginLeft: Sizes.fixPadding }}>
        <Text style={styles.garageTitleStyle}>{name}</Text>
        <Text
          style={{
            fontWeight: "500",
            fontSize: 15,
            marginBottom: Sizes.fixPadding * 0.5,
          }}
        >
          <Text style={{ color: Colors.blackColor }}>{t("Address")}: </Text>
          <Text style={{ color: Colors.grayColor }}>{address}</Text>
        </Text>
        <Text style={{ fontWeight: "500", fontSize: 15 }}>
          <Text style={{ color: Colors.blackColor }}>
            {t("Phone Number")}:{" "}
          </Text>
          <Text style={{ color: Colors.grayColor }}>{phoneNumber}</Text>
        </Text>
      </View>
    );
  }

  function GarageImage() {
    const onPress = () => navigation.pop();
    return (
      <ImageBackground
        source={{ uri: photo }}
        style={styles.imageStyle}
        resizeMode={"cover"}
        borderRadius={Sizes.fixPadding * 2}
      >
        <TouchableOpacity
          activeOpacity={activeOpacity}
          onPress={onPress}
          style={styles.headerIconStyle}
        >
          <Icon
            name={lng === "ar" ? "arrowright" : "arrowleft"}
            size={22}
            color={Colors.blackColor}
          />
        </TouchableOpacity>
      </ImageBackground>
    );
  }

  /** End Component Functions **/

  /** Start Server Functions **/
  async function getGarage() {
    try {
      const res = await axios({
        method: "GET",
        url: apiUrl,
        headers: { Authorization: `Bearer ${token}` },
        params: {
          limit,
        },
      });
      if (res.status === 200) {
        setVehicles(res.data.data);
      }
    } catch (e) {
      // @ts-ignore
      localAlert(t(e?.response?.data?.message));
      console.log("Error in BottomTabBar / getAllGarages");
    }
  }

  /** End Server Functions **/
};

export default GarageScreen;

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    padding: Sizes.fixPadding * 1.5,
    backgroundColor: Colors.bodyColor,
  },
  imageStyle: {
    width: width - Sizes.fixPadding * 3,
    height: height * 0.5,
    padding: Sizes.fixPadding,
    marginBottom: Sizes.fixPadding * 2,
  },
  headerIconStyle: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: Colors.whiteColor,
    justifyContent: "center",
    alignItems: "center",
  },
  garageTitleStyle: {
    fontSize: 20,
    color: Colors.blackColor,
    fontWeight: "500",
    marginBottom: Sizes.fixPadding,
  },
  vehContainerStyle: {
    width: (width - Sizes.fixPadding * 2) / 3 - Sizes.fixPadding,
    borderRadius: Sizes.fixPadding,
    marginRight: Sizes.fixPadding,
    marginBottom: Sizes.fixPadding,
  },
  titleLineStyle: {
    marginHorizontal: "auto",
    marginVertical: Sizes.fixPadding * 2,
    height: 2,
    width: width - Sizes.fixPadding * 4,
    backgroundColor: "#ccc",
  },
  vehicleImageStyle: {
    flex: 1,
    height: 80,
    borderTopLeftRadius: Sizes.fixPadding,
    borderTopRightRadius: Sizes.fixPadding,
  },
  vehicleTitleContainerStyle: {
    height: 60,
    paddingTop: 5,
    paddingHorizontal: 10,
    elevation: 1,
    borderBottomLeftRadius: Sizes.fixPadding,
    borderBottomRightRadius: Sizes.fixPadding,
  },
  vehicleTitleStyle: {
    color: Colors.blackColor,
    fontWeight: "500",
    lineHeight: 20,
  },
  altTitleContainerStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Sizes.fixPadding * 2,
  },
  altTitleStyle: {
    fontWeight: "500",
    color: Colors.blackColor,
    fontSize: 18,
  },
  viewAllStyle: {
    fontSize: 16,
    color: Colors.grayColor,
    fontWeight: "600",
  },
});
