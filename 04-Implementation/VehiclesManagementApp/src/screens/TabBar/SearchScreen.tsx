import { useLayoutEffect, useState } from "react";

// react native
import {
  Dimensions,
  FlatList,
  KeyboardTypeOptions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// third party packages
import axios from "axios/index";
import DialogContainer from "react-native-dialog/lib/Container";
import { useController, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

// project imports
import { activeOpacity, Colors, Sizes } from "../../constants/styles";
import GarageCard from "../../components/Cards/GarageCard";
import ApiConfigs from "../../constants/Apiconfigs";
import { localAlert } from "../../utils/LocalAlert";
import GlobalData from "../../GlobalData/GlobalData";
import VehicleCard from "../../components/Cards/VehicleCard";
import SectionLoading from "../../components/LoadingComponents/SectionLoading";
import NoItem from "../../components/ScreenComponents/NoItem";

// assets
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";

// interfaces and types
import { GarageType, VehicleType } from "../../GlobalData/GlobalData";

type FilterType = {
  model: string;
  year: {
    min: string;
    max: string;
  };
  maxSpeed: {
    min: string;
    max: string;
  };
  engineOutput: {
    min: string;
    max: string;
  };
  fuelType: string;
  bodyType: string;
};

type UseStateType = {
  searchedPart: "vehicle" | "garage";
  searchText: string;
  showFilterDialog: boolean;
  garageResultList: GarageType[];
  vehicleResultList: VehicleType[];
  limit: number;
  isLoading: boolean;
};

// constants
const { width } = Dimensions.get("screen");

const SearchScreen = ({ navigation }: { navigation: any }) => {
  const { t } = useTranslation();

  // Global state
  const token = GlobalData((state) => state.token);

  // Local state
  const [state, setState] = useState<UseStateType>({
    searchedPart: "vehicle",
    searchText: "",
    showFilterDialog: false,
    garageResultList: [],
    vehicleResultList: [],
    limit: 8,
    isLoading: false,
  });
  const {
    searchedPart,
    searchText,
    showFilterDialog,
    garageResultList,
    vehicleResultList,
    limit,
    isLoading,
  } = state;
  const updateState = (data: any) =>
    setState((prevState) => ({ ...prevState, ...data }));

  // React-Hook-form for handling the form's inputs
  const { control, handleSubmit } = useForm<FilterType>({
    defaultValues: {
      model: "",
      year: {
        min: "",
        max: "",
      },
      maxSpeed: {
        min: "",
        max: "",
      },
      engineOutput: {
        min: "",
        max: "",
      },
      fuelType: "",
      bodyType: "",
    },
  });

  // Handler Functions
  useLayoutEffect(() => {
    updateState({ searchText: "", limit: 8 });
  }, [searchedPart]);

  useLayoutEffect(() => {
    const counter = setTimeout(() => {
      if (searchedPart === "vehicle") {
        handleSubmit((data) => searchVehicle(data).catch(console.error))();
      } else {
        searchGarage().catch(console.error);
      }
    }, 700);
    return () => clearTimeout(counter);
  }, [searchText, searchedPart]);

  useLayoutEffect(() => {
    if (searchedPart === "vehicle") {
      handleSubmit((data) => searchVehicle(data).catch(console.error))();
    } else {
      searchGarage().catch(console.error);
    }
  }, [limit]);

  /** Start Main Return **/
  return (
    <View style={{ flex: 1, backgroundColor: Colors.tabBarBodyColor }}>
      {SearchInputs()}
      {isLoading ? <SectionLoading isLoading={isLoading} /> : ResultComponent()}
      {showFilterDialog && FilterDialog()}
    </View>
  );
  /** End Main Return **/

  /** Start Component Functions **/
  function SearchInputs() {
    const onChangeText = (text: string) => updateState({ searchText: text });
    const placeholder =
      searchedPart === "vehicle" ? t("Search Vehicle") : t("Search Garage");
    const onPressFilter = () => updateState({ showFilterDialog: true });
    const onSelectVehicle = () => updateState({ searchedPart: "vehicle" });
    const onSelectGarage = () => updateState({ searchedPart: "garage" });
    return (
      <View style={styles.searchInputsContainerStyle}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons name={"search"} size={24} color={Colors.grayColor} />
          <TextInput
            value={searchText}
            style={styles.textFieldStyle}
            onChangeText={onChangeText}
            placeholder={placeholder}
          />
          <TouchableOpacity
            activeOpacity={activeOpacity}
            onPress={onPressFilter}
            style={{ display: searchedPart === "vehicle" ? "flex" : "none" }}
          >
            <AntDesign name={"filter"} size={24} color={Colors.grayColor} />
          </TouchableOpacity>
        </View>
        <View style={styles.searchTypeContainerStyle}>
          <TouchableOpacity
            activeOpacity={activeOpacity}
            onPress={onSelectVehicle}
          >
            <Text
              style={{
                fontWeight: "600",
                color:
                  searchedPart === "vehicle"
                    ? Colors.primaryColor
                    : Colors.grayColor,
              }}
            >
              {t("Vehicle")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={activeOpacity}
            onPress={onSelectGarage}
            style={{ marginLeft: Sizes.fixPadding * 2 }}
          >
            <Text
              style={{
                fontWeight: "600",
                color:
                  searchedPart === "garage"
                    ? Colors.primaryColor
                    : Colors.grayColor,
              }}
            >
              {t("Garage")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function ResultComponent() {
    const VehicleList = () => {
      return (
        <FlatList
          data={vehicleResultList}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <VehicleCard item={item} navigation={navigation} />
          )}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          columnWrapperStyle={{ marginVertical: Sizes.fixPadding }}
          contentContainerStyle={{ alignItems: "center" }}
          ListEmptyComponent={<NoItem />}
        />
      );
    };

    const GarageList = () => {
      return (
        <FlatList
          data={garageResultList}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <GarageCard item={item} navigation={navigation} />
          )}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          columnWrapperStyle={{ marginVertical: Sizes.fixPadding }}
          contentContainerStyle={{ alignItems: "center", flex: 1 }}
          ListEmptyComponent={<NoItem />}
        />
      );
    };
    return searchedPart === "vehicle" ? VehicleList() : GarageList();
  }

  function FilterDialog() {
    const onCancel = () => updateState({ showFilterDialog: false });

    const onSubmit = handleSubmit((data) => {
      searchVehicle(data).catch(console.error);
      onCancel();
    });

    return (
      <ScrollView automaticallyAdjustKeyboardInsets={true} style={{ flex: 1 }}>
        <DialogContainer
          visible={showFilterDialog}
          onBackdropPress={onCancel}
          contentStyle={styles.filterDialogWrapStyle}
          headerStyle={{ margin: 0.0, padding: 0.0 }}
        >
          <View style={styles.filterContainerStyle}>
            <Text style={styles.filterTextStyle}>{t("Model")}</Text>
            <FilterTextInput
              name={"model"}
              placeholder={t("Model")}
              keyboardType={"default"}
            />
          </View>
          <View style={styles.filterContainerStyle}>
            <Text style={styles.filterTextStyle}>{t("Year")}</Text>
            <FilterTextInput
              name={"year.min"}
              placeholder={t("Min")}
              keyboardType={"number-pad"}
            />
            <FilterTextInput
              name={"year.max"}
              placeholder={t("Max")}
              keyboardType={"number-pad"}
            />
          </View>
          <View style={styles.filterContainerStyle}>
            <Text style={styles.filterTextStyle}>{t("Max Speed")}</Text>
            <FilterTextInput
              name={"maxSpeed.min"}
              placeholder={t("Min")}
              keyboardType={"number-pad"}
            />
            <FilterTextInput
              name={"maxSpeed.max"}
              placeholder={t("Max")}
              keyboardType={"number-pad"}
            />
          </View>
          <View style={styles.filterContainerStyle}>
            <Text style={styles.filterTextStyle}>{t("Engine Out")}</Text>
            <FilterTextInput
              name={"engineOutput.min"}
              placeholder={t("Min")}
              keyboardType={"number-pad"}
            />
            <FilterTextInput
              name={"engineOutput.max"}
              placeholder={t("Max")}
              keyboardType={"number-pad"}
            />
          </View>
          <View style={styles.filterContainerStyle}>
            <Text style={styles.filterTextStyle}>{t("Fuel Type")}</Text>
            <FilterTextInput
              name={"fuelType"}
              placeholder={t("Fuel Type")}
              keyboardType={"default"}
            />
          </View>
          <View style={styles.filterContainerStyle}>
            <Text style={styles.filterTextStyle}>{t("Body Type")}</Text>
            <FilterTextInput
              name={"bodyType"}
              placeholder={t("Body Type")}
              keyboardType={"default"}
            />
          </View>
          <View style={styles.filterButtonContainerStyle}>
            <TouchableOpacity activeOpacity={activeOpacity} onPress={onCancel}>
              <Text style={{ fontSize: 16, color: Colors.grayColor }}>
                {t("Cancel")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={activeOpacity}
              onPress={onSubmit}
              style={styles.filterButtonStyle}
            >
              <Text style={styles.filterButtonTextStyle}>{t("Filter")}</Text>
            </TouchableOpacity>
          </View>
        </DialogContainer>
      </ScrollView>
    );
  }

  function FilterTextInput({
    name,
    placeholder,
    keyboardType,
  }: {
    name: any;
    placeholder: string;
    keyboardType: KeyboardTypeOptions;
  }) {
    const { field } = useController({
      control,
      name,
    });
    return (
      <TextInput
        value={field.value}
        onChangeText={field.onChange}
        style={styles.filterInputStyle}
        placeholder={placeholder}
        keyboardType={keyboardType}
      />
    );
  }

  /** End Component Functions **/

  /** Start Component Functions **/
  async function searchVehicle(data: FilterType) {
    updateState({ isLoading: true });
    try {
      const res = await axios({
        method: "GET",
        url: ApiConfigs.Vehicle.getAllVehicles,
        headers: { Authorization: `Bearer ${token}` },
        params: handleParams(data),
      });
      if (res.status === 200) {
        updateState({ vehicleResultList: res.data.data });
      }
    } catch (e) {
      // @ts-ignore
      localAlert(t(e?.response?.data?.message));
      console.log("Error in SearchScreen / searchVehicle");
    }
    updateState({ isLoading: false });
  }

  async function searchGarage() {
    updateState({ isLoading: true });
    try {
      const res = await axios({
        method: "GET",
        url: ApiConfigs.Garage.getAllGarages,
        headers: { Authorization: `Bearer ${token}` },
        params: {
          name: { regex: searchText, options: "i" },
          limit: limit,
        },
      });
      if (res.status === 200) {
        updateState({ garageResultList: res.data.data });
      }
    } catch (e) {
      // @ts-ignore
      localAlert(t(e?.response?.data?.message));
      console.log("Error in SearchScreen / searchVehicle");
    }
    updateState({ isLoading: false });
  }

  /** End Component Functions **/

  function handleParams(data: FilterType) {
    const { model, year, maxSpeed, engineOutput, bodyType, fuelType } = data;
    return {
      limit: limit,
      make: { regex: searchText, options: "i" },
      model: { regex: model, options: "i" },
      engineOutput: {
        gte: engineOutput.min !== "" ? engineOutput.min : null,
        lte: engineOutput.max !== "" ? engineOutput.max : null,
      },
      maxSpeed: {
        gte: maxSpeed.min !== "" ? maxSpeed.min : null,
        lte: maxSpeed.max !== "" ? maxSpeed.max : null,
      },
      year: {
        gte: year.min !== "" ? year.min : null,
        lte: year.max !== "" ? year.max : null,
      },
      bodyType: { regex: bodyType, options: "i" },
      fuelType: { regex: fuelType, options: "i" },
    };
  }
};

export default SearchScreen;

const styles = StyleSheet.create({
  searchInputsContainerStyle: {
    backgroundColor: Colors.bodyColor,
    paddingHorizontal: Sizes.fixPadding * 2,
    paddingBottom: Sizes.fixPadding * 2,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  textFieldStyle: {
    marginHorizontal: Sizes.fixPadding,
    fontSize: 16,
    fontWeight: "500",
    color: Colors.blackColor,
    flex: 1,
  },
  searchTypeContainerStyle: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Sizes.fixPadding,
    marginLeft: 5,
  },
  filterDialogWrapStyle: {
    borderRadius: Sizes.fixPadding,
    width: width * 0.9,
    backgroundColor: Colors.bodyColor,
    paddingHorizontal: Sizes.fixPadding * 2,
    paddingVertical: Sizes.fixPadding * 4,
  },
  filterContainerStyle: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Sizes.fixPadding,
  },
  filterTextStyle: {
    fontWeight: "500",
    color: Colors.blackColor,
    fontSize: 16,
  },
  filterInputStyle: {
    marginLeft: Sizes.fixPadding,
    paddingHorizontal: Sizes.fixPadding,
    flex: 1,
    height: 50,
    elevation: 0.5,
  },
  filterButtonContainerStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 5,
    marginTop: Sizes.fixPadding,
  },
  filterButtonStyle: {
    backgroundColor: Colors.primaryColor,
    padding: Sizes.fixPadding,
    borderRadius: 5,
  },
  filterButtonTextStyle: {
    fontWeight: "500",
    fontSize: 16,
    color: Colors.whiteColor,
  },
});
