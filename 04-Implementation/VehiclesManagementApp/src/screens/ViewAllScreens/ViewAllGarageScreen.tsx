import { useLayoutEffect, useState } from "react";

// react native
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StatusBar,
  View,
} from "react-native";

// third party project
import axios from "axios";
import { useTranslation } from "react-i18next";

// project imports
import { Colors, Sizes } from "../../constants/styles";
import Header from "../../components/ScreenComponents/Header";
import ApiConfigs from "../../constants/Apiconfigs";
import { localAlert } from "../../utils/LocalAlert";
import GlobalData from "../../GlobalData/GlobalData";
import GarageCard from "../../components/Cards/GarageCard";
import FormButton from "../../components/FormComponents/FormButton";
import NoItem from "../../components/ScreenComponents/NoItem";

// interfaces and types
import { GarageType } from "../../GlobalData/GlobalData";

type UseStateType = {
  garageList: GarageType[];
  page: number;
  length: number;
};

// constants
const limit = 16;
const { height } = Dimensions.get("window");

const ViewAllGarageScreen = ({ navigation }: { navigation: any }) => {
  const { t } = useTranslation();

  // Global state
  const token = GlobalData((state) => state.token);
  const setFormLoading = GlobalData((state) => state.setFormLoading);

  // Local state
  const [state, setState] = useState<UseStateType>({
    garageList: [],
    page: 1,
    length: limit,
  });
  const { garageList, page, length } = state;
  const updateState = (data: any) =>
    setState((prevState) => ({ ...prevState, ...data }));

  // Handler Functions
  useLayoutEffect(() => {
    getAllGarages().catch(console.error);
  }, [state.page]);

  const showMore = () => {
    if (garageList.length < length) {
      updateState({ page: page + 1 });
    }
  };

  /** Start Main Return **/
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyColor }}>
      <StatusBar backgroundColor={Colors.primaryColor} />
      <Header title={t("All Garages")} onPress={() => navigation.pop()} />
      <FlatList
        data={garageList}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <GarageCard item={item} navigation={navigation} />
        )}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        columnWrapperStyle={{ margin: Sizes.fixPadding }}
        contentContainerStyle={{ minHeight: height }}
        ListEmptyComponent={<NoItem />}
      />
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 2,
          display: garageList.length >= length ? "none" : "flex",
        }}
      >
        <FormButton text={t("Show More")} onPress={showMore} />
      </View>
    </SafeAreaView>
  );
  /** End Main Return **/

  /** Start Server Functions **/
  async function getAllGarages() {
    setFormLoading(true);
    try {
      const res = await axios({
        method: "GET",
        url: ApiConfigs.Garage.getAllGarages,
        headers: { Authorization: `Bearer ${token}` },
        params: {
          limit,
          page,
        },
      });
      if (res.status === 200) {
        updateState({
          length: res.data.length,
          garageList: [...garageList, ...res.data.data],
        });
      }
    } catch (e) {
      // @ts-ignore
      localAlert(t(e?.response?.data?.message));
      console.log("Error in ViewAllGarageScreen / getAllGarages");
    }
    setFormLoading(false);
  }

  /** End Server Functions **/
};

export default ViewAllGarageScreen;
