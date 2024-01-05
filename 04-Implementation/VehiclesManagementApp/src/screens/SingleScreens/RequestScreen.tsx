// react native
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// third party packages
import moment from "moment/moment";
import axios from "axios/index";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

// project imports
import GlobalData from "../../GlobalData/GlobalData";
import { activeOpacity, Colors, Sizes } from "../../constants/styles";
import ApiConfigs from "../../constants/Apiconfigs";
import { localAlert } from "../../utils/LocalAlert";
import RequestDialog from "../../components/Dialogs/RequestDialog";
import TranslatedText from "../../components/TranslatedText";

// assets
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

// interfaces and types
import { RequestType, VehicleType } from "../../GlobalData/GlobalData";

// constants
const { width } = Dimensions.get("window");

const RequestScreen = ({
  vehicleInfo,
  requestInfo,
  deleteRequestInfo,
}: {
  vehicleInfo: VehicleType;
  requestInfo: RequestType;
  deleteRequestInfo: () => void;
}) => {
  const { t } = useTranslation();

  // component props
  const { images, make, model, year } = vehicleInfo;

  // Local state
  const [request, setRequest] = useState(requestInfo);
  const [showDialog, setShowDialog] = useState(false);
  const { from, to, note, _id, date } = request;

  // Global state
  const token = GlobalData((state) => state.token);
  const setUserInfo = GlobalData((state) => state.setUserInfo);

  // React-Hook-form for handling the form's inputs
  const {
    control,
    handleSubmit,
    formState: { defaultValues },
    reset,
  } = useForm<RequestType>({
    defaultValues: request,
    reValidateMode: "onSubmit",
  });

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
      <View style={styles.infoContainerStyle}>{Details()}</View>
      {EditDialog()}
    </View>
  );
  /** End Main Return **/

  /** Start Component Functions **/
  function Details() {
    const formatDate = moment(date).format("DD/MM/yyyy HH:mm");
    const onDelete = () => DeleteAlert();
    const onEdit = () => setShowDialog(true);
    return (
      <View style={{ flex: 1, paddingTop: Sizes.fixPadding * 2 }}>
        <ScrollView style={{ flex: 1 }}>
          <View style={styles.locationDetailContainerStyle}>
            <View style={{ alignItems: "center" }}>
              <Text style={styles.locationDetailsStyle}>{t("From")}</Text>
              <TranslatedText
                value={from}
                style={{ fontSize: 18, color: Colors.blackColor }}
              />
            </View>
            <View style={{ alignItems: "center" }}>
              <Text style={styles.locationDetailsStyle}>{t("To")}</Text>
              <TranslatedText
                value={to}
                style={{ fontSize: 18, color: Colors.blackColor }}
              />
            </View>
          </View>
          <View style={{ marginVertical: Sizes.fixPadding * 2 }}>
            <Text
              style={{ ...styles.vehicleTitleStyle, color: Colors.grayColor }}
            >
              {t("Request Date")}
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
            <Text
              style={{
                fontSize: 16,
                color: Colors.blackColor,
                marginBottom: 5,
              }}
            >
              {`${t("Note")}: `}
            </Text>
            <TranslatedText value={note} style={styles.noteTextStyle} />
          </View>
        </ScrollView>
        <View style={styles.buttonContainerStyle}>
          <TouchableOpacity
            activeOpacity={activeOpacity}
            onPress={onDelete}
            style={{
              padding: Sizes.fixPadding,
              borderRadius: 5,
              backgroundColor: Colors.errorColor,
            }}
          >
            <Text style={styles.deleteButtonTextStyle}>
              {t("Delete Request")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={activeOpacity}
            onPress={onEdit}
            style={{
              padding: Sizes.fixPadding,
              borderRadius: 5,
              backgroundColor: Colors.greenColor,
            }}
          >
            <Text style={styles.deleteButtonTextStyle}>
              {t("Edit Request")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function EditDialog() {
    const onCancelPress = () => {
      setShowDialog(false);
      reset(defaultValues);
    };
    const onSubmit = handleSubmit((data) => editRequest(data));
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
  function DeleteAlert() {
    return Alert.alert(
      t("Delete Request"),
      t("Do you want to delete this request"),
      [
        {
          text: t("Cancel"),
          style: "cancel",
        },
        {
          text: t("Delete"),
          onPress: () => deleteRequest(),
          style: "default",
        },
      ],
      { cancelable: true }
    );
  }

  /** End Alert Functions **/

  /** Start Server Functions **/
  async function editRequest(data: RequestType) {
    try {
      const formData = new FormData();
      formData.append("from", data.from);
      formData.append("to", data.to);
      formData.append("note", data.note);
      const res = await axios({
        method: "PATCH",
        url: ApiConfigs.Request.update + _id,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      });
      if (res.status === 200) {
        setRequest(res.data.data);
        reset(res.data.data);
        setShowDialog(false);
      }
    } catch (e) {
      // @ts-ignore
      localAlert(t(e?.response?.data?.message));
      console.log("Error in updateRequest / MyArchivesScreen");
    }
  }

  async function deleteRequest() {
    try {
      const res = await axios({
        method: "DELETE",
        url: ApiConfigs.Request.delete + _id,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 204) {
        setUserInfo({ request: undefined });
        deleteRequestInfo();
      }
    } catch (e) {
      // @ts-ignore
      localAlert(t(e?.response?.data?.message));
      console.log("Error in deleteRequest / MyArchivesScreen");
    }
  }

  /** End Server Functions **/
};

export default RequestScreen;

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
    color: Colors.grayColor,
    fontWeight: "500",
    fontSize: 16,
  },
  deleteButtonTextStyle: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.whiteColor,
  },
  buttonContainerStyle: {
    marginVertical: Sizes.fixPadding * 2,
    marginHorizontal: Sizes.fixPadding,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
