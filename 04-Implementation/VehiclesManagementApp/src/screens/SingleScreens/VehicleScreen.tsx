// react native
import {
  Alert,
  Dimensions,
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
import { useLayoutEffect, useState } from "react";
import DialogContainer from "react-native-dialog/lib/Container";
import axios from "axios/index";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";

// project imports
import { activeOpacity, Colors, Sizes } from "../../constants/styles";
import GlobalData from "../../GlobalData/GlobalData";
import Header from "../../components/ScreenComponents/Header";
import ApiConfigs from "../../constants/Apiconfigs";
import RequestDialog from "../../components/Dialogs/RequestDialog";
import { localAlert } from "../../utils/LocalAlert";
import TranslatedText from "../../components/TranslatedText";

// assets
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

// interfaces and types
import { GarageType, VehicleType } from "../../GlobalData/GlobalData";

type SpecificationType = { icon: any; text: string; value: string };

type FormType = {
  from: string;
  to: string;
  note: string;
};

type UseStateType = {
  garageInfo?: GarageType;
  imageIndex: number;
  showFeaturesDialog: boolean;
  showDialog: boolean;
};

// constants
const { width } = Dimensions.get("window");

const VehicleScreen = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const { t } = useTranslation();

  // component props
  const {
    images,
    model,
    year,
    make,
    engineOutput,
    maxSpeed,
    numSeats,
    fuelType,
    bodyType,
    TransmissionType,
    features,
    _id,
    requests,
    user,
    garage,
  }: VehicleType = route.params.item;
  const specificationList: SpecificationType[] = returnSpecList();
  const componentsArr = [VehicleImages(), VehicleInfos()];

  // Global state
  const token = GlobalData((state) => state.token);
  const { request, vehicle, likeVehicles } = GlobalData(
    (state) => state.userInfo
  );
  const setUserInfo = GlobalData((state) => state.setUserInfo);

  // Local state
  const [state, setState] = useState<UseStateType>({
    imageIndex: 0,
    showFeaturesDialog: false,
    showDialog: false,
  });
  const { garageInfo, imageIndex, showFeaturesDialog, showDialog } = state;
  const updateState = (data: any) =>
    setState((prevState) => ({ ...prevState, ...data }));

  // React-Hook-form for handling the form's inputs
  const {
    control,
    handleSubmit,
    formState: { defaultValues },
    reset,
  } = useForm<FormType>({
    defaultValues: {
      from: "",
      to: "",
      note: "",
    },
    reValidateMode: "onSubmit",
  });

  // Handler functions
  useLayoutEffect(() => {
    getGarage().catch(console.error);
  }, []);

  const handleMomentumScrollEnd = (event: any) => {
    const currentOffset = event.nativeEvent.contentOffset.x;
    const itemWidth = event.nativeEvent.layoutMeasurement.width;
    const currentItemIndex = Math.round(currentOffset / itemWidth);
    updateState({ imageIndex: currentItemIndex });
  };

  /** Start Main Return **/
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyColor }}>
      <StatusBar backgroundColor={Colors.primaryColor} />
      <Header
        title={t("Vehicle Details")}
        onPress={() => navigation.pop()}
        component={LikeVehicle()}
      />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={componentsArr}
        renderItem={({ item }) => item}
      />
      {BookVehicle()}
      {FeaturesDialog()}
      {BookDialog()}
    </SafeAreaView>
  );
  /** End Main Return **/

  /** Start Component Functions **/
  function LikeVehicle() {
    const isLike = likeVehicles.includes(_id);
    const onPress = () => (isLike ? dislikeVehicle() : likeVehicle());
    return (
      <TouchableOpacity activeOpacity={activeOpacity} onPress={onPress}>
        <AntDesign
          name={isLike ? "heart" : "hearto"}
          size={24}
          color={isLike ? Colors.errorColor : Colors.grayColor}
        />
      </TouchableOpacity>
    );
  }

  function BookVehicle() {
    const isUserInUse = !!vehicle;
    const isVehicleInUse = !!user;
    const isUserHasRequest = !!request;
    const isUserRequestedVehicle = !!request && requests.includes(request);
    const isUserUsingVehicle = !!user && vehicle === _id;
    const onPress = () => {
      if (isUserInUse || isUserHasRequest) {
        BookAlert(isUserInUse);
      } else {
        updateState({ showDialog: true });
      }
    };

    return (
      <View
        style={{
          backgroundColor: Colors.whiteColor,
          padding: Sizes.fixPadding * 2,
        }}
      >
        <TouchableOpacity
          activeOpacity={activeOpacity}
          onPress={onPress}
          style={{
            ...styles.bookButtonStyle,
            opacity:
              isUserRequestedVehicle || isUserUsingVehicle || isVehicleInUse
                ? 0.8
                : 1,
          }}
          disabled={
            isUserRequestedVehicle || isUserUsingVehicle || isVehicleInUse
          }
        >
          <Text style={styles.bookButtonTextStyle}>
            {isUserRequestedVehicle
              ? t("Requested")
              : isUserUsingVehicle
              ? t("Using By You")
              : isVehicleInUse
              ? t("Using By Another User")
              : t("Book Vehicle")}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  function VehicleInfos() {
    const onPress = () => updateState({ showFeaturesDialog: true });
    const onGaragePress = () =>
      navigation.push("GarageScreen", { item: garageInfo });

    return (
      <View style={styles.vehicleInfosContainerStyle}>
        <Text style={styles.titleStyle}>
          {make} {model} {year}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons
            name={"location-outline"}
            size={18}
            color={Colors.grayColor}
          />
          <TouchableOpacity
            activeOpacity={activeOpacity}
            onPress={onGaragePress}
          >
            <Text style={{ color: Colors.grayColor, marginLeft: 3 }}>
              {garage.name}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.titleLineStyle} />
        <View style={styles.altTitleContainerStyle}>
          <Text style={{ ...styles.titleStyle, fontSize: 18 }}>
            {t("Specification")}
          </Text>
          <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
            <Text style={styles.featureTitleStyle}>{t("Features")}</Text>
          </TouchableOpacity>
        </View>
        {Specification()}
      </View>
    );

    function Specification() {
      const renderItem = ({ item }: { item: SpecificationType }) => {
        const { icon, value, text } = item;

        return (
          <View style={styles.specContainerStyle}>
            <View style={styles.specIconStyle}>{icon}</View>
            <Text style={styles.specTextStyle}>{text}</Text>
            <Text style={styles.specValueStyle}>{value}</Text>
          </View>
        );
      };

      return (
        <FlatList
          data={specificationList}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          numColumns={3}
          contentContainerStyle={{ marginVertical: Sizes.fixPadding * 2 }}
        />
      );
    }
  }

  function FeaturesDialog() {
    const renderItem = ({ item }: { item: string }) => (
      <View>
        <TranslatedText value={item} style={styles.featureTextStyle} />
        <View
          style={{ ...styles.titleLineStyle, marginVertical: Sizes.fixPadding }}
        />
      </View>
    );

    return (
      <DialogContainer
        visible={showFeaturesDialog}
        onBackdropPress={() => updateState({ showFeaturesDialog: false })}
        contentStyle={styles.dialogWrapStyle}
        headerStyle={{ margin: 0.0, padding: 0.0 }}
      >
        <FlatList
          data={features}
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
        />
      </DialogContainer>
    );
  }

  function VehicleImages() {
    const renderItem = ({ item }: { item: string }) => (
      <Image
        source={{ uri: item }}
        style={styles.imageStyle}
        resizeMode={"cover"}
      />
    );

    const CircleItem = ({ index }: { item: string; index: number }) => (
      <View
        style={{
          ...styles.imagesCircleStyle,
          backgroundColor: index === imageIndex ? Colors.grayColor : "#ccc",
        }}
      />
    );

    return (
      <View style={{ marginVertical: Sizes.fixPadding }}>
        <FlatList
          data={images}
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          pagingEnabled={true}
          onMomentumScrollEnd={(event) => handleMomentumScrollEnd(event)}
          initialNumToRender={1}
          maxToRenderPerBatch={1}
          windowSize={2}
        />
        <View
          style={{
            ...styles.imagesCircleContainerStyle,
            display: images.length < 0 ? "none" : "flex",
          }}
        >
          <FlatList
            data={images}
            renderItem={CircleItem}
            showsHorizontalScrollIndicator={false}
            horizontal={true}
          />
        </View>
      </View>
    );
  }

  function BookDialog() {
    const onCancelPress = () => {
      updateState({ showDialog: false });
      reset(defaultValues);
    };
    const onSubmit = handleSubmit((data) => requestVehicle(data));
    return (
      <RequestDialog
        showDialog={showDialog}
        onCancelPress={onCancelPress}
        onSubmit={onSubmit}
        control={control}
      />
    );
  }

  /** End Component Functions **/

  /** Start Alert Functions **/
  function BookAlert(isUserInUse: boolean) {
    return Alert.alert(
      t("Warning"),
      isUserInUse
        ? t("You are using another vehicle")
        : t(
            "You has requested another vehicle, if You Want to request this vehicle delete the another request."
          ),
      [
        {
          text: t("Ok"),
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  }

  /** End Alert Functions **/

  /** Start Server Functions **/
  async function getGarage() {
    try {
      const res = await axios({
        method: "GET",
        url: ApiConfigs.Garage.getGarage + garage.id,
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) {
        updateState({ garageInfo: res.data.data });
      }
    } catch (e) {
      // @ts-ignore
      localAlert(t(e?.response?.data?.message));
      console.log("Error in VehicleCard / getGarage");
    }
  }

  async function requestVehicle(data: FormType) {
    try {
      const res = await axios({
        method: "POST",
        url: ApiConfigs.Request.requestVehicle + _id,
        headers: { Authorization: `Bearer ${token}` },
        data,
      });
      if (res.status === 200) {
        updateState({ showDialog: false });
        setUserInfo({ request: res.data.data._id });
        Alert.alert(t("Success"), t(res.data.message), [
          {
            text: t("Ok"),
            onPress: () => navigation.navigate("VehicleTabScreen"),
            style: "cancel",
          },
        ]);
      }
    } catch (e) {
      // @ts-ignore
      Alert.alert(t("Warning"), t(e?.response?.data?.message), [
        {
          text: t("Ok"),
          style: "cancel",
        },
      ]);
      console.log("Error in requestVehicle / VehicleScreen");
    }
  }

  async function likeVehicle() {
    try {
      const res = await axios({
        method: "PATCH",
        url: ApiConfigs.Vehicle.likeVehicle + _id,
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) {
        setUserInfo({ likeVehicles: res.data.likeVehicles });
      }
    } catch (e) {
      console.log("Error in likeVehicle / VehicleScreen");
    }
  }

  async function dislikeVehicle() {
    try {
      const res = await axios({
        method: "PATCH",
        url: ApiConfigs.Vehicle.dislikeVehicle + _id,
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) {
        setUserInfo({ likeVehicles: res.data.likeVehicles });
      }
    } catch (e) {
      console.log("Error in dislikeVehicle / VehicleScreen");
    }
  }

  /** End Server Functions **/

  function returnSpecList(): SpecificationType[] {
    return [
      {
        icon: (
          <MaterialCommunityIcons
            name="engine-outline"
            size={22}
            color={Colors.primaryColor}
          />
        ),
        text: t("Engine Out"),
        value: `${engineOutput} HP`,
      },
      {
        icon: (
          <Ionicons
            name="speedometer-outline"
            size={22}
            color={Colors.primaryColor}
          />
        ),
        text: t("Max Speed"),
        value: `${maxSpeed} km/h`,
      },
      {
        icon: (
          <MaterialIcons
            name="airline-seat-recline-normal"
            size={22}
            color={Colors.primaryColor}
          />
        ),
        text: t("Capacity"),
        value: `${numSeats} ${t("Seats")}`,
      },
      {
        icon: (
          <MaterialCommunityIcons
            name="fuel"
            size={22}
            color={Colors.primaryColor}
          />
        ),
        text: t("Fuel Type"),
        value: `${t(fuelType)}`,
      },
      {
        icon: <FontAwesome5 name="car" size={22} color={Colors.primaryColor} />,
        text: t("Body Type"),
        value: `${t(bodyType)}`,
      },
      {
        icon: (
          <MaterialIcons
            name="control-camera"
            size={22}
            color={Colors.primaryColor}
          />
        ),
        text: t("Transmission"),
        value: `${t(TransmissionType)}`,
      },
    ];
  }
};

export default VehicleScreen;

const styles = StyleSheet.create({
  imageStyle: {
    borderRadius: Sizes.fixPadding * 2,
    width: width - Sizes.fixPadding * 4,
    height: 200,
    marginHorizontal: Sizes.fixPadding * 2,
  },
  imagesCircleContainerStyle: {
    marginTop: Sizes.fixPadding * 2,
    marginBottom: Sizes.fixPadding,
    justifyContent: "center",
    alignItems: "center",
  },
  imagesCircleStyle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 5,
  },
  vehicleInfosContainerStyle: {
    flex: 1,
    padding: Sizes.fixPadding * 2,
    backgroundColor: Colors.bodyColor,
    borderRadius: Sizes.fixPadding * 3,
  },
  titleStyle: {
    fontSize: 24,
    fontWeight: "500",
    color: Colors.blackColor,
    marginBottom: Sizes.fixPadding,
  },
  featureTitleStyle: {
    fontSize: 16,
    color: Colors.grayColor,
    fontWeight: "600",
  },
  featureTextStyle: {
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
    color: Colors.blackColor,
  },
  titleLineStyle: {
    marginHorizontal: "auto",
    marginVertical: Sizes.fixPadding,
    height: 2,
    width: width - Sizes.fixPadding * 4,
    backgroundColor: "#ccc",
  },
  altTitleContainerStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Sizes.fixPadding,
  },
  specContainerStyle: {
    width: width / 3 - Sizes.fixPadding * 2,
    backgroundColor: "rgba(25,74,249,0.2)",
    borderRadius: Sizes.fixPadding,
    padding: Sizes.fixPadding,
    marginRight: Sizes.fixPadding,
    marginBottom: Sizes.fixPadding,
  },
  specIconStyle: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.whiteColor,
  },
  specTextStyle: {
    marginTop: Sizes.fixPadding,
    color: "#777",
    fontWeight: "600",
  },
  specValueStyle: {
    marginTop: Sizes.fixPadding,
    color: Colors.blackColor,
    fontWeight: "600",
    fontSize: 16,
  },
  dialogWrapStyle: {
    borderRadius: Sizes.fixPadding - 5.0,
    width: width - Sizes.fixPadding * 4,
    padding: Sizes.fixPadding * 2,
    backgroundColor: Colors.bodyColor,
  },
  bookButtonStyle: {
    backgroundColor: Colors.primaryColor,
    padding: Sizes.fixPadding * 2,
    borderRadius: 30,
  },
  bookButtonTextStyle: {
    textAlign: "center",
    color: Colors.whiteColor,
    fontSize: 18,
    fontWeight: "500",
  },
});
