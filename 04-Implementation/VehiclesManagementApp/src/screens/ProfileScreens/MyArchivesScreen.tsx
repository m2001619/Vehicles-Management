import { useLayoutEffect, useState } from "react";

// react native
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";

// third party packages
import axios from "axios";
import { useTranslation } from "react-i18next";

// project imports
import { Colors, Sizes } from "../../constants/styles";
import Header from "../../components/ScreenComponents/Header";
import GlobalData, { ArchiveType } from "../../GlobalData/GlobalData";
import ArchiveCard from "../../components/Cards/ArchiveCard";
import ApiConfigs from "../../constants/Apiconfigs";
import { localAlert } from "../../utils/LocalAlert";
import FormButton from "../../components/FormComponents/FormButton";
import NoItem from "../../components/ScreenComponents/NoItem";

// Interfaces and Types
type UseStateType = {
  archiveArr: ArchiveType[];
  length: number;
  page: number;
};

// constants
const limit = 6;
const { height } = Dimensions.get("window");

const MyArchivesScreen = ({ navigation }: { navigation: any }) => {
  const { t } = useTranslation();

  // Global state
  const token = GlobalData((state) => state.token);
  const formLoading = GlobalData((state) => state.formLoading);
  const setFormLoading = GlobalData((state) => state.setFormLoading);

  // Local state
  const [state, setState] = useState<UseStateType>({
    archiveArr: [],
    length: 1,
    page: 1,
  });
  const { archiveArr, length, page } = state;
  const updateState = (data: any) =>
    setState((prevState) => ({ ...prevState, ...data }));

  // Handler functions
  const showMore = () => {
    if (archiveArr.length < length) {
      updateState({ page: page + 1 });
    }
  };

  useLayoutEffect(() => {
    getMyArchiveReservations().catch(console.error);
  }, [state.page]);

  /** Start Main Return **/
  return (
    <SafeAreaView style={styles.archiveContainerStyle}>
      <StatusBar backgroundColor={Colors.primaryColor} />
      <Header title={t("My Archive")} onPress={() => navigation.pop()} />
      <FlatList
        data={archiveArr}
        renderItem={({ item, index }) => (
          <ArchiveCard item={item} index={index} navigation={navigation} />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: Sizes.fixPadding * 2,
          minHeight: height,
        }}
        ListEmptyComponent={!formLoading ? <NoItem /> : null}
      />
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 2,
          display: archiveArr.length >= length ? "none" : "flex",
        }}
      >
        <FormButton text={t("Show More")} onPress={showMore} />
      </View>
    </SafeAreaView>
  );
  /** End Main Return **/

  /** Start Server Functions **/
  async function getMyArchiveReservations() {
    setFormLoading(true);
    try {
      const res = await axios({
        method: "GET",
        url: ApiConfigs.ReservationArchive.getMyArchiveReservations,
        headers: { Authorization: `Bearer ${token}` },
        params: {
          limit,
          page,
        },
      });
      if (res.status === 200) {
        updateState({
          archiveArr: [...archiveArr, ...res.data.data],
          length: res.data.length,
        });
      }
    } catch (e) {
      // @ts-ignore
      localAlert(t(e?.response?.data?.message));
      console.log("Error in getMyArchiveReservations / MyArchivesScreen");
    }
    setFormLoading(false);
  }

  /** End Server Functions **/
};
export default MyArchivesScreen;

const styles = StyleSheet.create({
  archiveContainerStyle: {
    flex: 1,
    backgroundColor: Colors.bodyColor,
    paddingVertical: Sizes.fixPadding,
  },
});
