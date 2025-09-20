import { FC, useEffect, useState } from "react";
import { Button, Image, Text, TouchableOpacity, View } from "react-native";
import { useAppDispatch, useAppSelector, } from "../store";
import { logout } from "../store/feature/auth/authSlice";
import ModalWrapper from "../components/ModalWrapper";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Profile: FC = () => {
    const [isModalVisible, setIsModalVisible] = useState(false)
    const dispatch = useAppDispatch()
    const {  data } = useAppSelector((state) => state.auth);
    const [user, setUser] = useState<any>(null);
console.log("dataprofile",data, user)
    const handleOpenModal = () => {
        setIsModalVisible(true)
    }
    useEffect(() => {
        const loadStoredUser = async () => {
          const jsonValue = await AsyncStorage.getItem("user");
          const storedUser = jsonValue ? JSON.parse(jsonValue) : null;
          console.log("storedUser:", storedUser);
          setUser(storedUser)
        };
      
        loadStoredUser();
      }, []);
      
    const handleLogout = () => {
        dispatch(logout())
        setIsModalVisible(false);
    }

    return (
        <View className="flex-1  items-center bg-white   px-5 " >

            <View className=" my-10 bg-blue-50 rounded-xl p-28 ">

                <View className="py-10 ">

                    <Image
                        source={require("../../assets/profile.png")}
                        style={{ width: 100, height: 50 }}
                    />

                </View>
                <View>

                    <Text className="font-semibold">{user?.full_name}</Text>
                </View>
                <View className="my-5">

                    <TouchableOpacity
                        onPress={handleOpenModal}

                        className="bg-[#0a2351] rounded-md py-2 "
                    >
                        <Text className="text-center font-semibold text-white" >

                            Logout
                        </Text>
                    </TouchableOpacity>
                </View>

            </View>

            <ModalWrapper
                onPressOk={handleLogout}
                onClose={() => setIsModalVisible(false)}
                visible={isModalVisible}
                children={<Text className="text-center my-3 text-gray-500">Are you sure you want logout ?</Text>}
            />
        </View>
    )
}

5
export default Profile