// FloatingVerticalMenu.tsx
import React from "react";
import { View, TouchableOpacity } from "react-native";

import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';

type FloatingVerticalMenuProps = {
  activeTab: string;
  onTabChange: (tabName: string) => void;
};

const FloatingVerticalMenu: React.FC<FloatingVerticalMenuProps> = ({ activeTab, onTabChange }) => {
  return (
    <View className="absolute left-2 top-1/3 bg-white rounded-lg shadow-lg py-2">
      <TouchableOpacity
        className={`p-4 items-center ${activeTab === "Dashboard" ? "bg-gray-200" : ""}`}
        onPress={() => onTabChange("Dashboard")}
      >
        <Entypo name="home" size={28} color="#0a2351" />
      </TouchableOpacity>

      <TouchableOpacity
        className={`p-4 items-center ${activeTab === "Activity" ? "bg-gray-200" : ""}`}
        onPress={() => onTabChange("Activity")}
      >
        <Ionicons name="notifications" size={28} color="#0a2351" />
      </TouchableOpacity>

      <TouchableOpacity
        className={`p-4 items-center ${activeTab === "Profile" ? "bg-gray-200" : ""}`}
        onPress={() => onTabChange("Profile")}
      >
        <FontAwesome name="user" size={28} color="#0a2351" />
      </TouchableOpacity>
    </View>
  );
};

export default FloatingVerticalMenu;
