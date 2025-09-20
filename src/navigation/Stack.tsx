import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";


import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Login from "../screens/Login";
import { Dimensions, Text, TextInput, TouchableOpacity, View } from "react-native";
import Badge from "../components/Badge";
import { useAppDispatch, useAppSelector } from "../store";
import PdfViewer from "../components/PdfViewerScreen";
import { useEffect, useState } from "react";
import ModalWrapper from "../components/ModalWrapper";
import { logout } from "../store/feature/auth/authSlice";
import ActivityWrapper from "../components/ActivityModal";
import { activityData } from "../screens/activityData";
import BottiomTabNavigation from "./BottomTabNavigator";
import GlobalSearchBar from "../components/GlobalSearchBar";
import DashboardScreen from "../screens/Dashboard";
import MainLayout from "./MainLayout";

export type RootStackParamList = {
  Dashboard: undefined;
  ScreenA: undefined;
  Login: undefined;
  MainTabs  : undefined;
  PdfViewer: { fileUrl: string };
};
const Stack = createStackNavigator<RootStackParamList>();

const StackNavigator: React.FC = () => {
  const { isRestoring, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );
  // const [showModal, setShowModal] = useState(false);
  // const [showActivityModal, setShowActivityModal] = useState(false);
  // const [searchText, setSearchText] = useState("");

  // const { height } = Dimensions.get("window");
  // const HEADER_HEIGHT = height * 0.18;
  // const dispatch = useAppDispatch();



  // console.log("showActivityModal", showActivityModal);
  if (isRestoring) return null;

  // const handleLogout = () => {
  //   dispatch(logout());
  // };
  // const handleSearchChange = (text: string) => {
  //   setSearchText(text);

  // };

  return (
<NavigationContainer>
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    {isAuthenticated ? (
      <>
        <Stack.Screen name="MainTabs" component={MainLayout} />
        <Stack.Screen
          name="PdfViewer"
          component={PdfViewer}
          options={{
            headerShown: false,
            title: "",
            headerStyle: {
              backgroundColor: "#0a2351",
            },
            headerTintColor: "#fff",
          }}
        />
      </>
    ) : (
      <Stack.Screen name="Login" component={Login} />
    )}
  </Stack.Navigator>
</NavigationContainer>

  );
};

export default StackNavigator;
