import React from "react";
import { FlatList, Modal, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

interface ActivityWrapperProps {
  visible: boolean;
  onClose: () => void;
  data: ActivityItem[]; // New prop
}

interface ActivityItem {
  kind: string;
  ts: string;
  actor: string | null;
  unit: string;
  profile: string;
  version_no: number;
  file: string;
}

const ActivityWrapper: React.FC<ActivityWrapperProps> = ({
  visible,
  onClose,
  data,
}) => {
  const renderItem = ({ item }: { item: ActivityItem }) => (
    <View className="border-b border-gray-200 py-3">
      <Text className="text-black font-semibold">
        {" "}
        {item.kind.charAt(0).toUpperCase() + item.kind.slice(1)}
      </Text>

      <Text className="text-black">
        {item.unit}- {item.profile} - {item.version_no}{" "}
      </Text>

      <Text className="text-black"> {item.actor || "Unknown"}</Text>
      <Text className="text-black font-semibold"> {item.ts}</Text>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 items-center px-3">
        <View className="w-full">
          <View className="flex-row justify-between my-2 py-2 rounded-md bg-white px-3">
            <Text className="text-black  font-bold">User Activities</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-sharp" size={24} color="red" />
            </TouchableOpacity>
          </View>

          <View className="px-3">
            <View className="bg-white rounded-md p-3 ">
              <FlatList
                data={data}
                keyExtractor={(item, index) => `${item.ts}-${index}`}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ActivityWrapper;
