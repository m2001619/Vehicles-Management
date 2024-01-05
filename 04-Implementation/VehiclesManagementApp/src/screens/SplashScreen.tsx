import { useLayoutEffect } from "react";

// react native
import { ImageBackground, SafeAreaView, StatusBar } from "react-native";

// third party packages
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useTranslation } from "react-i18next";

// projects imports
import { Colors } from "../constants/styles";
import ApiConfigs from "../constants/Apiconfigs";
import { localAlert } from "../utils/LocalAlert";
import GlobalData from "../GlobalData/GlobalData";

const SplashScreen = ({ navigation }: { navigation: any }) => {
  const { t } = useTranslation();

  // Global state
  const setToken = GlobalData((state) => state.setToken);
  const setUserInfo = GlobalData((state) => state.setUserInfo);

  // Handler Functions
  useLayoutEffect(() => {
    const time = setTimeout(async () => {
      const loginData = await AsyncStorage.getItem("login-data");
      if (loginData) {
        await Login(JSON.parse(loginData));
      } else {
        navigation.navigate("LoginScreen");
      }
    });
    return () => clearTimeout(time);
  });

  /** Start Main Return **/
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar translucent={false} backgroundColor={Colors.splashColor} />
      <ImageBackground
        style={{ flex: 1 }}
        source={require("../constants/images/splashImage.jpg")}
        resizeMode={"stretch"}
      />
    </SafeAreaView>
  );
  /** End Main Return **/

  /** Start Server Functions **/
  async function Login(data: { email: string; password: string }) {
    try {
      const res = await axios({
        method: "POST",
        url: ApiConfigs.Auth.login,
        data,
      });
      if (res.status === 200) {
        setToken(res.data.token);
        setUserInfo(res.data.data);
        navigation.navigate("BottomTabBar");
      } else {
        localAlert(t(res.data.message));
      }
    } catch (e) {
      navigation.navigate("LoginScreen");
    }
  }

  /** End Server Functions **/
};

export default SplashScreen;
