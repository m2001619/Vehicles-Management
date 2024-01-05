import { JSX, useState } from "react";

// react native
import {
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// third party packages
import DialogContainer from "react-native-dialog/lib/Container";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";

// project imports
import { activeOpacity, Colors, Sizes } from "../../constants/styles";
import GlobalData from "../../GlobalData/GlobalData";
import ApiConfigs from "../../constants/Apiconfigs";
import { lng } from "../../utils/Translater";

// assets
import AntDesign from "react-native-vector-icons/AntDesign";
import Feather from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

// Interfaces and Types
import { ImageSourcePropType } from "react-native/Libraries/Image/Image";

type SettingButtonType = {
  icon: JSX.Element;
  text: string;
  onPress: () => void;
};

const ProfileScreen = ({ navigation }: { navigation: any }) => {
  const { t } = useTranslation();

  // Global state
  const { photo, name, email, phoneNumber, vehicle, id, reservationArchive } =
    GlobalData((state) => state.userInfo);

  // Local state
  const [showLogoutDialog, setShowLogoutDialog] = useState<boolean>(false);

  /** Start Main Return **/
  return (
    <SafeAreaView style={styles.profileContainerStyle}>
      <StatusBar backgroundColor={Colors.primaryColor} />
      {Header()}
      {UserInfo()}
      {UserStatistics()}
      {SettingButtons()}
      {LogOutButton()}
      {LogOutDialog()}
    </SafeAreaView>
  );
  /** End Main Return **/

  /** Start Component Functions **/
  function LogOutDialog() {
    const onCancelPress = () => setShowLogoutDialog(false);
    const onLogoutPress = async () => {
      await AsyncStorage.removeItem("login-data");
      setShowLogoutDialog(false);
      navigation.navigate("LoginScreen");
    };
    return (
      <DialogContainer
        visible={showLogoutDialog}
        onBackdropPress={onCancelPress}
        contentStyle={styles.logoutDialogWrapStyle}
        headerStyle={{ margin: 0.0, padding: 0.0 }}
      >
        <Text style={styles.logoutDialogTextStyle}>
          {t("Are you sure, you want to log out ?")}
        </Text>
        <View style={styles.dialogButtonsContainerStyle}>
          <TouchableOpacity
            activeOpacity={activeOpacity}
            onPress={onCancelPress}
          >
            <Text style={styles.dialogCancelStyle}>{t("Cancel")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={activeOpacity}
            onPress={onLogoutPress}
            style={styles.dialogLogoutButtonStyle}
          >
            <Text style={styles.dialogLogoutTextStyle}>{t("Log out")}</Text>
          </TouchableOpacity>
        </View>
      </DialogContainer>
    );
  }

  function LogOutButton() {
    const onPress = () => setShowLogoutDialog(true);
    return (
      <TouchableOpacity
        activeOpacity={activeOpacity}
        onPress={onPress}
        style={styles.logOutButtonStyle}
      >
        <FontAwesome5 name="power-off" size={22} color={Colors.errorColor} />
        <Text style={{ ...styles.contactTextStyle, color: Colors.errorColor }}>
          {t("Log out")}
        </Text>
      </TouchableOpacity>
    );
  }

  function SettingButtons() {
    const buttonArr: SettingButtonType[] = [
      {
        icon: <AntDesign name="hearto" size={26} color={Colors.iconColor} />,
        text: t("My Favorites"),
        onPress: () =>
          navigation.push("ViewAllVehiclesScreen", {
            title: t("My Favorites"),
            apiUrl: ApiConfigs.Vehicle.getUserLikeVehicles + id,
          }),
      },
      {
        icon: (
          <FontAwesome5
            name="calendar-alt"
            size={26}
            color={Colors.iconColor}
          />
        ),
        text: t("My Archive"),
        onPress: () => navigation.push("MyArchivesScreen"),
      },
      {
        icon: (
          <FontAwesome5 name="receipt" size={26} color={Colors.iconColor} />
        ),
        text: t("My Bills"),
        onPress: () => navigation.push("MyBillsScreen"),
      },
    ];

    const renderItem = ({ item }: { item: SettingButtonType }) => {
      return (
        <TouchableOpacity
          activeOpacity={activeOpacity}
          onPress={item.onPress}
          style={{
            marginVertical: Sizes.fixPadding * 1.5,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {item.icon}
          <Text
            style={{ ...styles.contactTextStyle, color: Colors.primaryColor }}
          >
            {item.text}
          </Text>
        </TouchableOpacity>
      );
    };

    return (
      <FlatList
        showsVerticalScrollIndicator={false}
        data={buttonArr}
        renderItem={renderItem}
        contentContainerStyle={{
          marginVertical: Sizes.fixPadding * 1.5,
        }}
      />
    );
  }

  function UserStatistics() {
    const status = vehicle ? t("Working") : t("ِAvailable");
    return (
      <View style={styles.userStatisticContainerStyle}>
        <View style={styles.statisticBoxStyle}>
          <Text style={{ ...styles.userNameStyle, fontSize: 24 }}>
            {status}
          </Text>
          <Text style={styles.userWorkStyle}>{t("Status")}</Text>
        </View>
        <View style={styles.statisticBoxStyle}>
          <Text style={{ ...styles.userNameStyle, fontSize: 24 }}>
            {reservationArchive.length}
          </Text>
          <Text style={styles.userWorkStyle}>{t("Archive")}</Text>
        </View>
      </View>
    );
  }

  function UserInfo() {
    const imageSource: ImageSourcePropType = photo
      ? { uri: photo }
      : require("../../constants/images/user.png");
    return (
      <View style={{ marginVertical: Sizes.fixPadding * 3 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={imageSource}
            resizeMode={"cover"}
            style={{ height: 90, width: 90, borderRadius: 45 }}
          />
          <View style={{ marginLeft: Sizes.fixPadding * 4 }}>
            <Text style={styles.userNameStyle}>{name}</Text>
          </View>
        </View>
        <View style={{ marginTop: Sizes.fixPadding * 3, marginLeft: 5 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Feather name="phone" size={20} color={Colors.grayColor} />
            <Text style={styles.contactTextStyle}>{phoneNumber}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: Sizes.fixPadding * 2,
            }}
          >
            <MaterialCommunityIcons
              name="email-outline"
              size={20}
              color={Colors.grayColor}
            />
            <Text style={styles.contactTextStyle}>{email}</Text>
          </View>
        </View>
      </View>
    );
  }

  function Header() {
    const onArrowPress = () => navigation.pop();
    const onEditPress = () => navigation.push("EditProfileScreen");

    return (
      <View style={styles.headerContainerStyle}>
        <TouchableOpacity activeOpacity={activeOpacity} onPress={onArrowPress}>
          <AntDesign
            name={lng === "ar" ? "arrowright" : "arrowleft"}
            size={24}
            color={Colors.primaryColor}
          />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={activeOpacity} onPress={onEditPress}>
          <AntDesign name="edit" size={24} color={Colors.primaryColor} />
        </TouchableOpacity>
      </View>
    );
  }

  /** End Component Functions **/
};

export default ProfileScreen;

const styles = StyleSheet.create({
  profileContainerStyle: {
    flex: 1,
    backgroundColor: Colors.bodyColor,
    padding: Sizes.fixPadding * 2,
  },
  headerContainerStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  userNameStyle: {
    fontSize: 30,
    fontWeight: "600",
    color: Colors.primaryColor,
  },
  userWorkStyle: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: "500",
    color: Colors.grayColor,
  },
  contactTextStyle: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.grayColor,
    marginLeft: Sizes.fixPadding * 2,
  },
  userStatisticContainerStyle: {
    marginHorizontal: -Sizes.fixPadding * 3,
    flexDirection: "row",
    alignItems: "center",
  },
  statisticBoxStyle: {
    flex: 1,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  logOutButtonStyle: {
    paddingTop: Sizes.fixPadding * 2,
    paddingHorizontal: Sizes.fixPadding * 3,
    marginHorizontal: -Sizes.fixPadding * 3,
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  logoutDialogWrapStyle: {
    borderRadius: Sizes.fixPadding,
    width: 200,
    height: 200,
    justifyContent: "center",
    backgroundColor: Colors.bodyColor,
  },
  logoutDialogTextStyle: {
    textAlign: "center",
    color: Colors.primaryColor,
    fontWeight: "bold",
    fontSize: 16,
    lineHeight: 24,
  },
  dialogButtonsContainerStyle: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: Sizes.fixPadding * 3,
  },
  dialogCancelStyle: {
    fontWeight: "500",
    color: Colors.blackColor,
    fontSize: 16,
  },
  dialogLogoutButtonStyle: {
    backgroundColor: Colors.primaryColor,
    padding: Sizes.fixPadding,
    borderRadius: 5,
  },
  dialogLogoutTextStyle: {
    color: Colors.whiteColor,
    fontSize: 16,
    fontWeight: "500",
  },
});
