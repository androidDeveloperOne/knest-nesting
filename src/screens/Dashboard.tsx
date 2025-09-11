import { useEffect, useState } from "react";

import { View, FlatList, Text, BackHandler } from "react-native";
import FileCard from "../components/FileCard";
import { useAppDispatch, useAppSelector } from "../store";
import {
  clearCompanyData,
  clearProfileData,
  getCompanyData,
  getProfileData,
} from "../store/feature/nestingPortal/nestingSlice";
import { RequestBody } from "../store/feature/nestingPortal/nestingTypes";
import Breadcrumb from "../components/Breadcrumb";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/Stack";
import { dummyData } from "./mockData";

const levelOrder = ["company", "year", "ipo", "unit", "profile"];
const identifierKeyMap: Record<string, string> = {
  company: "name",
  year: "name",
  ipo: "ipo_name",
  unit: "name",
  profile: "name",
};

interface DashboardScreenProps {
  navigation: StackNavigationProp<RootStackParamList, "Dashboard">;
}
const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  // const items = useAppSelector((state) => state.nesting.data?.message);

  // const profileItem = useAppSelector(
  //   (state) => state.nesting.profileData?.message
  // );

  // console.log("comapnyData", items);
  // console.log("comapnyData", profileItem);
  // const loading = useAppSelector((state) => state.nesting.loading);

  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);

  console.log("currentLevelIndex", currentLevelIndex);
  const [selection, setSelection] = useState<RequestBody>({
    level: "company",
    company: "",
    year: "",
    ipo: "",
    unit: "",
    profile: "",
    search: "",
    limit: 50,
  });

  const isProfileLevel = currentLevelIndex === levelOrder.length - 1;

  const getItemsFromDummyData = () => {
    if (currentLevelIndex === 0) {
      // Show company node itself as the only item at root (Home)
      return [dummyData];
    }

    let levelData: any = dummyData;

    if (selection.company && selection.company !== dummyData.name) {
      // No matching company found
      return [];
    }

    // Start traversing from year, ipo, unit, profile based on currentLevelIndex
    // Because company level is handled separately

    if (selection.year && levelData?.children) {
      levelData = levelData.children.find(
        (year: any) => year.name === selection.year
      );
      if (!levelData) return [];
    }

    if (selection.ipo && levelData?.children) {
      levelData = levelData.children.find(
        (ipo: any) => ipo.ipo_name === selection.ipo
      );
      if (!levelData) return [];
    }

    if (selection.unit && levelData?.children) {
      levelData = levelData.children.find(
        (unit: any) => unit.name === selection.unit
      );
      if (!levelData) return [];
    }

    if (selection.profile && levelData?.children) {
      levelData = levelData.children.find(
        (profile: any) => profile.name === selection.profile
      );
      if (!levelData) return [];
    }

    // Return children for levels > 0
    return levelData?.children || [];
  };

  const currentItems = getItemsFromDummyData();

  console.log("currentItem", currentItems);

  // useEffect(() => {
  //   dispatch(getCompanyData(selection));
  //   // dispatch(clearProfileData());
  // }, [dispatch]);

  useEffect(() => {
    const backAction = () => {
      if (currentLevelIndex === 0) return false;

      const prevLevelIndex = currentLevelIndex - 1;
      const prevLevel = levelOrder[prevLevelIndex];

      const updatedSelection = {
        ...selection,
        level: prevLevel,
        [levelOrder[currentLevelIndex]]: "",
      };

      setSelection(updatedSelection);
      setCurrentLevelIndex(prevLevelIndex);
      dispatch(getCompanyData(updatedSelection));
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [currentLevelIndex, selection, dispatch]);

  // const handleBreadcrumbPress = (label: string, index: number) => {
  //   dispatch(clearProfileData());

  //   if (index === 0) {
  //     const resetSelection: RequestBody = {
  //       level: "company",
  //       company: "",
  //       year: "",
  //       ipo: "",
  //       unit: "",
  //       profile: "",
  //       search: "",
  //       limit: 50,
  //     };

  //     console.log("resetSelection", resetSelection);
  //     setCurrentLevelIndex(0);
  //     setSelection(resetSelection);
  //     dispatch(getCompanyData(resetSelection));
  //     return;
  //   }

  //   const newLevel = levelOrder[index - 1];

  //   const updatedSelection: RequestBody = {
  //     ...selection,
  //     level: newLevel,
  //     company: index >= 1 ? selection.company : "",
  //     year: index >= 2 ? selection.year : "",
  //     ipo: index >= 3 ? selection.ipo : "",
  //     unit: index >= 4 ? selection.unit : "",
  //     profile: index >= 4 ? selection.profile : "",
  //   };

  //   console.log("updatedSelection", updatedSelection);

  //   setCurrentLevelIndex(index - 1);
  //   setSelection(updatedSelection);
  //   dispatch(getCompanyData(updatedSelection));
  // };

  // const handleFileCardPress = async (item: any) => {
  //   const currentLevel = levelOrder[currentLevelIndex];
  //   const nextLevel = levelOrder[currentLevelIndex + 1];

  //   const identifierKey = identifierKeyMap[currentLevel];
  //   const itemValue = item?.[identifierKey];

  //   // ✅ Check if it's a PDF at profile level
  // if (isProfileLevel && item?.file_url?.toLowerCase().endsWith('.pdf')) {
  //   const fullUrl = `http://172.16.3.1:8000${item.file_url}`; // ✅ Fix is here
  //  ;

  //   // navigation.navigate('PdfViewer', { fileUrl: fullUrl });
  //   return;
  // }

  //   // 🔁 Continue normal nesting selection
  //   if (currentLevel === "profile") {
  //     const profileBody = {
  //       ipo: selection.ipo,
  //       unit: selection.unit,
  //       profile: itemValue,
  //     };
  //     dispatch(getProfileData(profileBody));
  //     return;
  //   }

  //   const updatedSelection: RequestBody = {
  //     ...selection,
  //     [currentLevel]: itemValue,
  //     level: nextLevel || "profile",
  //   };

  //   setSelection(updatedSelection);
  //   if (nextLevel) setCurrentLevelIndex((prev) => prev + 1);
  //   dispatch(getCompanyData(updatedSelection));
  // };
  const handleBreadcrumbPress = (label: string, index: number) => {
    if (index === 0) {
      // Back to Home
      setSelection({
        level: "company",
        company: "",
        year: "",
        ipo: "",
        unit: "",
        profile: "",
        search: "",
        limit: 50,
      });
      setCurrentLevelIndex(0);
      return;
    }

    const newLevel = levelOrder[index - 1];

    const updatedSelection: RequestBody = {
      ...selection,
      level: newLevel,
      company: index >= 1 ? selection.company : "",
      year: index >= 2 ? selection.year : "",
      ipo: index >= 3 ? selection.ipo : "",
      unit: index >= 4 ? selection.unit : "",
      profile: index >= 5 ? selection.profile : "",
    };

    setCurrentLevelIndex(index - 1);
    setSelection(updatedSelection);
  };

  const handleFileCardPress = (item: any) => {
    const isPdf = item?.file_url?.toLowerCase().endsWith(".pdf");

    if (isPdf) {
      navigation.navigate("PdfViewer", { fileUrl: item.file_url });
      return;
    }

    const currentLevel = levelOrder[currentLevelIndex];
    const nextLevel = levelOrder[currentLevelIndex + 1];

    let selectedValue = "";

    if (currentLevel === "ipo") {
      selectedValue = item.ipo_name;
    } else {
      selectedValue = item.name;
    }

    const updatedSelection: RequestBody = { ...selection };
    updatedSelection.level = nextLevel || currentLevel;

    if (currentLevel === "company") updatedSelection.company = selectedValue;
    if (currentLevel === "year") updatedSelection.year = selectedValue;
    if (currentLevel === "ipo") updatedSelection.ipo = selectedValue;
    if (currentLevel === "unit") updatedSelection.unit = selectedValue;
    if (currentLevel === "profile") updatedSelection.profile = selectedValue;

    setSelection(updatedSelection);
    if (nextLevel) setCurrentLevelIndex(currentLevelIndex + 1);
  };

  return (
    <View className="flex-1 bg-gray-100">
      {/* {loading && <Text className="text-center py-4">Loading...</Text>} */}

      <Breadcrumb
        items={[
          "Home",
          selection.company,
          selection.year,
          selection.ipo,
          selection.unit,
          selection.profile,
        ].filter(Boolean)}
        onItemPress={handleBreadcrumbPress}
      />

      <FlatList
        key={"2-columns"}
        // data={
        //   isProfileLevel && Array.isArray(profileItem) ? profileItem : items
        // }
        data={currentItems}
        keyExtractor={(item, index) =>
          `${item.name || item.ipo_no || item.child_name || index}`
        }
        numColumns={2}
        renderItem={({ item }) => {
          const isPdf = item?.file_url ? true : false;
          return (
            <View style={{ flex: 1, margin: 8 }}>
              <FileCard
                item={item}
                onPress={() => handleFileCardPress(item)}
                onDownload={() => {}}
                showFolderIcon={!isPdf}
                showFileIcon={isPdf}
              />
            </View>
          );
        }}
        contentContainerStyle={
          currentItems?.length === 0
            ? { flexGrow: 1, justifyContent: "center", alignItems: "center" }
            : { padding: 8 }
        }
      />
    </View>
  );
};

export default DashboardScreen;
