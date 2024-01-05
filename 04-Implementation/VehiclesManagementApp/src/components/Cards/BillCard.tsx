import { useState } from "react";

// react native
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// third party packages
import moment from "moment/moment";
import axios from "axios";
import { useTranslation } from "react-i18next";

// project imports
import GlobalData, { FuelBillType } from "../../GlobalData/GlobalData";
import { activeOpacity, Colors, Sizes } from "../../constants/styles";
import ImageDialog from "../Dialogs/ImageDialog";
import ApiConfigs from "../../constants/Apiconfigs";
import { localAlert } from "../../utils/LocalAlert";
import TranslatedText from "../TranslatedText";

// interfaces and types
type UseStateType = {
  showImage: boolean;
  showImageUrl: "";
};

const BillCard = ({
  item,
  index,
  navigation,
  removeBill = () => {},
  isArchive = false,
}: {
  item: FuelBillType;
  index: number;
  navigation: any;
  removeBill?: (id: string) => void;
  isArchive?: boolean;
}) => {
  const { t } = useTranslation();

  // navigation route params
  const { station, note, price, date, fuelVolume, fuelType, _id, picture } =
    item;
  const formatDate = moment(date).format("DD/MM/yyyy HH:mm");

  // Global state
  const token = GlobalData((state) => state.token);

  // Local state
  const [state, setState] = useState<UseStateType>({
    showImage: false,
    showImageUrl: "",
  });
  const { showImage, showImageUrl } = state;
  const updateState = (data: any) =>
    setState((prevState) => ({ ...prevState, ...data }));

  // Handler functions
  const onShow = () => updateState({ showImage: true, showImageUrl: picture });
  const cancelImage = () => updateState({ showImage: false });
  const onDelete = () => DeleteAlert(_id);
  const onEdit = () =>
    navigation.navigate("CreateEditBillScreen", {
      item,
      screenType: "edit",
    });

  /** Start Main Return **/
  return (
    <View
      style={{
        ...styles.billBoxStyle,
        marginTop: index === 0 ? Sizes.fixPadding * 2 : Sizes.fixPadding,
      }}
    >
      <BillInfo title={`${t("Station")}:`} value={station} />
      <BillInfo title={`${t("Fuel Type")}:`} value={t(fuelType)} />
      <BillInfo title={`${t("Fuel Volume")}:`} value={`${fuelVolume} L`} />
      <BillInfo title={`${t("Price")}:`} value={price} />
      <BillInfo title={`${t("Date")}:`} value={formatDate} />
      <BillInfo
        title={`${t("Note")}:`}
        value={note ? note : `${t("No Note")}.`}
        isTranslate={true}
      />
      <View style={styles.buttonContainerStyle}>
        {picture && (
          <BillButton
            onPress={onShow}
            color={Colors.primaryColor}
            text={t("Show")}
          />
        )}
        {!isArchive && (
          <BillButton
            onPress={onDelete}
            color={Colors.errorColor}
            text={t("Delete")}
          />
        )}
        {!isArchive && (
          <BillButton
            onPress={onEdit}
            color={Colors.greenColor}
            text={t("Edit")}
          />
        )}
      </View>
      {showImage && (
        <ImageDialog
          show={showImage}
          uri={showImageUrl}
          cancelImage={cancelImage}
        />
      )}
    </View>
  );

  /** End Main Return **/

  /** Start Component Functions **/
  function BillInfo({
    title,
    value,
    isTranslate,
  }: {
    title: string;
    value: any;
    isTranslate?: boolean;
  }) {
    return (
      <View style={styles.billInfoStyle}>
        <Text style={{ color: Colors.blackColor, fontWeight: "500" }}>
          {title}
        </Text>
        {isTranslate ? (
          <TranslatedText value={value} style={styles.billTextStyle} />
        ) : (
          <Text style={styles.billTextStyle}>{value}</Text>
        )}
      </View>
    );
  }

  function BillButton({
    onPress,
    color,
    text,
  }: {
    onPress: () => void;
    color: string;
    text: string;
  }) {
    return (
      <TouchableOpacity
        activeOpacity={activeOpacity}
        onPress={onPress}
        style={{
          ...styles.buttonStyle,
          backgroundColor: color,
        }}
      >
        <Text style={styles.buttonTextStyle}>{text}</Text>
      </TouchableOpacity>
    );
  }

  /** End Component Functions **/

  /** Start Server Functions **/
  async function deleteFuelBill(id: string) {
    try {
      const res = await axios({
        method: "DELETE",
        url: ApiConfigs.FuelBill.delete + id,
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 204) {
        removeBill(id);
        localAlert(t("Bill Deleted Successfully"));
      }
    } catch (e) {
      // @ts-ignore
      localAlert(t(e?.response?.data?.message));
      console.log("Error in deleteFuelBills / InUseScreen");
    }
  }

  function DeleteAlert(id: string) {
    return Alert.alert(
      t("Delete Bill"),
      t("Do you want to delete this Bill"),
      [
        {
          text: t("Cancel"),
          style: "cancel",
        },
        {
          text: t("Delete"),
          onPress: () => deleteFuelBill(id),
          style: "default",
        },
      ],
      { cancelable: true }
    );
  }

  /** End Server Functions **/
};

export default BillCard;

const styles = StyleSheet.create({
  billBoxStyle: {
    backgroundColor: Colors.whiteColor,
    padding: Sizes.fixPadding * 2,
    borderWidth: 0.5,
    borderColor: Colors.grayColor,
    borderRadius: 5,
    marginVertical: Sizes.fixPadding,
  },
  billInfoStyle: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: Sizes.fixPadding * 0.5,
  },
  billTextStyle: {
    color: Colors.grayColor,
    fontWeight: "500",
    marginLeft: 5,
  },
  buttonContainerStyle: {
    marginTop: Sizes.fixPadding,
    flexDirection: "row",
  },
  buttonStyle: {
    padding: Sizes.fixPadding,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: Sizes.fixPadding,
    alignItems: "center",
  },
  buttonTextStyle: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.whiteColor,
  },
});
