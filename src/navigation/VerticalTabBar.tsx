import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";

type Tab = "Dashboard" | "Activity" | "Profile";

interface Props {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  screens: Record<Tab, React.ReactNode>;
}

const VerticalTabBar: React.FC<Props> = ({ activeTab, onTabChange, screens }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => setIsExpanded((prev) => !prev);

  const tabs: {
    name: Tab;
    icon: any;
    bgColor: string;
  }[] = [
    { name: "Dashboard", icon: "home", bgColor: "#fde68a" }, // Yellow
    { name: "Activity", icon: "activity", bgColor: "#a5f3fc" }, // Cyan
    { name: "Profile", icon: "user", bgColor: "#fbcfe8" }, // Pink
  ];

  // Tabs except the active one, to show in expanded menu
  const otherTabs = tabs.filter((tab) => tab.name !== activeTab);

  return (
    <View className="flex-1 relative">
      {/* Render active screen */}
      <View className="flex-1">{screens[activeTab]}</View>

      {/* Vertical Tab bar */}
      <View className="absolute bottom-10 left-4 z-50 flex flex-col items-center">
        {/* Expanded tabs above */}
        {isExpanded && (
          <View
            className="mb-3 space-y-3 bg-white p-3 rounded-xl shadow-lg w-32"
            style={{ position: "absolute", bottom: 60, left: 0 }}
          >
            {otherTabs.map((tab) => (
              <TouchableOpacity
                key={tab.name}
                onPress={() => {
                  onTabChange(tab.name);
                  setIsExpanded(false); // close menu after selection
                }}
                className="items-center"
              >
                <View
                  style={{
                    backgroundColor: tab.bgColor,
                    padding: 10,
                    borderRadius: 50,
                    marginBottom: 4,
                  }}
                >
                  <Feather
                    name={tab.icon}
                    size={22}
                    color={"#555"}
                  />
                </View>
                <Text className="text-xs text-gray-400">{tab.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Active tab as fixed "Home" button */}
        <TouchableOpacity
          onPress={toggleExpanded}
          className="rounded-full shadow-lg w-12 h-12 bg-[#2563EB] items-center justify-center"
        >
          <Feather
            name={tabs.find((t) => t.name === activeTab)?.icon || "grid"}
            size={24}
            color={"#fff"}
          />
        </TouchableOpacity>
        <Text className="text-xs text-black font-medium text-center">{activeTab}</Text>
      </View>
    </View>
  );
};

export default VerticalTabBar;
