// react native
import {
  KeyboardTypeOptions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

// third party packages
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import { Asset } from "react-native-image-picker/src/types";
import axios from "axios";
import { useTranslation } from "react-i18next";

// project imports
import { Colors, Sizes } from "../../constants/styles";
import Header from "../../components/ScreenComponents/Header";
import GlobalData, { FuelBillType } from "../../GlobalData/GlobalData";
import TextFiled from "../../components/FormComponents/TextFiled";
import FormButton from "../../components/FormComponents/FormButton";
import UploadImage from "../../components/FormComponents/UploadImage";
import ApiConfigs from "../../constants/Apiconfigs";
import { localAlert } from "../../utils/LocalAlert";

// interfaces and types
type InputInfoType = {
  name: string;
  placeholder: string;
  keyboardType: KeyboardTypeOptions;
  editable: boolean;
};

//@ts-ignore
interface IForm extends FuelBillType {
  picture: Asset;
}

const CreateEditBillScreen = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const screenType: "edit" | "create" = route.params.screenType;
  const {
    user,
    vehicle,
    reservationArchive,
    picture,
    station,
    note,
    price,
    date,
    fuelVolume,
    fuelType,
    _id,
  }: FuelBillType = route.params.item;
  const { t } = useTranslation();

  // Yup inputs validation
  const schema = yup.object({
    fuelVolume: yup.number().moreThan(0, t("Enter fuel volume")),
    station: yup.string().required(t("Enter station name")),
    price: yup.number().moreThan(0, t("Enter price")),
  });

  // React-Hook-form for handling the form's inputs
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, dirtyFields },
  } = useForm<IForm>({
    defaultValues: {
      user,
      vehicle,
      reservationArchive,
      fuelType,
      date: date ? date : new Date(),
      fuelVolume: fuelVolume ? fuelVolume : 0,
      station: station ? station : "",
      price: price ? price : 0,
      note: note ? note : "",
      picture: picture ? { uri: picture } : {},
    },
    //@ts-ignore
    resolver: yupResolver(schema),
    reValidateMode: "onChange",
  });

  // Global state
  const token = GlobalData((state) => state.token);
  const setFormLoading = GlobalData((state) => state.setFormLoading);

  // Handler functions
  const setPicture = (file: Asset) => {
    setValue("picture", file);
  };

  const onSubmit = handleSubmit(
    (data) => (screenType === "edit" ? editBill(data) : createBill(data)),
    () => console.log(errors)
  );

  /** Start Main Return **/
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyColor }}>
      <StatusBar backgroundColor={Colors.primaryColor} />
      {/* Header */}
      <Header title={t("Create Bill")} onPress={() => navigation.pop()} />
      {/* Inputs */}
      <ScrollView
        style={{
          margin: Sizes.fixPadding * 3,
        }}
        showsVerticalScrollIndicator={false}
        automaticallyAdjustKeyboardInsets={true}
      >
        <View style={{ marginBottom: Sizes.fixPadding * 2 }}>
          <UploadImage
            setImage={setPicture}
            imageFile={picture ? { uri: picture } : null}
          />
        </View>
        {getArr().map((item, index) => renderItem({ item, index }))}
      </ScrollView>
      {/* Create Button */}
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 2,
          marginVertical: Sizes.fixPadding,
        }}
      >
        <FormButton
          text={`${screenType === "edit" ? t("Edit") : t("Create")} ${t(
            "Bill"
          )}`}
          onPress={onSubmit}
        />
      </View>
    </SafeAreaView>
  );

  /** End Main Return **/

  /** Start Component Functions **/
  function renderItem({ item, index }: { item: InputInfoType; index: number }) {
    return (
      <View key={index}>
        <Text style={styles.textFiledTitleStyle}>{item.placeholder}</Text>
        <TextFiled
          name={item.name}
          placeholder={item.placeholder}
          keyboardType={item.keyboardType}
          control={control}
          editable={item.editable}
        />
      </View>
    );
  }

  /** End Component Functions **/

  /** Start Server Functions **/
  async function editBill(data: IForm) {
    setFormLoading(true);
    try {
      const formData = new FormData();
      formData.append("reservationArchive", data.reservationArchive);
      formData.append("vehicle", data.vehicle);
      formData.append("user", data.user);
      formData.append("fuelType", data.fuelType);
      if (dirtyFields.fuelVolume) {
        formData.append("fuelVolume", `${data.fuelVolume}`);
      }
      if (dirtyFields.price) {
        formData.append("price", `${data.price}`);
      }
      if (dirtyFields.station) {
        formData.append("station", data.station);
      }
      if (dirtyFields.note) {
        formData.append("note", `${data.note}`);
      }
      if (dirtyFields.picture) {
        formData.append("picture", data.picture);
      }
      const res = await axios({
        method: "PATCH",
        url: ApiConfigs.FuelBill.edit + _id,
        headers: {
          Authorization: `Bearer ${token}`,
          accept: "application/json",
          "content-type": "multipart/form-data",
        },
        data: formData,
      });
      if (res.status === 200) {
        navigation.navigate("VehicleTabScreen", { bill: res.data.data });
      }
    } catch (e) {
      // @ts-ignore
      localAlert(t(e?.response?.data?.message));
      console.log("Error in editBill / CreateEditBillScreen");
    }
    setFormLoading(false);
  }

  async function createBill(data: IForm) {
    setFormLoading(true);
    try {
      const formData = new FormData();
      formData.append("reservationArchive", data.reservationArchive);
      formData.append("vehicle", data.vehicle);
      formData.append("user", data.user);
      formData.append("fuelVolume", `${data.fuelVolume}`);
      formData.append("price", `${data.price}`);
      formData.append("fuelType", data.fuelType);
      formData.append("station", data.station);
      formData.append("date", `${data.date}`);
      formData.append("note", `${data.note}`);
      if (data.picture.uri) {
        formData.append("picture", data.picture);
      }
      const res = await axios({
        method: "POST",
        url: ApiConfigs.FuelBill.create,
        headers: {
          Authorization: `Bearer ${token}`,
          accept: "application/json",
          "content-type": "multipart/form-data",
        },
        data: formData,
      });
      if (res.status === 201) {
        navigation.navigate("VehicleTabScreen", { bill: res.data.data });
      }
    } catch (e) {
      // @ts-ignore
      localAlert(t(e?.response?.data?.message));
      console.log("Error in createBill / CreateEditBillScreen");
    }
    setFormLoading(false);
  }

  /** End Server Functions **/

  function getArr(): InputInfoType[] {
    return [
      {
        name: "fuelType",
        placeholder: t("Fuel Type"),
        keyboardType: "default",
        editable: false,
      },
      {
        name: "station",
        placeholder: t("Station Name"),
        keyboardType: "default",
        editable: true,
      },
      {
        name: "fuelVolume",
        placeholder: t("Fuel Volume"),
        keyboardType: "numeric",
        editable: true,
      },
      {
        name: "price",
        placeholder: t("Price"),
        keyboardType: "numeric",
        editable: true,
      },
      {
        name: "note",
        placeholder: t("Note"),
        keyboardType: "default",
        editable: true,
      },
    ];
  }
};

export default CreateEditBillScreen;

const styles = StyleSheet.create({
  textFiledTitleStyle: {
    fontWeight: "500",
    color: Colors.blackColor,
    fontSize: 16,
    marginLeft: 5,
    marginBottom: Sizes.fixPadding,
  },
});
