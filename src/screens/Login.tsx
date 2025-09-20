import { useEffect, useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import { useAppDispatch, useAppSelector, } from "../store";
import { login } from "../store/feature/auth/authSlice";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/Stack";
import FullScreenLoader from "../components/FullScreenLoader";


interface LoginScreenProps {
  navigation: StackNavigationProp<RootStackParamList, "Login">
}
const Login: React.FC<LoginScreenProps> = ({ navigation }) => {
  // State
  const [usr, setUsr] = useState("");
  const [pwd, setPwd] = useState("");
  const [validationError, setValidationError] = useState<string>("");
  // const [loading, setLoading] = useState<boolean>(false);

  const [successMessage, setSuccessMessage] = useState<string>("");
  const dispatch = useAppDispatch();
  const { error, loading, isAuthenticated, } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigation.replace("Dashboard");
    }
  }, [isAuthenticated]);



  const handleLogin = async () => {

    console.log("i am press")
    if (!usr || !pwd) {
      setValidationError("UserName and password are required.");
      return;
    }
    dispatch(login({ usr, pwd }));
  };

  return (
    // <LinearGradient
    //   colors={["#0a2351", "#4f46e5"]}
    //   start={{ x: 0, y: 0 }}
    //   end={{ x: 1, y: 0 }}
    //   style={{ flex: 1 }}
    // >
      <View className="flex-1  bg-[#0a2351] justify-center px-4 space-y-4">
        <View className="flex justify-center items-center mb-12">
          <Image
            source={require("../../assets/knest_logo.png")}
            style={{ width: 200, height: 50 }}
          />
        </View>

        {/* Shared Email Input */}
        <TextInput
          className="w-full p-3 my-3 border  bg-white rounded-xl"
          placeholder="User Name "
          value={usr}
          onChangeText={(text) => {
            setUsr(text);
            setValidationError("");
            setSuccessMessage("");
          }}
          keyboardType="default"
        />

        {/* Conditional: Login or Forgot Password Form */}

        <TextInput
          className="w-full p-3 my-3 border bg-white rounded-xl"
          placeholder="Password"
          value={pwd}
          onChangeText={(text) => {
            setPwd(text);
            setValidationError("");
          }}
          secureTextEntry
          keyboardType="default"
        />

        {validationError ? (
          <Text className="text-red-500 text-center">{validationError}</Text>
        ) : null}

        {error && (
          <Text className="text-red-500 text-center mt-1">{error}</Text>
        )}

        <FullScreenLoader visible={loading} useGif message="Logging in..." />


        <View className="my-3 px-28 rounded-xl">
          <TouchableOpacity
            className="bg-blue-800 rounded-xl"
            onPress={handleLogin}
            disabled={loading}
          >
            <Text className="my-2 text-center font-semibold text-white">
              {loading ? "Logging in..." : "Login"}
            </Text>
          </TouchableOpacity>
        </View>


      </View>
    // </LinearGradient>
  );
};

export default Login;
