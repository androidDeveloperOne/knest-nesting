import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";

interface BreadcrumbProps {
  items: string[];
  onItemPress?: (label: string, index: number) => void;
}
const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, onItemPress }) => {
  if (!items.length) return null;

  return (
    // <ScrollView
    //   horizontal
    //   showsHorizontalScrollIndicator={false}
    //   className="px-4 bg-white h-10"
    //   contentContainerStyle={{ alignItems: "center" }}
    // >
      <View className="flex-row">
        {items.map((item, index) => (
          <View key={index} className="flex-row items-center">
            <Pressable
              onPress={() => onItemPress?.(item, index)}
              hitSlop={8}
            >
              <Text className="text-xs font-medium text-blue-600">
                {item}
              </Text>
            </Pressable>
            {index < items.length - 1 && (
              <Text className="mx-2 text-xs text-gray-500">{">"}</Text>
            )}
          </View>
        ))}
      </View>
    // </ScrollView>
  );
};
export default Breadcrumb;
