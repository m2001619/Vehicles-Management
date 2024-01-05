import { useLayoutEffect, useState } from "react";

// react native
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

// third party packages
import axios from "axios";
import { useTranslation } from "react-i18next";

// project imports
import GlobalData from "../../GlobalData/GlobalData";
import { activeOpacity, Colors, Sizes } from "../../constants/styles";
import ApiConfigs from "../../constants/Apiconfigs";
import { localAlert } from "../../utils/LocalAlert";
import RequestScreen from "../SingleScreens/RequestScreen";
import InUseScreen from "../SingleScreens/InUseScreen";
import SectionLoading from "../../components/LoadingComponents/SectionLoading";

// interfaces and types
import {
  ArchiveType,
  RequestType,
  VehicleType,
} from "../../GlobalData/GlobalData";

type UseStateType = {
  vehicleInfo?: VehicleType;
  requestInfo?: RequestType;
  myReservationInfo?: ArchiveType;
  isLoading: boolean;
};

const VehicleTabScreen = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const { t } = useTranslation();

  // Global state
  const token = GlobalData((state) => state.token);
  const { request, vehicle } = GlobalData((state) => state.userInfo);

  // Local state
  const [state, setState] = useState<UseStateType>({ isLoading: false });
  const { vehicleInfo, requestInfo, myReservationInfo, isLoading } = state;
  const updateState = (data: any) =>
    setState((prevState) => ({ ...prevState, ...data }));

  // Handler Functions
  useLayoutEffect(() => {
    if (vehicle) {
      getMyActiveReservation().catch(console.error);
    }
    if (request) {
      getRequest(request).catch(console.error);
    } else {
      updateState({
        vehicleInfo: undefined,
        requestInfo: undefined,
        myReservationInfo: undefined,
      });
    }
  }, [vehicle, request]);

  const deleteRequestInfo = () => updateState({ requestInfo: undefined });

  /** Start Main Return **/
  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyColor }}>
      {requestInfo && vehicleInfo ? (
        <RequestScreen
          vehicleInfo={vehicleInfo}
          requestInfo={requestInfo}
          deleteRequestInfo={deleteRequestInfo}
        />
      ) : myReservationInfo && vehicleInfo ? (
        <InUseScreen
          vehicleInfo={vehicleInfo}
          myReservationInfo={myReservationInfo}
          navigation={navigation}
          bill={route?.params?.bill}
        />
      ) : isLoading ? (
        <SectionLoading isLoading={isLoading} />
      ) : (
        NoItem()
      )}
    </View>
  );
  /** End Main Return **/

  /** Start Components Functions **/
  function NoItem() {
    const onPress = () =>
      navigation.push("ViewAllVehiclesScreen", {
        title: t("Available Vehicles"),
        apiUrl: ApiConfigs.Vehicle.getAvailableVehicles,
      });
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={styles.noItemTextStyle}>{t("No Vehicle")}</Text>
        <Text style={{ ...styles.noItemTextStyle, marginTop: 5 }}>
          {t("You Did Not Book Any Vehicle")}
        </Text>
        <TouchableOpacity
          activeOpacity={activeOpacity}
          onPress={onPress}
          style={{ marginTop: Sizes.fixPadding }}
        >
          <Text style={{ color: Colors.grayColor, fontWeight: "500" }}>
            {t("Book Vehicle Now !")}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  /** End Components Functions **/

  /** Start Server Functions **/
  async function getVehicle(id: string) {
    updateState({ isLoading: true });
    try {
      const res = await axios({
        method: "GET",
        url: ApiConfigs.Vehicle.getVehicle + id,
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) {
        updateState({ vehicleInfo: res.data.data });
      }
    } catch (e) {
      // @ts-ignore
      localAlert(t(e?.response?.data?.message));
      console.log("Error in getVehicle / MyArchivesScreen");
    }
    updateState({ isLoading: false });
  }

  async function getRequest(id: string) {
    updateState({ isLoading: true });
    try {
      const res = await axios({
        method: "GET",
        url: ApiConfigs.Request.get + id,
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) {
        updateState({ requestInfo: res.data.data });
        await getVehicle(res.data.data.vehicle);
      }
    } catch (e) {
      // @ts-ignore
      localAlert(t(e?.response?.data?.message));
      console.log("Error in getRequest / MyArchivesScreen");
    }
    updateState({ isLoading: false });
  }

  async function getMyActiveReservation() {
    updateState({ isLoading: true });
    try {
      const res = await axios({
        method: "GET",
        url: ApiConfigs.ReservationArchive.getMyActiveReservation,
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) {
        updateState({ myReservationInfo: res.data.data });
        await getVehicle(res.data.data.vehicle);
      }
    } catch (e) {
      // @ts-ignore
      console.log("Error in getMyActiveReservation / MyArchivesScreen");
    }
    updateState({ isLoading: false });
  }

  /** End Server Functions **/
};

export default VehicleTabScreen;

const styles = StyleSheet.create({
  noItemTextStyle: {
    color: Colors.blackColor,
    fontSize: 18,
    fontWeight: "500",
  },
});
