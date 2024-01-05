import { useState } from "react";

// react native
import { StyleProp, Text, TouchableOpacity, View } from "react-native";

// project imports
import { Colors } from "../constants/styles";
import { translateText } from "../utils/Translater";

// assets
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const TranslatedText = ({
  value,
  style,
}: {
  value: string;
  style: StyleProp<any>;
}) => {
  // Local state
  const [state, setState] = useState({
    text: value,
    isTranslated: false,
  });
  const { text, isTranslated } = state;

  // Handler functions
  const updateState = (data: any) =>
    setState((state) => ({ ...state, ...data }));

  const onPress = async () => {
    if (!isTranslated) {
      updateState({ text: await translateText(value), isTranslated: true });
    } else {
      updateState({ text: value, isTranslated: false });
    }
  };

  /** Start Main Return **/
  return (
    <View style={{ alignItems: "center", flexDirection: "row" }}>
      <Text style={style}>{text}</Text>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        style={{ marginLeft: 10 }}
      >
        <MaterialCommunityIcons
          name={isTranslated ? "translate-off" : "translate"}
          size={15}
          color={Colors.primaryColor}
        />
      </TouchableOpacity>
    </View>
  );
  /** End Main Return **/
};

export default TranslatedText;
