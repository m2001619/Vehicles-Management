import "react-native-gesture-handler";
import React, { ReactElement } from "react";

// react native
import { LogBox } from "react-native";

// react navigations
import { NavigationContainer } from "@react-navigation/native";
import {
  TransitionPresets,
  createStackNavigator,
} from "@react-navigation/stack";

// third party packages
import FlashMessage from "react-native-flash-message";
import { initI18Next } from "./utils/Translater";

// project imports
import GlobalData from "./GlobalData/GlobalData";
import SplashScreen from "./screens/SplashScreen";
import LoginScreen from "./screens/Authentication/LoginScreeen";
import SignUpScreen from "./screens/Authentication/SignUpScreen";
import ForgotPasswordScreen from "./screens/Authentication/ForgotPasswordScreen";
import ResetPasswordScreen from "./screens/Authentication/ResetPasswordScreen";
import Loading from "./components/LoadingComponents/Loading";
import BottomTabBar from "./components/BottomTabBar";
import ViewAllVehiclesScreen from "./screens/ViewAllScreens/ViewAllVehiclesScreen";
import VehicleScreen from "./screens/SingleScreens/VehicleScreen";
import GarageScreen from "./screens/SingleScreens/GarageScreen";
import ViewAllGarageScreen from "./screens/ViewAllScreens/ViewAllGarageScreen";
import ProfileScreen from "./screens/ProfileScreens/ProfileScreen";
import EditProfileScreen from "./screens/CreateAndEditScreens/EditProfileScreen";
import CreateEditBillScreen from "./screens/CreateAndEditScreens/CreateEditBillScreen";
import MyArchivesScreen from "./screens/ProfileScreens/MyArchivesScreen";
import ArchiveScreen from "./screens/SingleScreens/ArchiveScreen";
import MyBillsScreen from "./screens/ProfileScreens/MyBillsScreen";
import VerificationEmailScreen from "./screens/Authentication/VerificationEmailScreen";

// Ignore all log messages and prevent them from being displayed in the development environment
LogBox.ignoreAllLogs();

// Create a screen stack with react navigations package
const Stack = createStackNavigator();

// Initialize i18Next package
initI18Next.catch(console.error);

function App(): ReactElement {
  // Global state
  const isLoading = GlobalData((state) => state.isLoading);

  /** Start Main Return **/
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          ...TransitionPresets.SlideFromRightIOS,
        }}
      >
        <Stack.Screen
          name={"SplashScreen"}
          component={SplashScreen}
          options={{ ...TransitionPresets.DefaultTransition }}
        />
        <Stack.Screen
          name={"LoginScreen"}
          component={LoginScreen}
          options={{ ...TransitionPresets.DefaultTransition }}
        />
        <Stack.Screen name={"SignUpScreen"} component={SignUpScreen} />
        <Stack.Screen
          name={"VerificationEmailScreen"}
          component={VerificationEmailScreen}
        />
        <Stack.Screen
          name={"ForgotPasswordScreen"}
          component={ForgotPasswordScreen}
        />
        <Stack.Screen
          name={"ResetPasswordScreen"}
          component={ResetPasswordScreen}
        />
        <Stack.Screen
          name={"BottomTabBar"}
          component={BottomTabBar}
          options={{ ...TransitionPresets.DefaultTransition }}
        />
        <Stack.Screen name={"VehicleScreen"} component={VehicleScreen} />
        <Stack.Screen
          name={"ViewAllVehiclesScreen"}
          component={ViewAllVehiclesScreen}
        />
        <Stack.Screen name={"GarageScreen"} component={GarageScreen} />
        <Stack.Screen
          name={"ViewAllGarageScreen"}
          component={ViewAllGarageScreen}
        />
        <Stack.Screen name={"ProfileScreen"} component={ProfileScreen} />
        <Stack.Screen name={"MyArchivesScreen"} component={MyArchivesScreen} />
        <Stack.Screen name={"MyBillsScreen"} component={MyBillsScreen} />
        <Stack.Screen name={"ArchiveScreen"} component={ArchiveScreen} />
        <Stack.Screen
          name={"EditProfileScreen"}
          component={EditProfileScreen}
        />
        <Stack.Screen
          name={"CreateEditBillScreen"}
          component={CreateEditBillScreen}
        />
      </Stack.Navigator>
      <FlashMessage position="top" />
      <Loading isLoading={isLoading} />
    </NavigationContainer>
  );
  /** End Main Return **/
}

export default App;
