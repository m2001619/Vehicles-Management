// react native
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

// third party packages
import moment from "moment";
import { useTranslation } from "react-i18next";

// project imports
import { activeOpacity, Colors, Sizes } from "../../constants/styles";
import TranslatedText from "../TranslatedText";

// interfaces and types
import { ArchiveType } from "../../GlobalData/GlobalData";

const ArchiveCard = ({
  item,
  index,
  navigation,
}: {
  item: ArchiveType;
  index: number;
  navigation: any;
}) => {
  const { t } = useTranslation();

  // navigation route params
  const { departure, arrival, fuelBill, note } = item;
  const departureDate = moment(departure.time).format("DD/MM/yyyy HH:mm");
  const arrivalDate = moment(arrival.time).format("DD/MM/yyyy HH:mm");

  // Handler functions
  const onPress = () =>
    navigation.push("ArchiveScreen", { myReservationInfo: item });

  /** Start Main Return **/
  return (
    <View
      style={{
        ...styles.billBoxStyle,
        marginTop: index === 0 ? Sizes.fixPadding * 2 : Sizes.fixPadding,
      }}
    >
      <Info title={`${t("From")}:`} value={departure.from} isTranslate={true} />
      <Info title={`${t("Departure Odo")}:`} value={departure.odo} />
      <Info title={`${t("Departure Date")}:`} value={departureDate} />
      <Info title={`${t("To")}:`} value={arrival.to} isTranslate={true} />
      <Info title={`${t("Arrival Odo")}:`} value={arrival.odo} />
      <Info title={`${t("Arrival Date")}:`} value={arrivalDate} />
      <Info title={`${t("Fuel Bills")}:`} value={fuelBill.length} />
      <Info title={`${t("Note")}:`} value={note} isTranslate={true} />
      <TouchableOpacity
        activeOpacity={activeOpacity}
        onPress={onPress}
        style={{
          ...styles.buttonStyle,
          backgroundColor: Colors.primaryColor,
        }}
      >
        <Text style={styles.buttonTextStyle}>{t("Show")}</Text>
      </TouchableOpacity>
    </View>
  );

  /** End Main Return **/

  /** Start Component Functions **/
  function Info({
    title,
    value,
    isTranslate = false,
  }: {
    title: string;
    value: any;
    isTranslate?: boolean;
  }) {
    return (
      <View style={styles.billInfoStyle}>
        <Text style={{ color: Colors.blackColor, fontWeight: "500" }}>
          {title}
        </Text>
        {isTranslate ? (
          <TranslatedText value={value} style={styles.billTextStyle} />
        ) : (
          <Text style={styles.billTextStyle}>{value}</Text>
        )}
      </View>
    );
  }

  /** End Component Functions **/
};

export default ArchiveCard;

const styles = StyleSheet.create({
  billBoxStyle: {
    backgroundColor: Colors.whiteColor,
    padding: Sizes.fixPadding * 2,
    borderWidth: 0.5,
    borderColor: Colors.grayColor,
    borderRadius: 5,
    marginVertical: Sizes.fixPadding,
  },
  billInfoStyle: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: Sizes.fixPadding * 0.5,
  },
  billTextStyle: {
    color: Colors.grayColor,
    fontWeight: "500",
    marginLeft: 5,
  },
  buttonStyle: {
    padding: Sizes.fixPadding,
    borderRadius: 5,
    marginHorizontal: Sizes.fixPadding,
    marginTop: Sizes.fixPadding,
    alignItems: "center",
  },
  buttonTextStyle: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.whiteColor,
  },
});
