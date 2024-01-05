import React from "react";

// react native
import {
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

// third party packages
import { useController } from "react-hook-form";

// project imports
import { Colors, Sizes } from "../../constants/styles";

// interfaces and types
import { Control } from "react-hook-form/dist/types/form";

const TextFiled = ({
  name,
  placeholder,
  keyboardType,
  control,
  editable = true,
}: {
  name: string;
  placeholder: string;
  keyboardType: KeyboardTypeOptions;
  control: Control<any>;
  editable?: boolean;
}) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    control,
    name,
    defaultValue: "",
  });

  /** Start Main Return **/
  return (
    <View style={{ marginBottom: Sizes.fixPadding * 2 }}>
      <TextInput
        value={`${field.value === 0 ? "" : field.value}`}
        onChangeText={field.onChange}
        placeholder={placeholder}
        secureTextEntry={name.toLowerCase().includes("password")}
        placeholderTextColor={Colors.grayColor}
        style={{
          ...styles.textInputStyle,
          borderColor: error ? Colors.errorColor : Colors.grayColor,
        }}
        selectionColor={Colors.primaryColor}
        keyboardType={keyboardType}
        editable={editable}
      />
      <Text
        style={{
          ...styles.textErrorStyle,
          display: error ? "flex" : "none",
        }}
      >
        {error?.message}
      </Text>
    </View>
  );
  /** End Main Return **/
};

export default TextFiled;

const styles = StyleSheet.create({
  textInputStyle: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.blackColor,
    flex: 1,
    borderWidth: 2,
    paddingHorizontal: Sizes.fixPadding * 2,
    borderRadius: Sizes.fixPadding,
  },
  textErrorStyle: {
    marginTop: 5,
    color: Colors.errorColor,
    marginLeft: 5,
    fontSize: 14,
    fontWeight: "500",
  },
});
