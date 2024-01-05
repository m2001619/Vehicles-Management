// react native
import {
  Dimensions,
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// third party packages
import DialogContainer from "react-native-dialog/lib/Container";
import { useController } from "react-hook-form";
import { useTranslation } from "react-i18next";

// project imports
import { activeOpacity, Colors, Sizes } from "../../constants/styles";

// constants
const { width } = Dimensions.get("window");

const RequestDialog = ({
  showDialog,
  onCancelPress,
  onSubmit,
  control,
}: {
  showDialog: boolean;
  onCancelPress: () => void;
  onSubmit: () => void;
  control: any;
}) => {
  const { t } = useTranslation();

  /** Start Main Return **/
  return (
    <DialogContainer
      visible={showDialog}
      contentStyle={styles.dialogStyle}
      headerStyle={{ margin: 0.0, padding: 0.0 }}
    >
      <View style={styles.dialogInputContainerStyle}>
        <Text style={styles.dialogInputTextStyle}>{t("From")}</Text>
        <FilterTextInput
          name={"from"}
          placeholder={t("From")}
          keyboardType={"default"}
        />
      </View>
      <View style={styles.dialogInputContainerStyle}>
        <Text style={styles.dialogInputTextStyle}>{t("To")}</Text>
        <FilterTextInput
          name={"to"}
          placeholder={t("To")}
          keyboardType={"default"}
        />
      </View>
      <View style={styles.dialogInputContainerStyle}>
        <Text style={styles.dialogInputTextStyle}>{t("Note")}</Text>
        <FilterTextInput
          name={"note"}
          placeholder={t("Note")}
          keyboardType={"default"}
        />
      </View>
      <View style={styles.dialogButtonContainerStyle}>
        <TouchableOpacity activeOpacity={activeOpacity} onPress={onCancelPress}>
          <Text style={{ fontSize: 16, color: Colors.grayColor }}>
            {t("Cancel")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={activeOpacity}
          onPress={onSubmit}
          style={styles.dialogButtonStyle}
        >
          <Text style={styles.dialogButtonTextStyle}>{t("Submit")}</Text>
        </TouchableOpacity>
      </View>
    </DialogContainer>
  );

  /** End Main Return **/

  /** Start Component Functions **/
  function FilterTextInput({
    name,
    placeholder,
    keyboardType,
  }: {
    name: any;
    placeholder: string;
    keyboardType: KeyboardTypeOptions;
  }) {
    const { field, fieldState } = useController({
      control,
      name,
      rules: { required: name !== "note" },
    });
    return (
      <TextInput
        value={field.value}
        onChangeText={field.onChange}
        style={{
          ...styles.dialogInputStyle,
          borderColor: fieldState.error ? Colors.errorColor : Colors.grayColor,
        }}
        placeholder={placeholder}
        keyboardType={keyboardType}
      />
    );
  }

  /** End Component Functions **/
};

export default RequestDialog;

const styles = StyleSheet.create({
  dialogStyle: {
    width: width * 0.8,
    borderRadius: Sizes.fixPadding,
    justifyContent: "center",
    backgroundColor: Colors.bodyColor,
    padding: Sizes.fixPadding * 2,
  },
  dialogInputStyle: {
    marginLeft: Sizes.fixPadding,
    paddingHorizontal: Sizes.fixPadding,
    flex: 1,
    borderRadius: Sizes.fixPadding,
    borderWidth: 1,
    paddingVertical: 5,
  },
  dialogInputContainerStyle: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Sizes.fixPadding,
  },
  dialogInputTextStyle: {
    fontWeight: "500",
    color: Colors.blackColor,
    fontSize: 16,
    width: 70,
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
