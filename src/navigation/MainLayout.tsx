// MainLayout.tsx
import React, { FC, useRef, useState } from "react";
import { View, Text, TouchableOpacity, Dimensions, Animated, Easing } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Badge from "../components/Badge";
import GlobalSearchBar from "../components/GlobalSearchBar";
import { logout } from "../store/feature/auth/authSlice";
import { useAppDispatch } from "../store";
import { activityData } from "../screens/activityData";
import ModalWrapper from "../components/ModalWrapper";
import ActivityWrapper from "../components/ActivityModal";
import BottomTabNavigator from "./BottomTabNavigator";
import Feather from '@expo/vector-icons/Feather';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
const HEADER_HEIGHT = Dimensions.get("window").height * 0.09;
const MainLayout: FC = () => {
    const dispatch = useAppDispatch();
    // const [showModal, setShowModal] = useState(false);
    // const [showActivityModal, setShowActivityModal] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [viewType, setViewType] = useState<"grid" | "list">("grid");
    const [activeTab, setActiveTab] = useState("Dashboard");
    console.log("activeTab", activeTab)
    console.log("viewType", viewType)
    const handleLogout = () => {
        dispatch(logout());
    };
    const animatedWidth = useRef(new Animated.Value(0)).current;

    const toggleSearch = () => {
        if (isSearchVisible) {
            // Animate collapse
            Animated.timing(animatedWidth, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
                easing: Easing.out(Easing.ease),
            }).start(() => setIsSearchVisible(false));
        } else {
            setIsSearchVisible(true);
            // Animate expand
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
        console.log("Set view type to:", newType);
    };


    // Interpolate width value (0 to 100%)
    const interpolatedWidth = animatedWidth.interpolate({
        inputRange: [0, 1],
        outputRange: ["0%", "80%"], // You can adjust final width
    });


    type BottomTabNavigatorProps = {
        searchText: string;
        viewType: "grid" | "list";
    };


    const getTitleForTab = (tab: string) => {
        switch (tab) {
            case "Activity":
                return "User Activities";
            case "Dashboard":
                return "Nesting";
            case "Profile":
                return "Profile";
            default:
                return "Nesting";
        }
    };




    return (
        <View style={{ flex: 1 }}
            className=""
        >
            <View
                style={{
                    backgroundColor: "#0a2351",
                    height: HEADER_HEIGHT,
                borderBottomLeftRadius:10,
                borderBottomRightRadius:10
                }}
                className="px-2 py-3">
                <View className="flex-row items-center justify-between w-full h-full relative">

                    {activeTab === "Dashboard" && (
                        <TouchableOpacity onPress={toggleViewType} className="mx-2"

                            style={{ zIndex: 10 }}
                        >
                            {viewType === "grid" ? (
                                <Feather name="grid" size={22} color="white" />
                            ) : (
                                <FontAwesome6 name="list-ul" size={22} color="white" />
                            )}
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
                        <Text
                            className="text-xl font-semibold tracking-widest text-white absolute left-0 right-0 text-center"

                        >
                            {getTitleForTab(activeTab)}
                        </Text>
                    )}

                    {activeTab === "Dashboard" && (
                        <TouchableOpacity onPress={toggleSearch}>
                            <Feather name="search" size={22} color="white" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <View style={{ flex: 1 }}>
                <BottomTabNavigator searchText={searchText} viewType={viewType}
                    onTabChange={(tabName) => {
                        setActiveTab(tabName);
                        setSearchText("");
                        setIsSearchVisible(false);


                    }}

                />
            </View>


        </View>
    )
}

export default MainLayout