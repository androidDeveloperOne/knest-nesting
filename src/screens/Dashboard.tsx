import { useCallback, useEffect, useState } from "react";

import { View, FlatList, Text, BackHandler, Linking } from "react-native";
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
import { downloadData } from "../store/feature/download/downloadSlice";
import * as Sharing from 'expo-sharing';
import { useFocusEffect } from "@react-navigation/native";
const levelOrder = ["company", "year", "ipo", "unit", "profile"];
const identifierKeyMap: Record<string, string> = {
  company: "name",
  year: "name",
  ipo: "ipo_name",
  unit: "name",
  profile: "name",

};
const openFile = async (uri: string) => {
  try {
    await Linking.openURL(uri);
  } catch (e) {
    console.log("Failed to open file:", e);
  }
};

interface DashboardScreenProps {
  navigation: StackNavigationProp<RootStackParamList, "Dashboard">;
  searchText: string
  viewType: "grid" | "list"
}
const DashboardScreen: React.FC<DashboardScreenProps> = ({ searchText, navigation, viewType }) => {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.nesting.data?.message);

  const profileItem = useAppSelector(
    (state) => state.nesting.profileData?.message
  );

  console.log("searchText", searchText)
  console.log("comapnyData", items);
  console.log("profileItem", profileItem);
  const loading = useAppSelector((state) => state.nesting.loading);

  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);


  const [selection, setSelection] = useState<RequestBody>({
    level: "company",
    company: "",
    year: "",
    ipo: "",
    ipo_name: "",
    unit: "",
    profile: "",
    search: "",
    limit: 50,
  });


  console.log("selection", selection);
  const isProfileLevel = currentLevelIndex === levelOrder.length - 1;
// Fetch data when screen gains focus, using latest searchText
useFocusEffect(
  useCallback(() => {
    if (searchText.trim() === "") {
      const resetSelection: RequestBody = {
        level: "company",
        company: "",
        year: "",
        ipo: "",
        ipo_name: "",
        unit: "",
        profile: "",
        search: "",
        limit: 50,
      };
      setCurrentLevelIndex(0);
      setSelection(resetSelection);
      dispatch(getCompanyData(resetSelection));
    } else {
      const updatedSelection: RequestBody = {
        level: "company",
        company: "",
        year: "",
        ipo: "",
        ipo_name: "",
        unit: "",
        profile: "",
        search: searchText.trim(),
        limit: 50,
      };
      setCurrentLevelIndex(0);
      setSelection(updatedSelection);
      dispatch(getCompanyData(updatedSelection));
    }
    dispatch(clearProfileData());
  }, [searchText, dispatch])
);

  useEffect(() => {
    if (searchText.trim() === "") return;

    const updatedSelection: RequestBody = {
      ...selection,
      level: "company",
      company: "",
      year: "",
      ipo: "",
      ipo_name: "",
      unit: "",
      profile: "",
      search: searchText.trim(),
      limit: 50,
    };

    setCurrentLevelIndex(0);
    setSelection(updatedSelection);
    dispatch(getCompanyData(updatedSelection));
  }, [searchText]);





  useEffect(() => {
    const backAction = () => {
      if (currentLevelIndex === 0) {
        // Already at "company" level → reset everything
        const resetSelection: RequestBody = {
          level: "company",
          company: "",
          year: "",
          ipo: "",
          ipo_name: "",
          unit: "",
          profile: "",
          search: "",
          limit: 50,
        };

        setSelection(resetSelection);
        dispatch(getCompanyData(resetSelection));
        return true; // prevent default back behavior
      }

      // Otherwise: go one level up and clear deeper values
      const prevLevelIndex = currentLevelIndex - 1;
      const updatedSelection: RequestBody = {
        level: levelOrder[prevLevelIndex],
        company: prevLevelIndex >= 0 ? selection.company : "",
        year: prevLevelIndex >= 1 ? selection.year : "",
        ipo: prevLevelIndex >= 2 ? selection.ipo : "",
        ipo_name: prevLevelIndex >= 2 ? selection.ipo_name : "",
        unit: prevLevelIndex >= 3 ? selection.unit : "",
        profile: "",
        search: "",
        limit: 50,
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


  const handleBreadcrumbPress = (label: string, index: number) => {
    dispatch(clearProfileData());

    if (index === 0) {
      // User clicked "Home"
      const resetSelection: RequestBody = {
        level: "company",
        company: "",
        year: "",
        ipo: "",
        ipo_name: "",
        unit: "",
        profile: "",
        search: "",
        limit: 50,
      };


      console.log("resetSelection", resetSelection)
      setCurrentLevelIndex(0);
      setSelection(resetSelection);
      dispatch(getCompanyData(resetSelection));
      return;
    }

    // Step 1: Determine which level was clicked
    const clickedLevelIndex = index - 1; // Because 'Home' is static at index 0
    const clickedLevel = levelOrder[clickedLevelIndex];

    // Step 2: Create new selection with only values up to clicked level
    const updatedSelection: RequestBody = {
      level: clickedLevel,
      company: clickedLevelIndex >= 0 ? selection.company : "",
      year: clickedLevelIndex >= 1 ? selection.year : "",
      ipo: clickedLevelIndex >= 2 ? selection.ipo : "",
      ipo_name: clickedLevelIndex >= 2 ? selection.ipo_name : "",
      unit: clickedLevelIndex >= 3 ? selection.unit : "",
      profile: "",
      search: "",
      limit: 50,
    };

    setCurrentLevelIndex(clickedLevelIndex);
    setSelection(updatedSelection);
    dispatch(getCompanyData(updatedSelection));
  };


  const handleDownload = async (item: any) => {
    if (isProfileLevel && item?.file_url?.toLowerCase().endsWith('.pdf')) {
      try {
        // dispatch(reset());

        const resultAction = await dispatch(downloadData({ child_name: item.child_name }));

        if (downloadData.fulfilled.match(resultAction)) {
          const publicFileUri = resultAction.payload;
          console.log("File saved to:", publicFileUri);

          await openFile(publicFileUri);
        } else {
          console.error("Download failed:", resultAction.payload);
        }
      } catch (error) {
        console.error("Download error:", error);
      }
    }
  };



  const handleFileCardPress = async (item: any) => {
    const currentLevel = levelOrder[currentLevelIndex];
    const nextLevel = levelOrder[currentLevelIndex + 1];

    const identifierKey = identifierKeyMap[currentLevel];
    const itemValue = item?.[identifierKey];



    // ✅ Check if it's a PDF at profile level
    if (isProfileLevel && item?.file_url?.toLowerCase().endsWith('.pdf')) {
      const fullUrl = `https://erp.knestaluform.in${item.file_url}`; // ✅ Fix is here
      ;

      navigation.navigate('PdfViewer', { fileUrl: fullUrl });
      return;
    }

    // 🔁 Continue normal nesting selection
    if (currentLevel === "profile") {
      const profileBody = {
        ipo: selection.ipo,
        unit: selection.unit,
        profile: itemValue,
      };
      setSelection(prev => ({
        ...prev,
        profile: itemValue,
      }));
      dispatch(getProfileData(profileBody));
      return;
    }


    const updatedSelection: RequestBody = {
      ...selection,
      [currentLevel]: itemValue,
      level: nextLevel || "profile",
      ipo_name:
        currentLevel === "ipo" ? item?.ipo_name || itemValue : selection.ipo_name,
    };



    setSelection(updatedSelection);
    if (nextLevel) setCurrentLevelIndex((prev) => prev + 1);
    dispatch(getCompanyData(updatedSelection));
  };



  const levelColorMap: Record<number, string[]> = {
    0: ["bg-red-100", "bg-red-100"],
    1: ["bg-blue-100", "bg-blue-200"],
    2: ["bg-green-100", "bg-green-200"],
    3: ["bg-purple-100", "bg-purple-200"],
    4: ["bg-pink-100", "bg-pink-200"],
  };
  const breadcrumbBgColors = [
    "bg-red-600", // Home
    "bg-blue-600", // Company
    "bg-green-600", // Year
    "bg-purple-600", // IPO
    "bg-pink-600", // Unit
    "bg-yellow-600", // Profile
  ];
  return (
    <View className="flex-1 bg-white px-3">
      {/* {loading && <Text className="text-center py-4">Loading...</Text>} */}
      <View className=" my-2">
        <Breadcrumb
          items={[
            "Home",
            selection.company,
            selection.year,
            selection.ipo_name,
            selection.unit,
            selection.profile,
          ].filter(Boolean)}
          onItemPress={handleBreadcrumbPress}
          bgColor={breadcrumbBgColors}
        />
      </View>

      <FlatList
        key={viewType}
        data={
          isProfileLevel && Array.isArray(profileItem) ? profileItem : items
        }
        columnWrapperStyle={viewType === "grid" ? { justifyContent: "space-around" } : undefined}
        contentContainerStyle={
          items?.length === 0
            ? { flexGrow: 1, justifyContent: "center", alignItems: "center" }
            : { }
        }
        keyExtractor={(item, index) =>
          `${item.name || item.ipo_no || item.child_name || index}`
        }
        numColumns={viewType === "grid" ? 2 : 1}
        ListEmptyComponent={() => (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginTop: 20 }}>
            <Text style={{ fontSize: 18, color: "gray" }}>No Data Found</Text>
          </View>
        )}
        renderItem={({ item, index }) => {
          const isPdf = item?.file_url ? true : false;
          const colorsForLevel = levelColorMap[currentLevelIndex] || [
            "bg-gray-100",
          ];

          const isGrid = viewType === "grid";
          console.log("index", index)
          const bgColor = colorsForLevel[index % colorsForLevel.length];
          return (
            <View style={{
              width: isGrid ? '48%' : '100%',
              // margin: 8,
            }}>
              <FileCard
                item={item}
                onPress={() => handleFileCardPress(item)}
                onDownload={() => handleDownload(item)}
                showFolderIcon={!isPdf}

                showFileIcon={isPdf}
                bgColor={bgColor}
                viewType={viewType}
              // showDownloadIcon={index >= 1}
              />
            </View>
          );
        }}

      />

    </View>
  );
};

export default DashboardScreen;
