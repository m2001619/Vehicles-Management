// react native
import {
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
import { useForm } from "react-hook-form";
import * as yup from "yup";
import axios from "axios/index";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";

// project imports
import { activeOpacity, Colors, Sizes } from "../../constants/styles";
import { yupResolver } from "@hookform/resolvers/yup";
import TextFiled from "../../components/FormComponents/TextFiled";
import ApiConfigs from "../../constants/Apiconfigs";
import { localAlert } from "../../utils/LocalAlert";
import GlobalData from "../../GlobalData/GlobalData";
import FormButton from "../../components/FormComponents/FormButton";
import { getRNFToken } from "../../utils/Notification";

type FormType = { email: string; password: string };

const LoginScreen = ({ navigation }: { navigation: any }) => {
  const { t } = useTranslation();

  // Yup inputs validation
  const schema = yup.object({
    email: yup
      .string()
      .required(t("Enter your email"))
      .email(t("Incorrect Email")),
    password: yup
      .string()
      .required(t("Enter your password"))
      .min(8, t("Password must contain at least 8 characters")),
  });

  // React-Hook-form for handling the form's inputs
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormType>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(schema),
    reValidateMode: "onChange",
  });

  // Global state
  const setToken = GlobalData((state) => state.setToken);
  const setUserInfo = GlobalData((state) => state.setUserInfo);
  const setFormLoading = GlobalData((state) => state.setFormLoading);

  // Handler functions
  const onSubmit = handleSubmit(
    (data) => Login(data),
    () => console.log(errors)
  );

  /** Start Main Return **/
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyColor }}>
      <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
      <View style={styles.containerStyle}>
        <ScrollView style={{ paddingHorizontal: Sizes.fixPadding * 4 }}>
          {HeaderIcon()}
          {Title()}
          <TextFiled
            name={"email"}
            placeholder={t("Email")}
            keyboardType={"email-address"}
            control={control}
          />
          <TextFiled
            name={"password"}
            placeholder={t("Password")}
            keyboardType={"default"}
            control={control}
          />
          {ForgotPassword()}
          <FormButton text={t("Login")} onPress={onSubmit} />
          {DontAccountInfo()}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
  /** End Main Return **/

  /** Start Component Functions **/
  function HeaderIcon() {
    return (
      <View style={{ alignItems: "center" }}>
        <Image
          source={require("./../../constants/images/authIcon.png")}
          style={styles.headerIconStyle}
          resizeMode={"contain"}
        />
      </View>
    );
  }

  function Title() {
    return (
      <View
        style={{ marginBottom: Sizes.fixPadding * 2, alignItems: "center" }}
      >
        <Text style={styles.titleTextStyle}>{t("Log In Now")}</Text>
        <Text style={styles.titleText2Style}>
          {t("Please log in to continue using our app")}
        </Text>
      </View>
    );
  }

  function ForgotPassword() {
    const onPress = () => navigation.push("ForgotPasswordScreen");
    return (
      <TouchableOpacity
        activeOpacity={activeOpacity}
        onPress={onPress}
        style={styles.forgotPasswordButtonStyle}
      >
        <Text
          style={{ color: Colors.grayColor, fontWeight: "800", fontSize: 16 }}
        >
          {t("Forgot Password ?")}
        </Text>
      </TouchableOpacity>
    );
  }

  function DontAccountInfo() {
    const onPress = () => navigation.push("SignUpScreen");
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginTop: Sizes.fixPadding,
        }}
      >
        <Text
          style={{
            color: Colors.blackColor,
            fontWeight: "500",
            marginRight: 5,
          }}
        >
          {t("Don't have an account?")}
        </Text>
        <TouchableOpacity activeOpacity={activeOpacity} onPress={onPress}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "500",
              color: Colors.primaryColor,
            }}
          >
            {t("Sign Up")}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  /** End Component Functions **/

  /** Start Server Functions **/
  async function Login(data: FormType) {
    setFormLoading(true);
    try {
      const res = await axios({
        method: "POST",
        url: ApiConfigs.Auth.login,
        data,
      });
      if (res.status === 200) {
        await AsyncStorage.setItem("login-data", JSON.stringify(data));
        await getRNFToken(res.data.token);
        setToken(res.data.token);
        setUserInfo(res.data.data);
        navigation.navigate("BottomTabBar");
      } else {
        localAlert(t(res.data.message));
      }
    } catch (e) {
      // @ts-ignore
      localAlert(t(e?.response?.data?.message));
      console.log("Error in Data / LoginData / Login");
    }
    setFormLoading(false);
  }

  /** End Server Functions **/
};

export default LoginScreen;

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    backgroundColor: Colors.bodyColor,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  headerIconStyle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: Sizes.fixPadding,
  },
  titleTextStyle: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
    color: Colors.primaryColor,
  },
  titleText2Style: {
    marginTop: 5,
    color: Colors.grayColor,
    fontWeight: "500",
    alignItems: "center",
    textAlign: "center",
  },
  forgotPasswordButtonStyle: {
    flex: 1,
    alignItems: "flex-end",
    marginRight: Sizes.fixPadding,
    marginBottom: Sizes.fixPadding,
  },
});
