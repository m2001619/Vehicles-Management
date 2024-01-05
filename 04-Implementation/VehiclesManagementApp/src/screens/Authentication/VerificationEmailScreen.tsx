// react native
import { Alert, SafeAreaView, ScrollView, StatusBar, View } from "react-native";

// third party packages
import { useForm } from "react-hook-form";
import * as yup from "yup";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { yupResolver } from "@hookform/resolvers/yup";

// project imports
import { Colors, Sizes } from "../../constants/styles";
import Header from "../../components/ScreenComponents/Header";
import TextFiled from "../../components/FormComponents/TextFiled";
import GlobalData from "../../GlobalData/GlobalData";
import FormButton from "../../components/FormComponents/FormButton";
import ApiConfigs from "../../constants/Apiconfigs";
import { localAlert } from "../../utils/LocalAlert";

type FormType = { code: string };

const VerificationEmailScreen = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const accountData = route.params.accountData;
  const { t } = useTranslation();

  // Yup inputs validation
  const schema = yup.object({
    code: yup.string().required(t("Enter code")),
  });

  // React-Hook-form for handling the form's inputs
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormType>({
    defaultValues: {
      code: "",
    },
    resolver: yupResolver(schema),
    reValidateMode: "onChange",
  });

  // Global state
  const setFormLoading = GlobalData((state) => state.setFormLoading);

  // Handler functions
  const onSubmit = handleSubmit(
    (data) => SignUp(data),
    () => console.log(errors)
  );

  /** Start Main Return **/
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyColor }}>
      <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
      <Header
        title={t("Verification Email")}
        onPress={() => navigation.pop()}
      />
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.bodyColor,
          justifyContent: "space-between",
        }}
      >
        <ScrollView style={{ padding: Sizes.fixPadding * 2 }}>
          <TextFiled
            name={"code"}
            placeholder={t("Enter verification code")}
            keyboardType={"default"}
            control={control}
          />
        </ScrollView>
        <View style={{ padding: Sizes.fixPadding * 2 }}>
          <FormButton text={t("Verify Email")} onPress={onSubmit} />
        </View>
      </View>
    </SafeAreaView>
  );
  /** End Main Return **/

  /** Start Server Functions **/
  async function SignUp(data: FormType) {
    setFormLoading(true);
    try {
      const res = await axios({
        method: "POST",
        url: ApiConfigs.Auth.signup,
        data: { ...accountData, token: data.code },
      });
      if (res.status === 200) {
        Alert.alert(t("success"), t(res.data.message), [
          {
            text: t("ok"),
            style: "cancel",
            onPress: () => navigation.navigate("LoginScreen"),
          },
        ]);
      } else {
        localAlert(t(res.data.message));
      }
    } catch (e) {
      // @ts-ignore
      localAlert(t(e?.response?.data?.message));
      console.log("Error in Data / VerificationEmailScreen / SignUp");
    }
    setFormLoading(false);
  }

  /** End Server Functions **/
};

export default VerificationEmailScreen;
