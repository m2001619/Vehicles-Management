import React, { useRef } from "react";

// react native
import { Animated, Dimensions, StyleSheet, View } from "react-native";

// project imports
import { Colors } from "../../constants/styles";

// constants
const { width, height } = Dimensions.get("window");

const Loading = ({ isLoading }: { isLoading: boolean }) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Handler functions
  const startRotating = () => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  /** Start Main Return **/
  return (
    <View
      style={{ ...styles.dialogStyle, display: isLoading ? "flex" : "none" }}
    >
      <Animated.Image
        style={{
          width: 150,
          height: 150,
          transform: [{ rotate: rotateInterpolate }],
        }}
        source={require("../../constants/images/authIcon.png")}
        resizeMode={"contain"}
        onLoad={startRotating}
      />
    </View>
  );
  /** End Main Return **/
};

export default Loading;

const styles = StyleSheet.create({
  dialogStyle: {
    backgroundColor: Colors.bodyColor,
    height: height,
    width: width,
    alignItems: "center",
    justifyContent: "center",
    padding: 0.0,
  },
});
