import { useLayoutEffect } from "react";

// react native
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";

// third party packages
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios/index";
import DialogContainer from "react-native-dialog/lib/Container";
import { useTranslation } from "react-i18next";

// project imports
import { activeOpacity, Colors, Sizes } from "../../constants/styles";
import TextFiled from "../FormComponents/TextFiled";
import FormButton from "../FormComponents/FormButton";
import GlobalData from "../../GlobalData/GlobalData";
import ApiConfigs from "../../constants/Apiconfigs";

// interfaces and types
type FormType = {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
};

// constants
const { width } = Dimensions.get("window");

const ResetPasswordDialog = ({
  showDialog,
  onCancelPress,
}: {
  showDialog: boolean;
  onCancelPress: () => void;
}) => {
  const { t } = useTranslation();

  // Global state
  const token = GlobalData((state) => state.token);
  const setToken = GlobalData((state) => state.setToken);
  const setFormLoading = GlobalData((state) => state.setFormLoading);

  // Yup inputs validation
  const schema = yup.object({
    currentPassword: yup.string().required(t("Enter current password")),
    newPassword: yup
      .string()
      .required(t("Enter your password"))
      .min(8, t("Password must contain at least 8 characters")),
    newPasswordConfirm: yup
      .string()
      .oneOf([yup.ref("newPassword")], t("Passwords must match")),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormType>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      newPasswordConfirm: "",
    },
    //@ts-ignore
    resolver: yupResolver(schema),
    reValidateMode: "onChange",
  });

  // Handler Functions
  const onSubmit = handleSubmit(
    (data) => updatePassword(data),
    () => console.log(errors)
  );

  useLayoutEffect(() => {
    reset();
  }, [showDialog]);

  /** Start Main Return **/
  return (
    <DialogContainer
      visible={showDialog}
      onBackdropPress={onCancelPress}
      contentStyle={styles.dialogStyle}
      headerStyle={{ margin: 0.0, padding: 0.0 }}
    >
      <ScrollView>
        <TextFiled
          name={"currentPassword"}
          placeholder={t("Current Password")}
          keyboardType={"default"}
          control={control}
        />
        <TextFiled
          name={"newPassword"}
          placeholder={t("New Password")}
          keyboardType={"default"}
          control={control}
        />
        <TextFiled
          name={"newPasswordConfirm"}
          placeholder={t("Confirm Password")}
          keyboardType={"default"}
          control={control}
        />
      </ScrollView>
      <View style={styles.dialogButtonContainerStyle}>
        <TouchableOpacity activeOpacity={activeOpacity} onPress={onCancelPress}>
          <Text style={{ fontSize: 16, color: Colors.grayColor }}>
            {t("Cancel")}
          </Text>
        </TouchableOpacity>
        <View style={{ width: 100 }}>
          <FormButton text={t("Submit")} onPress={onSubmit} />
        </View>
      </View>
    </DialogContainer>
  );

  /** End Main Return **/

  /** Start Server Functions **/
  async function updatePassword(data: FormType) {
    setFormLoading(true);
    try {
      const res = await axios({
        method: "PATCH",
        url: ApiConfigs.User.updatePassword,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: data,
      });
      if (res.status === 200) {
        setToken(res.data.token);
        onCancelPress();
        Alert.alert(t("Success"), t("Password has changed Successfully"));
      }
    } catch (e) {
      // @ts-ignore
      Alert.alert("Error", t(e?.response?.data?.message));
      console.log("Error in updatePassword / ResetPasswordDialog");
    }
    setFormLoading(false);
  }

  /** End Server Functions **/
};

export default ResetPasswordDialog;

const styles = StyleSheet.create({
  dialogStyle: {
    borderRadius: Sizes.fixPadding,
    justifyContent: "center",
    backgroundColor: Colors.bodyColor,
    padding: Sizes.fixPadding * 2,
    width: width - Sizes.fixPadding * 2,
  },
  dialogButtonContainerStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 5,
    marginTop: Sizes.fixPadding,
  },
  dialogButtonStyle: {
    backgroundColor: Colors.primaryColor,
    padding: Sizes.fixPadding,
    borderRadius: 5,
  },
  dialogButtonTextStyle: {
    fontWeight: "500",
    fontSize: 16,
    color: Colors.whiteColor,
  },
});
