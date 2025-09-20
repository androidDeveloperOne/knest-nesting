import React from "react";
import { TextInput, View } from "react-native";

interface GlobalSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

const GlobalSearchBar: React.FC<GlobalSearchBarProps> = ({
  value,
  onChangeText,
  placeholder = "Search IPO",
}) => {
  return (
    <View className=" py-2 ">
      <TextInput
        className="bg-white  py-2  w-full rounded-md text-sm"
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

export default GlobalSearchBar;