import { FC, useEffect } from "react";
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { useAppDispatch, useAppSelector } from "../store";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getActivity } from "../store/feature/activityPortal/activitySlice";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
interface ActivityItem {
    kind: string;
    ts: string;
    actor: string | null;
    unit: string;
    profile: string;
    version_no: number;
    file: string;
}
const Activity: FC = ({ }) => {
    const dispatch = useAppDispatch();



    const { data, loading, error } = useAppSelector((state) => state.acivity)

    useEffect(() => {
        dispatch(getActivity());
    }, [dispatch]);

    const renderItem = ({ item }: { item: ActivityItem }) => (
        <View className="rounded-2xl  bg-white p-3 mb-2">
            <View className="flex-row items-center">
                {/* Left Icon */}
                <View className="mr-3 bg-white    p-3 rounded-full ">
                    <Image source={require("../../assets/upload.png")}
                    style={{height:30, width:30}}
                    
                    />
                   
                </View>
    
                {/* Right Content */}
                <View className="flex-1">
                    <Text className="font-bold text-center text-md mb-1">
                        {item.kind.charAt(0).toUpperCase() + item.kind.slice(1)}
                    </Text>
    
                    <Text className="text-sm mb-1">
                        {item.unit} - {item.profile} - {item.version_no}
                    </Text>
    
                    <View className="flex-row justify-between">
                        <Text className="text-xs">{item.actor || "Unknown"}</Text>
                        <Text className="text-xs">{item.ts}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
    

    return (
        <View className="flex-1  items-center   bg-blue-50  ">
            <View className="w-full rounded-xl px-2">

                <View className="rounded-md p-3 h-[100%]">
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
                        <Text className="text-black text-center mt-4">
                            No activity found.
                        </Text>
                    )}
                </View>
            </View>
        </View>
    )
}



export default Activity