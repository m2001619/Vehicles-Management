import { useLayoutEffect, useState } from "react";

// react native
import {
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// third party packages
import moment from "moment";
import axios from "axios";
import { useTranslation } from "react-i18next";

// project imports
import GlobalData, {
  ArchiveType,
  FuelBillType,
  VehicleType,
} from "../../GlobalData/GlobalData";
import { activeOpacity, Colors, Sizes } from "../../constants/styles";
import ApiConfigs from "../../constants/Apiconfigs";
import { localAlert } from "../../utils/LocalAlert";
import BillCard from "../../components/Cards/BillCard";
import Header from "../../components/ScreenComponents/Header";
import SectionLoading from "../../components/LoadingComponents/SectionLoading";
import TranslatedText from "../../components/TranslatedText";

// assets
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

// Interfaces and Types
import { ImageSourcePropType } from "react-native/Libraries/Image/Image";

type UseStateType = {
  selectedSection: string;
  vehicleInfo: VehicleType | null;
  fuelBillArr: FuelBillType[];
  loading: boolean;
};

// constants
const { width } = Dimensions.get("window");
const sectionButtonsArr = ["details", "bills"];

const ArchiveScreen = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const { t } = useTranslation();

  // navigation route params
  const { note, departure, arrival, _id, vehicle }: ArchiveType =
    route.params.myReservationInfo;

  // Global state
  const token = GlobalData((state) => state.token);

  // Local state
  const [state, setState] = useState<UseStateType>({
    selectedSection: sectionButtonsArr[0],
    fuelBillArr: [],
    vehicleInfo: null,
    loading: false,
  });
  const { selectedSection, fuelBillArr, vehicleInfo, loading } = state;
  const imageSource: ImageSourcePropType = vehicleInfo
    ? { uri: vehicleInfo.images[0] }
    : require("../../constants/images/authIcon.png");

  // Handler functions
  const updateState = (data: any) =>
    setState((prevState) => ({ ...prevState, ...data }));

  const onPress = () => navigation.pop();

  useLayoutEffect(() => {
    getVehicle(vehicle).catch(console.error);
    getReservationFuelBills(_id).catch(console.error);
  }, []);

  /** Start Main Return **/
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.bodyColor,
      }}
    >
      <StatusBar backgroundColor={Colors.primaryColor} />
      <Header title={t("Archive")} onPress={onPress} />
      {loading ? (
        <SectionLoading isLoading={loading} />
      ) : (
        <>
          <Text style={styles.vehicleTitleStyle}>
            {vehicleInfo?.make} {vehicleInfo?.model} {vehicleInfo?.year}
          </Text>
          <Image
            source={imageSource}
            style={styles.imageStyle}
            resizeMode={"cover"}
          />
          <View style={styles.infoContainerStyle}>
            {SectionButtons()}
            {selectedSection === "details" ? Details() : Bills()}
          </View>
        </>
      )}
    </SafeAreaView>
  );

  /** End Main Return **/

  /** Start Component Functions **/
  function Bills() {
    const removeBill = (id: string) =>
      updateState({ fuelBillArr: fuelBillArr.filter((i) => i._id !== id) });

    const NoBillItem = () => (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 18, color: Colors.grayColor }}>
          {t("No Bills Found")}
        </Text>
      </View>
    );

    const billList = () => {
      return (
        <FlatList
          data={fuelBillArr}
          renderItem={({ item, index }) => (
            <BillCard
              item={item}
              navigation={navigation}
              index={index}
              removeBill={removeBill}
              isArchive={true}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      );
    };

    return (
      <View style={{ flex: 1 }}>
        {fuelBillArr.length > 0 ? billList() : NoBillItem()}
      </View>
    );
  }

  function Details() {
    const Info = ({
      title,
      value,
      isTranslate = false,
    }: {
      title: string;
      value: string;
      isTranslate?: boolean;
    }) => (
      <View style={styles.textContainerStyle}>
        <Text
          style={{ fontSize: 16, color: Colors.blackColor, fontWeight: "500" }}
        >
          {title}
        </Text>
        {isTranslate ? (
          <TranslatedText value={value} style={styles.noteTextStyle} />
        ) : (
          <Text style={styles.noteTextStyle}>{value}</Text>
        )}
      </View>
    );

    const DateCalender = ({
      title,
      value,
    }: {
      title: string;
      value: string;
    }) => (
      <View style={{ marginVertical: Sizes.fixPadding }}>
        <Text style={{ ...styles.vehicleTitleStyle, color: Colors.grayColor }}>
          {title}
        </Text>
        <View style={styles.historyDateStyle}>
          <Text style={{ fontSize: 16, color: Colors.blackColor }}>
            {moment(value).format("DD/MM/yyyy HH:mm")}
          </Text>
          <FontAwesome5 name={"calendar"} size={24} color={Colors.grayColor} />
        </View>
      </View>
    );

    return (
      <View style={{ flex: 1, paddingTop: Sizes.fixPadding * 2 }}>
        <ScrollView style={{ flex: 1 }}>
          <View style={styles.locationDetailContainerStyle}>
            <View style={{ alignItems: "center" }}>
              <Text style={styles.locationDetailsStyle}>{t("From")}</Text>
              <Text style={{ fontSize: 18, color: Colors.blackColor }}>
                {departure.from}
              </Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text style={styles.locationDetailsStyle}>{t("To")}</Text>
              <Text style={{ fontSize: 18, color: Colors.blackColor }}>
                {arrival.to}
              </Text>
            </View>
          </View>
          {DateCalender({ title: t("Departure Data"), value: departure.time })}
          {DateCalender({ title: t("Arrival Data"), value: arrival.time })}
          <View style={{ marginVertical: Sizes.fixPadding }}>
            {Info({ title: `${t("Departure Odo")}:`, value: departure.odo })}
            {Info({ title: `${t("Arrival Odo")}:`, value: arrival.odo })}
            {Info({ title: `${t("Note")}:`, value: note, isTranslate: true })}
          </View>
        </ScrollView>
      </View>
    );
  }

  function SectionButtons() {
    const onPress = (section: string) =>
      updateState({ selectedSection: section });
    return (
      <View style={styles.sectionButtonsContainerStyle}>
        {sectionButtonsArr.map((item, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={activeOpacity}
            onPress={() => onPress(item)}
            style={{
              ...styles.sectionButtonStyle,
              borderBottomWidth: selectedSection === item ? 1 : 0,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontWeight: "500",
                color:
                  selectedSection === item
                    ? Colors.primaryColor
                    : Colors.grayColor,
              }}
            >
              {item.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  /** End Component Functions **/

  /** Start Server Functions **/
  async function getReservationFuelBills(id: string) {
    try {
      const res = await axios({
        method: "GET",
        url: ApiConfigs.FuelBill.getReservationFuelBills + id,
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) {
        updateState({ fuelBillArr: res.data.data });
      }
    } catch (e) {
      // @ts-ignore
      localAlert(t(e?.response?.data?.message));
      console.log("Error in getReservationFuelBills / ArchiveScreen");
    }
  }

  async function getVehicle(id: string) {
    updateState({ loading: true });
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
      console.log("Error in getVehicle / ArchiveScreen");
    }
    updateState({ loading: false });
  }

  /** End Server Functions **/
};

export default ArchiveScreen;

const styles = StyleSheet.create({
  imageStyle: {
    borderRadius: 5,
    width: width - Sizes.fixPadding * 4,
    height: 200,
    marginHorizontal: Sizes.fixPadding * 2,
  },
  vehicleTitleStyle: {
    fontSize: 20,
    color: Colors.blackColor,
    fontWeight: "500",
    marginBottom: Sizes.fixPadding * 2,
    textAlign: "center",
  },
  infoContainerStyle: {
    flex: 1,
    paddingHorizontal: Sizes.fixPadding * 2,
    marginTop: Sizes.fixPadding * 2,
  },
  sectionButtonsContainerStyle: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: Colors.grayColor,
  },
  sectionButtonStyle: {
    flex: 1,
    paddingBottom: Sizes.fixPadding,
    borderColor: Colors.primaryColor,
  },
  historyContainerStyle: {
    flex: 1,
    alignItems: "center",
    paddingTop: Sizes.fixPadding * 2,
  },
  historyDateStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 0.5,
    borderColor: Colors.grayColor,
    width: width - Sizes.fixPadding * 4,
    paddingHorizontal: Sizes.fixPadding * 2,
    paddingVertical: Sizes.fixPadding,
    borderRadius: 5,
  },
  locationDetailContainerStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  locationDetailsStyle: {
    fontSize: 17,
    color: Colors.grayColor,
    fontWeight: "500",
    marginBottom: 5,
  },
  textContainerStyle: {
    marginHorizontal: Sizes.fixPadding,
    marginBottom: Sizes.fixPadding,
    flexDirection: "row",
    alignItems: "center",
  },
  noteTextStyle: {
    color: Colors.grayColor,
    fontWeight: "500",
    fontSize: 16,
    marginLeft: 5,
  },
});
