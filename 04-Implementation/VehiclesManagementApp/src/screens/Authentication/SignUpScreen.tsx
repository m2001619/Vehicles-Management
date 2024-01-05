// react native
import {
  Alert,
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
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios/index";
import { useTranslation } from "react-i18next";

// project imports
import { activeOpacity, Colors, Sizes } from "../../constants/styles";
import TextFiled from "../../components/FormComponents/TextFiled";
import ApiConfigs from "../../constants/Apiconfigs";
import { localAlert } from "../../utils/LocalAlert";
import GlobalData from "../../GlobalData/GlobalData";
import FormButton from "../../components/FormComponents/FormButton";

type FormType = {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  passwordConfirm: string;
};

const SignUpScreen = ({ navigation }: { navigation: any }) => {
  const { t } = useTranslation();

  // Yup inputs validation
  const schema = yup.object({
    name: yup
      .string()
      .required(t("Enter your name"))
      .min(3, t("Name is not valid")),
    email: yup
      .string()
      .required(t("Enter your email"))
      .email(t("Incorrect Email")),
    phoneNumber: yup.string().required(t("Enter your phone number")),
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
      name: "",
      email: "",
      phoneNumber: "",
      password: "",
      passwordConfirm: "",
    },
    //@ts-ignore
    resolver: yupResolver(schema),
    reValidateMode: "onChange",
  });

  // Global state
  const setFormLoading = GlobalData((state) => state.setFormLoading);

  // Handler functions
  const onSubmit = handleSubmit(
    (data) => validateEmail(data),
    () => console.log(errors)
  );

  /** Start Main Return **/
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyColor }}>
      <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
      <View style={styles.containerStyle}>
        <ScrollView
          style={{ paddingHorizontal: Sizes.fixPadding * 4 }}
          showsVerticalScrollIndicator={false}
        >
          {HeaderIcon()}
          {Title()}
          {/*Name filed*/}
          <TextFiled
            name={"name"}
            placeholder={t("Name")}
            keyboardType={"default"}
            control={control}
          />
          {/*Email filed*/}
          <TextFiled
            name={"email"}
            placeholder={t("Email")}
            keyboardType={"email-address"}
            control={control}
          />
          {/*Phone Number filed*/}
          <TextFiled
            name={"phoneNumber"}
            placeholder={t("Phone Number")}
            keyboardType={"phone-pad"}
            control={control}
          />
          {/*Password filed*/}
          <TextFiled
            name={"password"}
            placeholder={t("Password")}
            keyboardType={"default"}
            control={control}
          />
          {/*Password confirm filed*/}
          <TextFiled
            name={"passwordConfirm"}
            placeholder={t("Confirm Password")}
            keyboardType={"default"}
            control={control}
          />
          <FormButton text={t("Sign Up")} onPress={onSubmit} />
          {HaveAccountInfo()}
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
        <Text style={styles.titleTextStyle}>{t("Sign Up")}</Text>
        <Text style={styles.titleText2Style}>
          {t("Create an account and access our app")}
        </Text>
      </View>
    );
  }

  function HaveAccountInfo() {
    const onPress = () => navigation.pop();
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
          {t("Do you have an account?")}
        </Text>
        <TouchableOpacity activeOpacity={activeOpacity} onPress={onPress}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "500",
              color: Colors.primaryColor,
            }}
          >
            {t("Log in")}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  /** End Component Functions **/

  /** Start Server Functions **/
  async function validateEmail(data: FormType) {
    setFormLoading(true);
    try {
      const res = await axios({
        method: "POST",
        url: ApiConfigs.Auth.validateEmail,
        data: {
          email: data.email,
        },
      });
      if (res.status === 200) {
        Alert.alert(t("success"), t(res.data.message), [
          {
            text: t("ok"),
            style: "cancel",
            onPress: () =>
              navigation.push("VerificationEmailScreen", {
                accountData: {
                  ...data,
                  emailValidationToken: res.data.emailValidationToken,
                },
              }),
          },
        ]);
      } else {
        localAlert(t(res.data.message));
      }
    } catch (e) {
      // @ts-ignore
      localAlert(t(e?.response?.data?.message));
      console.log("Error in Data / SignUpData / SignUp");
    }
    setFormLoading(false);
  }

  /** End Server Functions **/
};

export default SignUpScreen;

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
  },
});
