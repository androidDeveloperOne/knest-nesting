import React, { useEffect } from "react";
import { ActivityIndicator, FlatList, Modal, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAppDispatch, useAppSelector } from "../store";
import { clearActivityData, getActivity } from "../store/feature/activityPortal/activitySlice";

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
  // data,
}) => {

  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector((state) => state.acivity)

  useEffect(() => {
    if (visible) {
      dispatch(getActivity());
    }


  }, [visible, dispatch]);

  const handleClose = () => {
  
    dispatch(clearActivityData()); 
    onClose(); 
  };



  console.log("acivity", data)
  const renderItem = ({ item }: { item: ActivityItem }) => (
    <View className="bg-[#7c3aed] my-3 rounded-md border-gray-200 py-3 px-2">
      <Text className="text-white font-semibold my-1 text-center">
        {" "}
        {item.kind.charAt(0).toUpperCase() + item.kind.slice(1)}
      </Text>

      <Text className="text-white  text-sm my-2">
        {item.unit}- {item.profile} - {item.version_no}{" "}
      </Text>
      <View className=" flex-row justify-between">
        <Text className="text-white text-xs"> {item.actor || "Unknown"}</Text>

        <Text className="text-white text-xs"> {item.ts}</Text>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose} 
    >
      <View className="flex-1 bg-black/80 items-center">
        <View className="w-full rounded-xl px-4 pt-10">
          <View className="flex-row justify-around my-2 py-2 rounded-md">
            <Text className="text-white font-bold text-xl text-center flex-1">
              User Activities
            </Text>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="close-sharp" size={24} color="red" />
            </TouchableOpacity>
          </View>

          <View className="rounded-md p-3 h-[80%]">
            {loading ? (
              <ActivityIndicator size="large" color="#ffffff" />
            ) : error ? (
              <Text className="text-red-500 text-center">{error}</Text>
            ) : data && data.length > 0 ? (
              <FlatList
                data={data}
                keyExtractor={(item, index) => `${item.ts}-${index}`}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <Text className="text-white text-center mt-4">
                No activity found.
              </Text>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ActivityWrapper;
