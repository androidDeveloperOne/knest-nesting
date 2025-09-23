import { useEffect, useState } from "react";

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
import FullScreenLoader from "../components/FullScreenLoader";
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
    // console.log("Failed to open file:", e);
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



  console.log("selection", selection)

  const isProfileLevel = currentLevelIndex === levelOrder.length - 1;

  useEffect(() => {
    dispatch(getCompanyData(selection));



    // dispatch(clearProfileData());
  }, []);


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
  
    console.log("itemValue", itemValue);
  
    // ✅ Open PDF if on profile level
    if (isProfileLevel && item?.file_url?.toLowerCase().endsWith('.pdf')) {
      const fullUrl = `https://erp.knestaluform.in${item.file_url}`;
      navigation.navigate('PdfViewer', { fileUrl: fullUrl });
      return;
    }
  
    // ✅ If current level is 'profile'
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
  
    // ✅ For levels before 'profile'
    const updatedSelection: RequestBody = {
      ...selection,
      [currentLevel]: itemValue,
      level: nextLevel || "profile",
      ipo_name: currentLevel === "ipo" ? item?.ipo_name || itemValue : selection.ipo_name,
      profile: nextLevel === "profile" ? "" : "", // <-- reset or defer profile
    };
  
    console.log("updatedSelection", updatedSelection);
  
    setSelection(updatedSelection);
    if (nextLevel) setCurrentLevelIndex((prev) => prev + 1);
    dispatch(getCompanyData(updatedSelection));
  };
  











  const handleBreadcrumbPress = (label: string, index: number) => {
    dispatch(clearProfileData());
  console.log('label', label)
    if (index === 0) {
      // Reset everything when clicking Home
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
      return;
    }
  
    const clickedLevelIndex = index - 1;
    const clickedLevel = levelOrder[clickedLevelIndex];
  console.log("clickedLevel",clickedLevel)
    // Build updatedSelection dynamically, but inject the clicked breadcrumb label for the clicked level
    const updatedSelection: RequestBody = {
      level: clickedLevel,
      company: clickedLevelIndex >= 0 ? (clickedLevel === "company" ? label : selection.company) : "",
      year: clickedLevelIndex >= 1 ? (clickedLevel === "year" ? label : selection.year) : "",
      ipo: clickedLevelIndex >= 2 ? (clickedLevel === "ipo" ? label : selection.ipo) : "",
      ipo_name: clickedLevelIndex >= 2 ? selection.ipo_name : "", // keep existing ipo_name if needed
      unit: clickedLevelIndex >= 3 ? (clickedLevel === "unit" ? label : selection.unit) : "",
      profile: clickedLevelIndex >= 4 ? (clickedLevel === "profile" ? label : selection.profile) : "",
      search: "",
      limit: 50,
    };
  
    // Clear levels below clicked level to avoid stale data
    if (clickedLevelIndex < 0) updatedSelection.company = "";
    if (clickedLevelIndex < 1) updatedSelection.year = "";
    if (clickedLevelIndex < 2) {
      updatedSelection.ipo = "";
      updatedSelection.ipo_name = "";
    }
    if (clickedLevelIndex < 3) updatedSelection.unit = "";
    if (clickedLevelIndex < 4) updatedSelection.profile = "";
  
    const nextLevelIndex = clickedLevelIndex + 1;
    const nextLevel = levelOrder[nextLevelIndex];
  


    if (clickedLevel === "unit") {
      const unitSelection: RequestBody = {
        level: "profile",
        company: updatedSelection.company,
        year: updatedSelection.year,
        ipo: updatedSelection.ipo,
        ipo_name: updatedSelection.ipo_name,
        unit: label,
        profile: "",
        search: "",
        limit: 50,
      };
  

      setCurrentLevelIndex(4); 
      setSelection(unitSelection);   
      dispatch(getCompanyData(unitSelection));
      return;
    }
  
    if (nextLevel) {
      updatedSelection.level = nextLevel;
  
      setCurrentLevelIndex(nextLevelIndex);
      setSelection(updatedSelection);
    
      if (nextLevel === "profile") {
        const profileParams = {
          ipo: updatedSelection.ipo,
          unit: updatedSelection.unit,
          profile: clickedLevel === "unit" ? "" : (updatedSelection.profile || ""),
        };
        dispatch(getProfileData(profileParams));
        return;
      } else {
        dispatch(getCompanyData(updatedSelection));
        return;
      }
    }
  
    if (clickedLevel === "profile") {
      setCurrentLevelIndex(clickedLevelIndex);
      setSelection(updatedSelection);
  
      const profileParams = {
        ipo: updatedSelection.ipo,
        unit: updatedSelection.unit,
        profile: updatedSelection.profile || "",
      };
      dispatch(getProfileData(profileParams));
      return;
    }
  
    setCurrentLevelIndex(clickedLevelIndex);
    setSelection(updatedSelection);
    dispatch(getCompanyData(updatedSelection));
  };
  
  
  
  
    


  const levelColorMap: Record<number, string[]> = {
    0: ["bg-red-100", "bg-red-100"],
    1: ["bg-blue-100", "bg-blue-200"],
    2: ["bg-green-100", "bg-green-200"],
    3: ["bg-purple-100", "bg-purple-200"],
    4: ["bg-pink-100", "bg-pink-200"],
    5: ["bg-yellow-100", "bg-yellow-200"],
  };
  const breadcrumbBgColors = [
    "bg-red-600", // Home
    "bg-blue-600", // Company
    "bg-green-600", // Year
    "bg-purple-600", // IPO
    "bg-pink-600", // Unit
    "bg-yellow-600", // Profile
  ];

  const breadcrumbValues = [
    "Home",
    selection.company,
    selection.year,
    selection.ipo_name,
    selection.unit,
    selection.profile,
  ];
  return (
    <View className="flex-1    bg-white px-3">
      <FullScreenLoader visible={loading} useGif message="Loading..." />
      {/* {loading && <Text className="text-center py-4">Loading...</Text>} */}
      <View className=" my-2">
      <Breadcrumb
  items={breadcrumbValues.slice(0, breadcrumbValues.findLastIndex(Boolean) + 1)}
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
        ListEmptyComponent={() => (
          <Text className="text-center text-gray-500 text-lg">No Data Found</Text>
        )}
        numColumns={viewType === "grid" ? 2 : 1}
        renderItem={({ item, index }) => {
          const isPdf = item?.file_url ? true : false;
          const colorsForLevel = levelColorMap[currentLevelIndex] || [
            "bg-gray-100",
          ];

          const isGrid = viewType === "grid";

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
