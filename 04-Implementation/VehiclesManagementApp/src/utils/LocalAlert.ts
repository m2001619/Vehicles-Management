// npm packages
import { showMessage } from "react-native-flash-message";

// project imports
import { Colors } from "../constants/styles";

/** Start Functions **/
export const localAlert = (message: string) => {
  showMessage({
    message: message,
    type: "danger",
    style: { backgroundColor: Colors.primaryColor },
    titleStyle: { fontWeight: "bold", fontSize: 16 },
  });
};
/** End Functions **/
