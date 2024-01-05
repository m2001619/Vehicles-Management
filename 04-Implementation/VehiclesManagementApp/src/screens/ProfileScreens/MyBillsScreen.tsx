import { useLayoutEffect, useState } from "react";

// react native
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View
} from "react-native";

// third party packages
import axios from "axios";
import { useTranslation } from "react-i18next";

// project imports
import { Colors, Sizes } from "../../constants/styles";
import Header from "../../components/ScreenComponents/Header";
import GlobalData, { FuelBillType } from "../../GlobalData/GlobalData";
import ApiConfigs from "../../constants/Apiconfigs";
import { localAlert } from "../../utils/LocalAlert";
import FormButton from "../../components/FormComponents/FormButton";
import BillCard from "../../components/Cards/BillCard";
import NoItem from "../../components/ScreenComponents/NoItem";

// Interfaces and Types
type UseStateType = {
  billsArr: FuelBillType[];
  length: number;
  page: number;
};

// constants
const limit = 6;
const {height} = Dimensions.get("window");

const MyBillsScreen = ({ navigation }: { navigation: any }) => {
  const {t} = useTranslation();

  // Global state
  const token = GlobalData((state) => state.token);
  const { id } = GlobalData((state) => state.userInfo);
  const formLoading = GlobalData((state) => state.formLoading);
  const setFormLoading = GlobalData((state) => state.setFormLoading);

  // Local state
  const [state, setState] = useState<UseStateType>({
    billsArr: [],
    length: 1,
    page: 1,
  });
  const { billsArr, length, page } = state;
  const updateState = (data: any) =>
    setState((prevState) => ({ ...prevState, ...data }));

  // Handler functions
  const showMore = () => {
    if (billsArr.length < length) {
      updateState({ page: page + 1 });
    }
  };

  useLayoutEffect(() => {
    getUserFuelBills().catch(console.error);
  }, [state.page]);

  /** Start Main Return **/
  return (
    <SafeAreaView style={styles.billsContainerStyle}>
      <StatusBar backgroundColor={Colors.primaryColor} />
      <Header title={t("My Bills")} onPress={() => navigation.pop()} />
      <FlatList
        data={billsArr}
        renderItem={({ item, index }) => (
          <BillCard
            item={item}
            index={index}
            navigation={navigation}
            isArchive={true}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: Sizes.fixPadding * 2, minHeight: height }}
        ListEmptyComponent={!formLoading ? <NoItem /> : null}
      />
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 2,
          display: billsArr.length >= length ? "none" : "flex",
        }}
      >
        <FormButton text={t("Show More")} onPress={showMore} />
      </View>
    </SafeAreaView>
  );
  /** End Main Return **/

  /** Start Server Functions **/
  async function getUserFuelBills() {
    setFormLoading(true);
    try {
      const res = await axios({
        method: "GET",
        url: ApiConfigs.FuelBill.getUserFuelBills + id,
        headers: { Authorization: `Bearer ${token}` },
        params: {
          limit,
          page,
        },
      });
      if (res.status === 200) {
        updateState({
          billsArr: [...billsArr, ...res.data.data],
          length: res.data.length,
        });
      }
    } catch (e) {
      // @ts-ignore
      localAlert(t(e?.response?.data?.message));
      console.log("Error in getUserFuelBills / MyBillsScreen");
    }
    setFormLoading(false);
  }
  /** End Server Functions **/
};
export default MyBillsScreen;

const styles = StyleSheet.create({
  billsContainerStyle: {
    flex: 1,
    backgroundColor: Colors.bodyColor,
    paddingVertical: Sizes.fixPadding,
  },
});
