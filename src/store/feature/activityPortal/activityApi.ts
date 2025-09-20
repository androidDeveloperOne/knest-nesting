import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";



const BASE_URL = "https://erp.knestaluform.in/api/method/knest_custom_app.knest_aluform.apis.nesting_portal.list_activity"

export const getActivityDataAPI = async () => {
    try {
        const saved = await AsyncStorage.getItem("credentials");
        if (!saved) {
            throw new Error("No credentials found in AsyncStorage");
        }
        const { usr, pwd } = JSON.parse(saved);

        const response = await axios.get(
            BASE_URL,
            // JSON body containing your request data
            {
                params: {
                    usr,
                    pwd,
                },
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );


        return response.data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data.message || "Request failed");
        } else if (error.request) {
            throw new Error("No response from server");
        } else {
            throw new Error(error.message || "Unexpected error");
        }
    }
}