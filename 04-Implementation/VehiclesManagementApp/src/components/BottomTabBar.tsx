import { useLayoutEffect } from "react";

// react native
import {
  Alert,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

// react navigations
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// third party packages
import { useTranslation } from "react-i18next";
import messaging from "@react-native-firebase/messaging";
import axios from "axios/index";

// project imports
import { activeOpacity, Colors, Sizes } from "../constants/styles";
import GlobalData from "../GlobalData/GlobalData";
import ApiConfigs from "../constants/Apiconfigs";
import HomeScreen from "../screens/TabBar/HomeScreen";
import VehicleTabScreen from "../screens/TabBar/VehicleTabScreen";
import LocationScreen from "../screens/TabBar/LocationScreen";
import SearchScreen from "../screens/TabBar/SearchScreen";

// assets
import Entypo from "react-native-vector-icons/Entypo";
import Ionicons from "react-native-vector-icons/Ionicons";

// interfaces and types
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { ImageSourcePropType } from "react-native/Libraries/Image/Image";
import { FirebaseMessagingTypes } from "@react-native-firebase/messaging";

// handle Tab navigate using react navigation package
const Tab = createBottomTabNavigator();

const BottomTabBar = ({ navigation }: { navigation: any }) => {
  const { t } = useTranslation();

  // Global state
  const { photo } = GlobalData((state) => state.userInfo);
  const token = GlobalData((state) => state.token);
  const updateUserInfo = GlobalData((state) => state.updateUserInfo);

  // Handler Functions
  useLayoutEffect(() => {
    messaging().onMessage(async (remoteMessage) =>
      notificationAlert(remoteMessage.notification)
    );
  }, []);

  /** Start Main Return **/
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyColor }}>
      <StatusBar backgroundColor={Colors.primaryColor} />
      {Header()}
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Colors.primaryColor,
          tabBarInactiveTintColor: "red",
          tabBarStyle: { ...styles.tabBarStyle },
          tabBarShowLabel: false,
        }}
      >
        <Tab.Screen
          name={"HomeScreen"}
          component={HomeScreen}
          options={{
            tabBarIcon: ({ focused }) =>
              tabIconSort({
                icon: (
                  <Entypo
                    name="home"
                    size={26}
                    color={focused ? Colors.primaryColor : "#777"}
                  />
                ),
              }),
          }}
        />
        <Tab.Screen
          name={"SearchScreen"}
          component={SearchScreen}
          options={{
            tabBarIcon: ({ focused }) =>
              tabIconSort({
                icon: (
                  <Ionicons
                    name={"search"}
                    size={26}
                    color={focused ? Colors.primaryColor : "#777"}
                  />
                ),
              }),
          }}
        />
        <Tab.Screen
          name={"LocationScreen"}
          component={LocationScreen}
          options={{
            tabBarIcon: ({ focused }) =>
              tabIconSort({
                icon: (
                  <FontAwesome5
                    name="map-marker-alt"
                    size={24}
                    color={focused ? Colors.primaryColor : "#777"}
                  />
                ),
              }),
          }}
        />
        <Tab.Screen
          name={"VehicleTabScreen"}
          component={VehicleTabScreen}
          options={{
            tabBarIcon: ({ focused }) =>
              tabIconSort({
                icon: (
                  <Ionicons
                    name="car-sport"
                    size={30}
                    color={focused ? Colors.primaryColor : "#777"}
                  />
                ),
              }),
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );

  /** End Main Return **/

  /** Start Component Functions **/
  function Header() {
    const photoSource: ImageSourcePropType = photo
      ? { uri: photo }
      : require("./../constants/images/user.png");
    return (
      <View style={styles.headerContainerStyle}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            activeOpacity={activeOpacity}
            onPress={() => navigation.push("ProfileScreen")}
            style={styles.userImageStyle}
          >
            <Image
              source={photoSource}
              style={{
                height: 45,
                width: 45,
                borderRadius: 25,
              }}
              resizeMode={"cover"}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function tabIconSort({ icon }: { icon: any }) {
    return <View style={styles.bottomTabBarItemWrapStyle}>{icon}</View>;
  }

  function notificationAlert(
    notification: FirebaseMessagingTypes.Notification | undefined
  ) {
    if (notification && notification?.title && notification?.body) {
      Alert.alert(
        t(notification?.title),
        t(notification?.body),
        [
          {
            text: t("Ok"),
            onPress: () => getMe(),
          },
        ],
        { cancelable: false }
      );
    }
  }

  /** End Component Functions **/

  /** Start Server Functions **/
  async function getMe() {
    try {
      const res = await axios({
        method: "GET",
        url: ApiConfigs.User.getMe,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 200) {
        updateUserInfo(res.data.data);
        navigation.navigate("VehicleTabScreen");
      }
    } catch (e) {
      // @ts-ignore
      t(e?.response?.data?.message);
      console.log("Error in getMe / BottomTabBar");
    }
  }

  /** End Server Functions **/
};

export default BottomTabBar;

const styles = StyleSheet.create({
  headerContainerStyle: {
    paddingHorizontal: Sizes.fixPadding * 2,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    elevation: 3,
    height: 80,
  },
  userImageStyle: {
    borderRadius: 25,
    borderWidth: 0.5,
    borderColor: Colors.grayColor,
    marginLeft: Sizes.fixPadding * 2,
  },
  tabBarStyle: {
    height: 80.0,
    elevation: 0.3,
    backgroundColor: Colors.whiteColor,
  },
  bottomTabBarItemWrapStyle: {
    flex: 1,
    minWidth: 120,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.whiteColor,
  },
});
