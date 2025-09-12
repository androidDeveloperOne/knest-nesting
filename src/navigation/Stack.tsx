import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import DashBoard from "../screens/Dashboard";
import ScreenA from "../screens/ScreenA";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Login from "../screens/Login";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import Badge from "../components/Badge";
import { useAppDispatch, useAppSelector } from "../store";
import PdfViewer from "../components/PdfViewerScreen";
import { useEffect, useState } from "react";
import ModalWrapper from "../components/ModalWrapper";
import { logout } from "../store/feature/auth/authSlice";
import ActivityWrapper from "../components/ActivityModal";
import { activityData } from "../screens/activityData";

export type RootStackParamList = {
  Dashboard: undefined;
  ScreenA: undefined;
  Login: undefined;
  PdfViewer: { fileUrl: string };
};
const Stack = createStackNavigator<RootStackParamList>();

const StackNavigator: React.FC = ({}) => {
  const { isRestoring, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (!isAuthenticated) {
      setShowModal(false);
    }
  }, [isAuthenticated]);
  const [showModal, setShowModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);

  console.log("showActivityModal", showActivityModal);
  if (isRestoring) {
    return <Text className="items-center">Loading....</Text>; // You can customize this
  }

  const dispatch = useAppDispatch();
  const handleLogout = () => {
    dispatch(logout());
  };
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "#7c3aed",
          },

          headerTintColor: "#ffff",

          headerRight: () => (
            <View className="flex-row mr-4">
              <TouchableOpacity
                onPress={() => setShowActivityModal(true)}
                className="mr-5"
              >
                <Ionicons
                  name="notifications-outline"
                  size={21}
                  color="white"
                />
                <Badge count={3} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setShowModal(true)}
                className="mt-1"
              >
                <AntDesign name="poweroff" size={15} color="#ffff" />
              </TouchableOpacity>
            </View>
          ),

          headerLeft: () => (
            <View className=" flex-row justify-around px-3">
              <View>
                <Text className="text-xl font-semibold  text-white">
                  Nesting
                </Text>
              </View>

              <View className="ps-3">
                <TextInput
                  className="bg-white   w-60 placeholder:text-xs   h-9  rounded-xl  "
                  placeholder="Search IPO"
                />
              </View>
            </View>
          ),
        }}
      >
        {isAuthenticated ? (
          <Stack.Screen
            name="Dashboard"
            component={DashBoard}
            options={{ title: "" }}
          />
        ) : (
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
        )}

        <Stack.Screen
          name="ScreenA"
          component={ScreenA}
          options={{ title: "ScreenA" }}
        />

        <Stack.Screen
          name="PdfViewer"
    options={{
    title: "",
    headerRight: () => null,
    headerLeft: undefined, // Keeps the default back arrow
  }}
          component={PdfViewer}
        />
      </Stack.Navigator>

      <ModalWrapper
        visible={showModal}
        onClose={() => setShowModal(false)}
        onPressOk={handleLogout}
      >
        <Text className="text-center">Are you want logout ?</Text>
      </ModalWrapper>

      <ActivityWrapper
        visible={showActivityModal}
        onClose={() => setShowActivityModal(false)}
        data={activityData}
      ></ActivityWrapper>
    </NavigationContainer>
  );
};

export default StackNavigator;
