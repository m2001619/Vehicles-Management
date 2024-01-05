import { JSX, useLayoutEffect, useState } from "react";

// react native
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";

// third party packages
import axios from "axios/index";
import { useTranslation } from "react-i18next";

// project imports
import { activeOpacity, Colors, Sizes } from "../../constants/styles";
import GlobalData from "../../GlobalData/GlobalData";
import VehicleCard from "../../components/Cards/VehicleCard";
import ApiConfigs from "../../constants/Apiconfigs";
import { localAlert } from "../../utils/LocalAlert";
import NoItem from "../../components/ScreenComponents/NoItem";

// assets
import LinearGradient from "react-native-linear-gradient";

// interfaces and types
import { GarageType, VehicleType } from "../../GlobalData/GlobalData";

type UseStateType = {
  garageList: GarageType[];
  availableVehiclesList: VehicleType[];
};

// constants
const { width } = Dimensions.get("window");
const vehicleLimit = 8;
const garageLimit = 4;

const HomeScreen = ({ navigation }: { navigation: any }) => {
  const { t } = useTranslation();

  // Global state
  const token = GlobalData((state) => state.token);
  const isLoading = GlobalData((state) => state.isLoading);
  const setIsLoading = GlobalData((state) => state.setIsLoading);

  // Local state
  const [state, setState] = useState<UseStateType>({
    availableVehiclesList: [],
    garageList: [],
  });
  const { garageList, availableVehiclesList } = state;
  const updateState = (data: any) =>
    setState((prevState) => ({ ...prevState, ...data }));

  // Handler functions
  useLayoutEffect(() => {
    getAvailableVehicles().catch(console.error);
    getAllGarages().catch(console.error);
  }, []);

  /** Start Main Return **/
  const componentArr: JSX.Element[] = [GaragesList(), VehiclesList()];
  return (
    <View style={styles.homeContainerStyle}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={componentArr}
        renderItem={(item) => item.item}
      />
    </View>
  );
  /** End Main Return **/

  /** Start Component Functions **/
  function GaragesList() {
    const onPress = () => navigation.push("ViewAllGarageScreen");
    const renderItem = ({ item }: { item: GarageType }) => {
      const onPress = () => navigation.push("GarageScreen", { item: item });
      return (
        <TouchableOpacity
          activeOpacity={activeOpacity}
          onPress={onPress}
          style={{
            ...styles.garageButtonStyle,
            marginHorizontal: Sizes.fixPadding * 0.5,
          }}
        >
          <Image
            source={{ uri: item.photo }}
            resizeMode={"stretch"}
            style={styles.garageImageStyle}
          />
          <Text style={{ textAlign: "center", fontWeight: "500" }}>
            {item.name}
          </Text>
        </TouchableOpacity>
      );
    };

    return (
      <View>
        <View style={styles.titleContainer}>
          <Text style={styles.titleStyle}>{t("Garages")}</Text>
          <TouchableOpacity activeOpacity={activeOpacity} onPress={onPress}>
            <Text
              style={{
                ...styles.seeMoreStyle,
                display: garageList?.length < garageLimit ? "none" : "flex",
              }}
            >
              {t("View All")}
            </Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={garageList}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          pagingEnabled={true}
          initialNumToRender={garageLimit}
          maxToRenderPerBatch={garageLimit}
          windowSize={garageLimit}
          contentContainerStyle={{ minHeight: 100 }}
          ListEmptyComponent={!isLoading ? <NoItem /> : null}
        />
      </View>
    );
  }

  function VehiclesList() {
    const onPress = () =>
      navigation.push("ViewAllVehiclesScreen", {
        title: t("Available Vehicles"),
        apiUrl: ApiConfigs.Vehicle.getAvailableVehicles,
      });
    return (
      <LinearGradient
        colors={[Colors.bodyColor, Colors.tabBarBodyColor]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.vehiclesListContainerStyle}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.titleStyle}>{t("Available Vehicles")}</Text>
          <TouchableOpacity activeOpacity={activeOpacity} onPress={onPress}>
            <Text
              style={{
                ...styles.seeMoreStyle,
                display:
                  availableVehiclesList?.length < vehicleLimit ? "none" : "flex",
              }}
            >
              {t("View All")}
            </Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={availableVehiclesList}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <VehicleCard navigation={navigation} item={item} />
          )}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          pagingEnabled={true}
          initialNumToRender={vehicleLimit}
          maxToRenderPerBatch={vehicleLimit}
          windowSize={vehicleLimit + 1}
          onEndReachedThreshold={0.1}
          contentContainerStyle={{ minHeight: 100 }}
          ListEmptyComponent={!isLoading ? <NoItem /> : null}
        />
      </LinearGradient>
    );
  }

  /** End Component Functions **/

  /** Start Server Functions **/
  async function getAllGarages() {
    setIsLoading(true);
    try {
      const res = await axios({
        method: "GET",
        url: ApiConfigs.Garage.getAllGarages,
        headers: { Authorization: `Bearer ${token}` },
        params: {
          limit: garageLimit,
        },
      });
      if (res.status === 200) {
        const idArr = new Set(garageList.map((obj) => obj._id));
        const result = garageList;
        res.data.data.forEach((i: any) => {
          if (!idArr.has(i._id)) {
            result.push(i);
          }
        });
        updateState({ garageList: result });
      }
    } catch (e) {
      // @ts-ignore
      localAlert(t(e?.response?.data?.message));
      console.log("Error in BottomTabBar / getAllGarages");
    }
    setIsLoading(false);
  }

  async function getAvailableVehicles() {
    setIsLoading(true);
    try {
      const res = await axios({
        method: "GET",
        url: ApiConfigs.Vehicle.getAvailableVehicles,
        headers: { Authorization: `Bearer ${token}` },
        params: {
          limit: vehicleLimit,
        },
      });
      if (res.status === 200) {
        const idArr = new Set(availableVehiclesList.map((obj) => obj._id));
        const result = availableVehiclesList;
        res.data.data.forEach((i: any) => {
          if (!idArr.has(i._id)) {
            result.push(i);
          }
        });
        updateState({ availableVehiclesList: result });
      }
    } catch (e) {
      // @ts-ignore
      localAlert(t(e?.response?.data?.message));
      console.log("Error in BottomTabBar / getAvailableVehicles");
    }
    setIsLoading(false);
  }

  /** End Server Functions **/
};

export default HomeScreen;

const styles = StyleSheet.create({
  homeContainerStyle: {
    flex: 1,
    backgroundColor: Colors.tabBarBodyColor,
    paddingVertical: Sizes.fixPadding * 3,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: Sizes.fixPadding,
    marginBottom: Sizes.fixPadding * 2,
  },
  titleStyle: {
    fontSize: 20,
    color: Colors.blackColor,
    fontWeight: "500",
  },
  seeMoreStyle: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.grayColor,
  },
  garageButtonStyle: {
    width: width / 4 - 10,
    alignItems: "center",
  },
  garageImageStyle: {
    height: width / 4 - 20,
    width: width / 4 - 20,
    borderRadius: (width / 4 - 20) / 2,
    marginBottom: Sizes.fixPadding,
  },
  vehiclesListContainerStyle: {
    marginTop: Sizes.fixPadding * 2,
    paddingVertical: Sizes.fixPadding * 2,
    borderTopLeftRadius: Sizes.fixPadding * 3,
    borderTopRightRadius: Sizes.fixPadding * 3,
    backgroundColor: Colors.bodyColor,
  },
});
