import { useLayoutEffect, useState } from "react";

// react native
import { Image, View } from "react-native";

// third party packages
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import axios from "axios";
import { useTranslation } from "react-i18next";

// project imports
import { getCurrentLocation, getLiveLocation } from "../../utils/Location";
import GlobalData from "../../GlobalData/GlobalData";
import ApiConfigs from "../../constants/Apiconfigs";
import { localAlert } from "../../utils/LocalAlert";

// interfaces and types
import { ImageSourcePropType } from "react-native/Libraries/Image/Image";
import { VehicleType } from "../../GlobalData/GlobalData";

type UseStateType = {
  latitude: number;
  longitude: number;
  nearlyVehicle: VehicleType[];
};

// constants
const distance = 500;
const unit = "km";

const LocationScreen = ({ navigation }: { navigation: any }) => {
  const { t } = useTranslation();

  // Global state
  const { photo, vehicle } = GlobalData((state) => state.userInfo);
  const token = GlobalData((state) => state.token);
  const imageSource: ImageSourcePropType = photo
    ? { uri: photo }
    : require("../../constants/images/user.png");

  // Local state
  const [state, setState] = useState<UseStateType>({
    latitude: 0,
    longitude: 0,
    nearlyVehicle: [],
  });
  const { latitude, longitude, nearlyVehicle } = state;
  const updateState = (data: any) =>
    setState((prevState) => ({ ...prevState, ...data }));

  // Handler Functions
  const updateLocation = ({
    latitude,
    longitude,
  }: {
    latitude: number;
    longitude: number;
  }) =>
    updateState({
      latitude,
      longitude,
    });

  useLayoutEffect(() => {
    if (vehicle) {
      getLiveLocation(updateLocation, vehicle).catch(console.error);
    } else {
      getCurrentLocation(updateLocation).catch(console.error);
    }
  }, [longitude]);

  useLayoutEffect(() => {
    if (!vehicle) {
      getNearlyVehicle().catch(console.error);
    }
  }, [latitude, longitude, vehicle]);

  /** Start Main Return **/
  return (
    <View style={{ flex: 1 }}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        zoomEnabled={true}
        region={{
          longitude: longitude,
          latitude: latitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{
            latitude,
            longitude,
          }}
        >
          <Image
            source={imageSource}
            style={{ width: 30, height: 30 }}
            resizeMode={"contain"}
            borderRadius={15}
          />
        </Marker>
        {!vehicle &&
          nearlyVehicle.map((i) => <VehicleMarker item={i} key={i._id} />)}
      </MapView>
    </View>
  );

  /** End Main Return **/

  /** Start Component Functions **/
  function VehicleMarker({ item }: { item: VehicleType }) {
    const [vehicleLatitude, vehicleLongitude] = item.location.coordinates;
    const imageSource: ImageSourcePropType = item.images[0]
      ? { uri: item.images[0] }
      : require("../../constants/images/authIcon.png");
    const onPress = () => navigation.push("VehicleScreen", { item });

    return (
      <Marker
        coordinate={{
          latitude:
            vehicleLatitude === latitude
              ? vehicleLatitude - 0.0001
              : vehicleLatitude,
          longitude: vehicleLongitude,
        }}
        title={`${item.make} ${item.model} ${item.year}`}
        onCalloutPress={onPress}
      >
        <Image
          source={imageSource}
          style={{ width: 30, height: 30 }}
          resizeMode={"contain"}
          borderRadius={15}
        />
      </Marker>
    );
  }

  /** End Component Functions **/

  /** Start Server Functions **/
  async function getNearlyVehicle() {
    try {
      const res = await axios({
        method: "GET",
        url: `${ApiConfigs.Vehicle.getNearlyVehicle}/${distance}/center/${latitude},${longitude}/unit/${unit}`,
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) {
        updateState({ nearlyVehicle: res.data.data });
      }
    } catch (e) {
      // @ts-ignore
      localAlert(t(e?.response?.data?.message));
      console.log("Error in LocationScreen / getNearlyVehicle");
    }
  }

  /** End Server Functions **/
};

export default LocationScreen;
