// layouts/MainLayout.tsx
import React, { FC, useRef, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    Animated,
    Easing,
    ScrollView,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { SafeAreaView } from "react-native-safe-area-context";

import GlobalSearchBar from "../components/GlobalSearchBar";

import VerticalTabBar from "./VerticalTabBar";
import DashboardScreen from "../screens/Dashboard";
import Activity from "../screens/Activity";
import Profile from "../screens/Profile";
import { LinearGradient } from "expo-linear-gradient";

export type RootStackParamList = {
    Dashboard: undefined;
    Profile: undefined;
    Activity: undefined

};




const MainLayout: FC = () => {


    const [searchText, setSearchText] = useState("");
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [viewType, setViewType] = useState<"grid" | "list">("grid");
    const [activeTab, setActiveTab] = useState<"Dashboard" | "Activity" | "Profile">("Dashboard");
    const [crumb, setCrumb] = useState<string[]>([]);
    const [selectedCrumbIndex, setSelectedCrumbIndex] = useState<number | null>(null);

    console.log("selectedCrumbIndex", selectedCrumbIndex)


    console.log("crumb", crumb)

    console.log("activeTab", activeTab)
    const animatedWidth = useRef(new Animated.Value(0)).current;


    const toggleSearch = () => {
        if (isSearchVisible) {
            Animated.timing(animatedWidth, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
                easing: Easing.out(Easing.ease),
            }).start(() => setIsSearchVisible(false));
        } else {
            setIsSearchVisible(true);
            Animated.timing(animatedWidth, {
                toValue: 1,
                duration: 300,
                useNativeDriver: false,
                easing: Easing.out(Easing.ease),
            }).start();
        }
    };

    const toggleViewType = () => {
        const newType = viewType === "grid" ? "list" : "grid";
        setViewType(newType);
    };

    const interpolatedWidth = animatedWidth.interpolate({
        inputRange: [0, 1],
        outputRange: ["0%", "80%"],
    });

    const getTitleForTab = (tab: string) => {
        if (tab === "Dashboard" && crumb.length > 0) {
            return crumb[crumb.length - 1]; // show the last breadcrumb item
        }

        switch (tab) {
            case "Activity":
                return "User Activities";
            case "Profile":
                return "Profile";
            default:
                return "Nesting";
        }
    };



    return (
        <View
            style={{ flex: 1 }}
        >
            {/* Header */}
            <LinearGradient
colors={['#1E3A8A', '#2563EB']}
    // start={{x: 0.38, y: 0.01}}
    // end={{x: 0.62, y: 0.99}}

style={{
    borderBottomRightRadius:15,
    borderBottomLeftRadius:15
}}
                className="px-2 py-3"
            >




                <View className="flex-row items-center  min-h-20 justify-between  relative">
                    {activeTab === "Dashboard" ? (
                        selectedCrumbIndex !== null && selectedCrumbIndex > 0 ? (
                            // Show back arrow only if crumb index is > 0 (not Home)
                            <TouchableOpacity
                                onPress={() => setSelectedCrumbIndex(selectedCrumbIndex - 1)}
                                className="mx-2 z-10"
                            >
                                <Feather name="arrow-left" size={24} color="white" />
                            </TouchableOpacity>
                        ) : (
                            // If index is 0 or crumbs length <= 1, no back arrow shown
                            <View style={{ width: 40, marginHorizontal: 8 }} />
                        )
                    ) : (
                        // For non-Dashboard tabs, show back arrow to Dashboard
                        <TouchableOpacity
                            onPress={() => setActiveTab("Dashboard")}
                            className="mx-2 z-10"
                        >
                            <Feather name="arrow-left" size={24} color="white" />
                        </TouchableOpacity>
                    )}

                    {isSearchVisible ? (
                        <Animated.View
                            style={{
                                width: interpolatedWidth,
                                alignSelf: "center",
                            }}
                        >
                            <GlobalSearchBar
                                value={searchText}
                                onChangeText={(text) => setSearchText(text)}
                            />
                        </Animated.View>
                    ) : (
                        <Text className="text-md font-semibold tracking-widest text-white absolute left-0 right-0 text-center">
                            {getTitleForTab(activeTab)}
                        </Text>
                    )}

                    {activeTab === "Dashboard" && (
                        <TouchableOpacity onPress={toggleSearch}>
                            <Feather name="search" size={22} color="white" />
                        </TouchableOpacity>
                    )}



                </View>

                {activeTab === 'Dashboard' && (
                    <View className="items-end">
                        <TouchableOpacity onPress={toggleViewType} className="mx-2 z-10">
                            {viewType === "grid" ? (
                                <Feather name="grid" size={22} color="white" />
                            ) : (
                                <FontAwesome6 name="list-ul" size={22} color="white" />
                            )}
                        </TouchableOpacity>


                    </View>
                )}



                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-2">
                    <View className="flex-row items-center px-1">
                        {crumb.map((item, index) => {
                            const isActive = index === selectedCrumbIndex;
                            const isLast = index === crumb.length - 1;

                            return (
                                <View key={index} className="flex-row items-center">
                                    <TouchableOpacity onPress={() => setSelectedCrumbIndex(index)}>
                                        <Text
                                            className={`text-xs font-medium text-white  `}
                                        >
                                            {item}
                                        </Text>
                                    </TouchableOpacity>

                                    {/* Only show the ">" if it's not the last item */}
                                    {!isLast && (
                                        <Text className="text-white mx-1">{'>'}</Text>
                                    )}
                                </View>
                            );
                        })}
                    </View>
                </ScrollView>


            </LinearGradient>





            {/* Main screen content */}
            <View style={{ flex: 1 }}>

                {/* Floating vertical tab bar */}
                <VerticalTabBar
                    activeTab={activeTab}
                    onTabChange={(tab) => {
                        setActiveTab(tab);
                        setSearchText("");
                        setIsSearchVisible(false);
                        if (tab !== "Dashboard") {
                            setCrumb([]);
                            setSelectedCrumbIndex(null);
                        }
                    }}
                    screens={{
                        Dashboard: (
                            <DashboardScreen
                                searchText={searchText}
                                viewType={viewType}
                                onBreadcrumbChange={(breadcrumbs) => {
                                    setCrumb(breadcrumbs);
                                    setSelectedCrumbIndex(breadcrumbs.length - 1); // Ensure latest breadcrumb is selected
                                }}

                                selectedCrumbIndex={selectedCrumbIndex} // 👈 Pass to child


                            />
                        ),
                        Activity: <Activity />,
                        Profile: <Profile />,
                    }}
                />
            </View>
        </View>
    );
};

export default MainLayout;
