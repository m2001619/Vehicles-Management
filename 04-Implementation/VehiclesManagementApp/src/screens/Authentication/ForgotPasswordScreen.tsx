// react native
import { Alert, SafeAreaView, ScrollView, StatusBar, View } from "react-native";

// third party packages
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios/index";
import { useTranslation } from "react-i18next";

// project imports
import { Colors, Sizes } from "../../constants/styles";
import Header from "../../components/ScreenComponents/Header";
import TextFiled from "../../components/FormComponents/TextFiled";
import ApiConfigs from "../../constants/Apiconfigs";
import { localAlert } from "../../utils/LocalAlert";
import GlobalData from "../../GlobalData/GlobalData";
import FormButton from "../../components/FormComponents/FormButton";

type FormType = { email: string };

const ForgotPasswordScreen = ({ navigation }: { navigation: any }) => {
  const { t } = useTranslation();

  // Yup inputs validation
  const schema = yup.object({
    email: yup
      .string()
      .required(t("Enter your email"))
      .email(t("Incorrect Email")),
  });

  // React-Hook-form for handling the form's inputs
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormType>({
    defaultValues: {
      email: "",
    },
    resolver: yupResolver(schema),
    reValidateMode: "onChange",
  });

  // Global state
  const setFormLoading = GlobalData((state) => state.setFormLoading);

  // Handler functions
  const onSubmit = handleSubmit(
    (data) => ForgotPassword(data),
    () => console.log(errors)
  );

  /** Start Main Return **/
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyColor }}>
      <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
      <Header title={t("Forgot Password")} onPress={() => navigation.pop()} />
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.bodyColor,
          justifyContent: "space-between",
        }}
      >
        <ScrollView style={{ padding: Sizes.fixPadding * 2 }}>
          <TextFiled
            name={"email"}
            placeholder={t("Email")}
            keyboardType={"email-address"}
            control={control}
          />
        </ScrollView>
        <View style={{ padding: Sizes.fixPadding * 2 }}>
          <FormButton text={t("Reset Password")} onPress={onSubmit} />
        </View>
      </View>
    </SafeAreaView>
  );
  /** End Main Return **/

  /** Start Server Functions **/
  async function ForgotPassword(data: FormType) {
    setFormLoading(true);
    try {
      const res = await axios({
        method: "POST",
        url: ApiConfigs.Auth.forgotPassword,
        data: {
          email: data.email,
          role: "user",
        },
      });
      if (res.status === 200) {
        Alert.alert(t("success"), t(res.data.message), [
          {
            text: t("ok"),
            onPress: () => navigation.push("ResetPasswordScreen"),
            style: "cancel",
          },
        ]);
      }
    } catch (e) {
      // @ts-ignore
      localAlert(t(e?.response?.data?.message));
      console.log("Error in Screens / ForgotPasswordScreen / ForgotPassword");
    }
    setFormLoading(false);
  }

  /** End Server Functions **/
};

export default ForgotPasswordScreen;
