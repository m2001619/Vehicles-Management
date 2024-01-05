import { useState } from "react";

// react native
import {
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// third party packages
import { useController, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useTranslation } from "react-i18next";

// project imports
import { activeOpacity, Colors, Sizes } from "../../constants/styles";
import GlobalData from "../../GlobalData/GlobalData";
import { pickImage } from "../../utils/Media";
import FormButton from "../../components/FormComponents/FormButton";
import ApiConfigs from "../../constants/Apiconfigs";
import { localAlert } from "../../utils/LocalAlert";
import ResetPasswordDialog from "../../components/Dialogs/ResetPasswordDialog";
import { lng } from "../../utils/Translater";

// assets
import AntDesign from "react-native-vector-icons/AntDesign";
import LinearGradient from "react-native-linear-gradient";

// Interfaces and Types
import { ImageSourcePropType } from "react-native/Libraries/Image/Image";
import { Asset } from "react-native-image-picker/src/types";

type FormType = {
  email: string;
  password: string;
  name: string;
  phoneNumber: string;
  file: Asset | null;
};

const EditProfileScreen = ({ navigation }: { navigation: any }) => {
  const { t } = useTranslation();

  // Local State
  const [showDialog, setShowDialog] = useState<boolean>(false);

  // Global state
  const { photo, email, phoneNumber, name } = GlobalData(
    (state) => state.userInfo
  );
  const token = GlobalData((state) => state.token);
  const setUserInfo = GlobalData((state) => state.setUserInfo);
  const setFormLoading = GlobalData((state) => state.setFormLoading);

  // Yup inputs validation
  const schema = yup.object({
    name: yup.string().min(3, t("Enter Name")),
  });

  // React-Hook-form for handling the form's inputs
  const {
    control,
    handleSubmit,
    formState: { errors, dirtyFields, isDirty },
    setValue,
    watch,
  } = useForm<FormType>({
    defaultValues: {
      email,
      phoneNumber,
      name,
      password: "***********",
      file: {
        uri: photo,
      },
    },
    //@ts-ignore
    resolver: yupResolver(schema),
    reValidateMode: "onChange",
  });

  // Handler functions
  const onCancel = () => setShowDialog(false);

  /** Start Main Return **/
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyColor }}>
      <StatusBar backgroundColor={Colors.primaryColor} />
      {Header()}
      {UserImage()}
      {InputList()}
      {UpdateButton()}
      <ResetPasswordDialog showDialog={showDialog} onCancelPress={onCancel} />
    </SafeAreaView>
  );
  /** End Main Return **/

  /** Start Component Functions **/
  function UpdateButton() {
    const onPress = handleSubmit((data) => updateMe(data));
    return (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 4,
          marginVertical: Sizes.fixPadding * 2,
        }}
      >
        <FormButton
          text={t("Update")}
          onPress={onPress}
          disable={!!errors.name || !isDirty}
        />
      </View>
    );
  }

  function InputList() {
    return (
      <View
        style={{
          flex: 1,
          paddingHorizontal: Sizes.fixPadding * 4,
          marginTop: 60,
        }}
      >
        {InfoField({
          title: t("Name"),
          name: "name",
        })}
        {InfoField({
          title: t("Email"),
          name: "email",
          editable: false,
        })}
        {InfoField({
          title: t("Phone Number"),
          name: "phoneNumber",
          editable: false,
        })}
        {InfoField({
          title: t("Password"),
          name: "password",
          onPress: () => setShowDialog(true),
          touchableText: "Change",
          editable: false,
        })}
      </View>
    );
  }

  function InfoField({
    title,
    touchableText,
    onPress,
    name,
    editable = true,
  }: {
    title: string;
    onPress?: () => void;
    touchableText?: string;
    name: "email" | "password" | "name" | "phoneNumber";
    editable?: boolean;
  }) {
    const { field, fieldState } = useController({
      control,
      name: name,
    });

    const { value, onChange, ref, onBlur } = field;
    const { error } = fieldState;

    return (
      <View style={{ marginBottom: Sizes.fixPadding * 3 }}>
        <Text
          style={{
            color: error ? Colors.errorColor : Colors.grayColor,
            fontWeight: "500",
          }}
        >
          {title}
        </Text>
        <View
          style={{
            ...styles.infoContainerTextStyle,
            borderColor: error ? Colors.errorColor : Colors.grayColor,
          }}
        >
          <TextInput
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            ref={ref}
            style={styles.infoTextStyle}
            editable={editable}
          />
          <TouchableOpacity
            style={{ display: touchableText ? "flex" : "none" }}
            activeOpacity={0.9}
            onPress={onPress}
          >
            <Text style={{ color: Colors.primaryColor }}>{touchableText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function UserImage() {
    const file = watch("file");
    const onPress = async () => {
      const result = await pickImage();
      if (result) {
        setValue("file", result, { shouldDirty: true });
      }
    };
    const photoSource: ImageSourcePropType = file
      ? { uri: file.uri }
      : require("../../constants/images/user.png");
    return (
      <View>
        <LinearGradient
          colors={linearGradientColor}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.imageContainerStyle}
        >
          <Image
            source={photoSource}
            resizeMode={"cover"}
            style={{ width: 100, height: 100, borderRadius: 50 }}
          />
          <TouchableOpacity
            activeOpacity={activeOpacity}
            onPress={onPress}
            style={{ marginTop: Sizes.fixPadding }}
          >
            <Text style={styles.uploadTextStyle}>{t("Upload")}</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }

  function Header() {
    const onPress = () => navigation.pop();
    return (
      <View style={styles.headerContainerStyle}>
        <TouchableOpacity activeOpacity={activeOpacity} onPress={onPress}>
          <AntDesign
            name={lng === "ar" ? "arrowright" : "arrowleft"}
            size={24}
            color={Colors.whiteColor}
          />
        </TouchableOpacity>
      </View>
    );
  }

  /** End Component Functions **/

  /** Start Server Functions **/
  async function updateMe(data: FormType) {
    setFormLoading(true);
    try {
      const formData = new FormData();
      if (dirtyFields.file) {
        formData.append("photo", data.file);
      }
      if (dirtyFields.name) {
        formData.append("name", data.name);
      }
      const res = await axios({
        method: "POST",
        url: ApiConfigs.User.updateMe,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      });
      if (res.status === 200) {
        setUserInfo({ name: res.data.data.name });
        if (data.file?.uri) {
          setUserInfo({ photo: data.file.uri });
        }
        navigation.pop();
        localAlert(t("Updated Successfully"));
      }
    } catch (e) {
      // @ts-ignore
      t(e?.response?.data?.message);
      console.log("Error in updateMe / EditProfileScreen");
    }
    setFormLoading(false);
  }

  /** End Server Functions **/
};
export default EditProfileScreen;

const styles = StyleSheet.create({
  headerContainerStyle: {
    backgroundColor: Colors.primaryColor,
    height: 80,
    justifyContent: "center",
    alignItems: lng === "ar" ? "flex-start" : "flex-end",
    paddingHorizontal: Sizes.fixPadding * 2,
  },
  imageContainerStyle: {
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  uploadTextStyle: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.primaryColor,
  },
  infoContainerTextStyle: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
  },
  infoTextStyle: {
    flex: 1,
    color: Colors.blackColor,
    fontWeight: "500",
    fontSize: 16,
  },
});

const linearGradientColor = [
  Colors.primaryColor,
  Colors.primaryColor,
  Colors.primaryColor,
  Colors.primaryColor,
  Colors.primaryColor,
  Colors.primaryColor,
  Colors.primaryColor,
  Colors.primaryColor,
  Colors.primaryColor,
  Colors.primaryColor,
  Colors.primaryColor,
  Colors.primaryColor,
  Colors.primaryColor,
  Colors.primaryColor,
  Colors.primaryColor,
  Colors.primaryColor,
  Colors.bodyColor,
  Colors.bodyColor,
  Colors.bodyColor,
  Colors.bodyColor,
  Colors.bodyColor,
  Colors.bodyColor,
  Colors.bodyColor,
  Colors.bodyColor,
  Colors.bodyColor,
  Colors.bodyColor,
  Colors.bodyColor,
  Colors.bodyColor,
  Colors.bodyColor,
  Colors.bodyColor,
  Colors.bodyColor,
  Colors.bodyColor,
];
