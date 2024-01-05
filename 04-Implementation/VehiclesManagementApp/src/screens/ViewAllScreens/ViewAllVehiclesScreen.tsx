import { useEffect, useState } from "react";

// react native
import {
  Dimensions,
  SafeAreaView,
  StatusBar,
  View,
  FlatList,
} from "react-native";

// projects imports
import { Colors, Sizes } from "../../constants/styles";
import Header from "../../components/ScreenComponents/Header";
import VehicleCard from "../../components/Cards/VehicleCard";
import GlobalData, { VehicleType } from "../../GlobalData/GlobalData";
import { localAlert } from "../../utils/LocalAlert";
import FormButton from "../../components/FormComponents/FormButton";
import NoItem from "../../components/ScreenComponents/NoItem";

// third party packages
import axios from "axios";
import { useTranslation } from "react-i18next";

// interfaces and types
type UseStateType = {
  vehiclesList: VehicleType[];
  page: number;
  length: number;
};

// constants
const { height } = Dimensions.get("window");
const limit = 8;

const ViewAllVehiclesScreen = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const { title, apiUrl } = route.params;
  const { t } = useTranslation();

  // Global state
  const token = GlobalData((state) => state.token);
  const formLoading = GlobalData((state) => state.formLoading);
  const setFormLoading = GlobalData((state) => state.setFormLoading);

  // Local state
  const [state, setState] = useState<UseStateType>({
    vehiclesList: [],
    page: 1,
    length: limit,
  });
  const { vehiclesList, page, length } = state;
  const updateState = (data: any) =>
    setState((prevState) => ({ ...prevState, ...data }));

  // Handler Functions
  useEffect(() => {
    getVehicles().catch(console.error);
  }, [state.page]);

  const showMore = () => {
    if (vehiclesList.length < length) {
      updateState({ page: page + 1 });
    }
  };

  /** Start Main Return **/
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyColor }}>
      <StatusBar backgroundColor={Colors.primaryColor} />
      <Header title={title} onPress={() => navigation.pop()} />
      <FlatList
        data={vehiclesList}
        renderItem={RenderItem}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        contentContainerStyle={{ minHeight: height }}
        ListEmptyComponent={!formLoading ? <NoItem /> : null}
      />
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 2,
          display: vehiclesList.length >= length ? "none" : "flex",
        }}
      >
        <FormButton text={t("Show More")} onPress={showMore} />
      </View>
    </SafeAreaView>
  );

  /** End Main Return **/

  /** Start Component Functions **/
  function RenderItem({ item }: { item: VehicleType }) {
    return (
      <VehicleCard
        navigation={navigation}
        item={item}
        style={{ height: (height - 70) / 2 }} // 70 is header's height
      />
    );
  }

  /* End Component Functions */

  /* Start Server Functions */
  async function getVehicles() {
    setFormLoading(true);
    try {
      const res = await axios({
        method: "GET",
        url: apiUrl,
        headers: { Authorization: `Bearer ${token}` },
        params: {
          limit,
          page,
        },
      });
      if (res.status === 200) {
        updateState({
          length: res.data.length,
          vehiclesList: [...vehiclesList, ...res.data.data],
        });
      }
    } catch (e) {
      // @ts-ignore
      localAlert(t(e?.response?.data?.message));
      console.log("Error in ViewAllVehiclesScreen / getVehicles");
    }
    setFormLoading(false);
  }

  /** End Server Functions **/
};

export default ViewAllVehiclesScreen;
