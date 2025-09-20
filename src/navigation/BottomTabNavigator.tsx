import { FC } from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Profile from "../screens/Profile";
import Activity from "../screens/Activity";
import DashboardScreen from "../screens/Dashboard";

import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
export type RootStackParamList = {
    Dashboard: undefined;
    Profile: undefined;
    Activity: undefined

};
const Tab = createBottomTabNavigator<RootStackParamList>()

const BottomTabNavigator = ({ searchText, viewType,onTabChange }: { searchText: string, viewType: "grid" | "list",  onTabChange: (tabName: string) => void; }) => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: "#0a2351",
                tabBarInactiveTintColor: "gray",
                tabBarStyle: {
                    // backgroundColor: "#0a2351",           
                    borderTopLeftRadius: 15,              
                    borderTopRightRadius: 15,
                    height: 60,                       
                }
            }}
            screenListeners={{
                state: (e) => {
                  const tabName = e.data.state?.routeNames[e.data.state.index];
                  if (tabName) {
                    onTabChange(tabName);
                  }
                },
              }}
        >
            <Tab.Screen name="Dashboard"
                options={{
                    tabBarIcon: () => (
                        <Entypo name="home" size={24} color="black" />
                    )
                }}
            >
                {(props) => <DashboardScreen {...props} searchText={searchText} viewType={viewType}      />}
            </Tab.Screen>
            <Tab.Screen
                name="Activity"
                component={Activity}
                options={{
                    tabBarIcon: () => (
                        <Ionicons name="notifications" size={24} color="black" />
                    )
                }}
            />
            <Tab.Screen
                name="Profile"
                component={Profile}
                options={{
                    
                    tabBarIcon: () => (
                        <FontAwesome name="user" size={24} color="black" />
                    )
                }}
            />

        </Tab.Navigator>
    )
}

export default BottomTabNavigator