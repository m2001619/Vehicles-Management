import { useLayoutEffect, useState } from "react";

// react native
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
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
import GlobalData from "../../GlobalData/GlobalData";
import { activeOpacity, Colors, Sizes } from "../../constants/styles";
import ApiConfigs from "../../constants/Apiconfigs";
import { localAlert } from "../../utils/LocalAlert";
import FormButton from "../../components/FormComponents/FormButton";
import BillCard from "../../components/Cards/BillCard";
import TranslatedText from "../../components/TranslatedText";

// assets
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import AntDesign from "react-native-vector-icons/AntDesign";

// interfaces and types
import {
  ArchiveType,
  FuelBillType,
  VehicleType,
} from "../../GlobalData/GlobalData";

type UseStateType = {
  selectedSection: string;
  fuelBillArr: FuelBillType[];
  askToReturn: boolean;
};

// constants
const { width } = Dimensions.get("window");
const sectionButtonsArr = ["Details", "Bills"];

const InUseScreen = ({
  vehicleInfo,
  myReservationInfo,
  navigation,
  bill,
}: {
  vehicleInfo: VehicleType;
  myReservationInfo: ArchiveType;
  navigation: any;
  bill: FuelBillType | undefined;
}) => {
  const { t } = useTranslation();

  // component props
  const { images, make, model, year, fuelType } = vehicleInfo;
  const { note, departure, arrival, fuelBill, _id, user, vehicle, status } =
    myReservationInfo;

  // Global state
  const token = GlobalData((state) => state.token);

  // Local state
  const [state, setState] = useState<UseStateType>({
    selectedSection: sectionButtonsArr[0],
    fuelBillArr: [],
    askToReturn: status === "ask-to-return",
  });
  const { selectedSection, fuelBillArr, askToReturn } = state;
  const updateState = (data: any) =>
    setState((prevState) => ({ ...prevState, ...data }));

  // Handler functions
  useLayoutEffect(() => {
    if (fuelBill.length > 0) getReservationFuelBills(_id).catch(console.error);
  }, []);

  useLayoutEffect(() => {
    if (bill) {
      const isUpdate = fuelBillArr.some((item) => item._id === bill._id);
      if (isUpdate) {
        const arr = fuelBillArr.map((i) => (i._id === bill._id ? bill : i));
        updateState({ fuelBillArr: arr });
      } else {
        updateState({ fuelBillArr: [...fuelBillArr, bill] });
      }
    }
  }, [bill]);

  /** Start Main Return **/
  return (
    <View style={{ flex: 1, marginTop: Sizes.fixPadding }}>
      <Text style={styles.vehicleTitleStyle}>
        {make} {model} {year}
      </Text>
      <Image
        source={{ uri: images[0] }}
        style={styles.imageStyle}
        resizeMode={"cover"}
      />
      <View style={styles.infoContainerStyle}>
        {SectionButtons()}
        {selectedSection === "Details" ? Details() : Bills()}
      </View>
    </View>
  );
  /** End Main Return **/

  /** Start Component Functions **/
  function Bills() {
    const onAdd = () =>
      navigation.navigate("CreateEditBillScreen", {
        item: {
          user,
          vehicle,
          reservationArchive: _id,
          fuelType,
        },
        screenType: "create",
      });

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
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      );
    };

    return (
      <View style={{ flex: 1 }}>
        {fuelBillArr.length > 0 ? billList() : NoBillItem()}
        <View style={{ alignItems: "flex-end", padding: Sizes.fixPadding }}>
          <TouchableOpacity activeOpacity={activeOpacity} onPress={onAdd}>
            <AntDesign
              name="pluscircleo"
              size={40}
              color={Colors.primaryColor}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function Details() {
    const onPress = () =>
      askToReturn ? CancelReturnAlert(vehicle) : ReturnAlert(vehicle);

    const formatDate = moment(departure.time).format("DD/MM/yyyy HH:mm");
    return (
      <View style={{ flex: 1, paddingTop: Sizes.fixPadding * 2 }}>
        <ScrollView style={{ flex: 1 }}>
          <View style={styles.locationDetailContainerStyle}>
            <View style={{ alignItems: "center" }}>
              <Text style={styles.locationDetailsStyle}>{t("From")}</Text>
              <TranslatedText
                value={departure.from}
                style={{ fontSize: 18, color: Colors.blackColor }}
              />
            </View>
            <View style={{ alignItems: "center" }}>
              <Text style={styles.locationDetailsStyle}>{t("To")}</Text>
              <TranslatedText
                value={arrival.to}
                style={{ fontSize: 18, color: Colors.blackColor }}
              />
            </View>
          </View>
          <View style={{ marginVertical: Sizes.fixPadding * 2 }}>
            <Text
              style={{ ...styles.vehicleTitleStyle, color: Colors.grayColor }}
            >
              {t("Departure Date")}
            </Text>
            <View style={styles.historyDateStyle}>
              <Text style={{ fontSize: 16, color: Colors.blackColor }}>
                {formatDate}
              </Text>
              <FontAwesome5
                name={"calendar"}
                size={24}
                color={Colors.grayColor}
              />
            </View>
          </View>
          <View style={{ marginHorizontal: Sizes.fixPadding }}>
            <Text style={{ fontSize: 16, color: Colors.blackColor }}>
              {`${t("Note")}: `}
            </Text>
            <TranslatedText value={note} style={styles.noteTextStyle} />
          </View>
        </ScrollView>
        <View style={{ opacity: askToReturn ? 0.8 : 1 }}>
          <FormButton
            text={askToReturn ? t("Cancel Return Request") : t("Return")}
            onPress={onPress}
          />
        </View>
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
              {t(item)}
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
      console.log("Error in getReservationFuelBills / InUseScreen");
    }
  }

  async function askToReturnVehicle(id: string) {
    try {
      const res = await axios({
        method: "PATCH",
        url: ApiConfigs.Vehicle.askToReturnVehicle + id,
        headers: { Authorization: `Bearer ${token}` },
        data: {
          odo: departure.odo + 300,
        },
      });
      if (res.status === 200) {
        Alert.alert(t("Success"), res.data.message, undefined, {
          cancelable: true,
        });
        updateState({ askToReturn: true });
      }
    } catch (e) {
      // @ts-ignore
      localAlert(t(e?.response?.data?.message));
      console.log("Error in askToReturnVehicle / InUseScreen");
    }
  }

  async function reUseVehicle(id: string) {
    try {
      const res = await axios({
        method: "PATCH",
        url: ApiConfigs.Vehicle.reUseVehicle + id,
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) {
        Alert.alert(t("Success"), res.data.message, undefined, {
          cancelable: true,
        });
        updateState({ askToReturn: false });
      }
    } catch (e) {
      // @ts-ignore
      localAlert(t(e?.response?.data?.message));
      console.log("Error in reUseVehicle / InUseScreen");
    }
  }

  /** End Server Functions **/

  /** Start Alert Functions **/
  function ReturnAlert(id: string) {
    return Alert.alert(
      t("Return Vehicle"),
      t("Do you want to return this vehicle"),
      [
        {
          text: t("Cancel"),
          style: "cancel",
        },
        {
          text: t("Return"),
          onPress: () => askToReturnVehicle(id),
          style: "default",
        },
      ],
      { cancelable: true }
    );
  }

  function CancelReturnAlert(id: string) {
    return Alert.alert(
      t("Cancel Return's Request"),
      t("Do you want to cancel return's request of this vehicle"),
      [
        {
          text: t("No"),
          style: "cancel",
        },
        {
          text: t("Yes"),
          onPress: () => reUseVehicle(id),
          style: "default",
        },
      ],
      { cancelable: true }
    );
  }

  /** End Alert Functions **/
};

export default InUseScreen;

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
  noteTextStyle: {
    marginTop: 5,
    color: Colors.grayColor,
    fontWeight: "500",
    fontSize: 16,
  },
});
