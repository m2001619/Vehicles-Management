// react native
import { SafeAreaView, ScrollView, StatusBar, View } from "react-native";

// third party packages
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useTranslation } from "react-i18next";

// project imports
import { Colors, Sizes } from "../../constants/styles";
import Header from "../../components/ScreenComponents/Header";
import TextFiled from "../../components/FormComponents/TextFiled";
import ApiConfigs from "../../constants/Apiconfigs";
import { localAlert } from "../../utils/LocalAlert";
import GlobalData from "../../GlobalData/GlobalData";
import FormButton from "../../components/FormComponents/FormButton";

type FormType = { token: string; password: string; passwordConfirm: string };
const ResetPasswordScreen = ({ navigation }: { navigation: any }) => {
  const { t } = useTranslation();

  // Yup inputs validation
  const schema = yup.object({
    token: yup.string().required(t("Enter code")),
    password: yup
      .string()
      .required(t("Enter your password"))
      .min(8, t("Password must contain at least 8 characters")),
    passwordConfirm: yup
      .string()
      .oneOf([yup.ref("password")], t("Passwords must match")),
  });

  // React-Hook-form for handling the form's inputs
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormType>({
    defaultValues: {
      token: "",
      password: "",
      passwordConfirm: "",
    },
    //@ts-ignore
    resolver: yupResolver(schema),
    reValidateMode: "onChange",
  });

  // Global state
  const setToken = GlobalData((state) => state.setToken);
  const setUserInfo = GlobalData((state) => state.setUserInfo);
  const setFormLoading = GlobalData((state) => state.setFormLoading);

  // Handler functions
  const onSubmit = handleSubmit(
    (data) => ResetPassword(data),
    () => console.log(errors)
  );

  /** Start Main Return **/
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyColor }}>
      <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
      <Header title={t("Reset Password")} onPress={() => navigation.pop()} />
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.bodyColor,
          justifyContent: "space-between",
        }}
      >
        <ScrollView style={{ padding: Sizes.fixPadding * 2 }}>
          <TextFiled
            name={"token"}
            placeholder={t("Enter verification code")}
            keyboardType={"default"}
            control={control}
          />
          <TextFiled
            name={"password"}
            placeholder={t("Password")}
            keyboardType={"default"}
            control={control}
          />
          <TextFiled
            name={"passwordConfirm"}
            placeholder={t("Confirm Password")}
            keyboardType={"default"}
            control={control}
          />
        </ScrollView>
        <View style={{ padding: Sizes.fixPadding * 2 }}>
          <FormButton text={t("Apply")} onPress={onSubmit} />
        </View>
      </View>
    </SafeAreaView>
  );
  /** End Main Return **/

  /** Start Server Functions **/
  async function ResetPassword(data: FormType) {
    setFormLoading(true);
    try {
      const res = await axios({
        method: "PATCH",
        url: ApiConfigs.Auth.resetPassword,
        data,
      });
      if (res.status === 200) {
        setToken(res.data.token);
        setUserInfo({
          role: res.data.data.role,
          block: res.data.data.block,
          reservationArchive: res.data.data.reservationArchive,
          name: res.data.data.name,
          email: res.data.data.email,
          phoneNumber: res.data.data.phoneNumber,
          id: res.data.data.id,
          fuelBill: res.data.data.fuelBill,
        });
        navigation.navigate("BottomTabBar");
      }
    } catch (e) {
      // @ts-ignore
      localAlert(t(e?.response?.data?.message));
      console.log("Error in Screens / ResetPasswordScreen / ResetPassword");
    }
    setFormLoading(false);
  }

  /** End Server Functions **/
};

export default ResetPasswordScreen;
