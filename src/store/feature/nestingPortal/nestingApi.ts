import axios from "axios";
import { ProfileRequestBody, RequestBody } from "./nestingTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL =
  "https://erp.knestaluform.in/api/method/knest_custom_app.knest_aluform.apis.nesting_portal.list_tree";

export const getCompanyDataAPI = async (data: RequestBody) => {
  try {
    const saved = await AsyncStorage.getItem("credentials");
    if (!saved) {
      throw new Error("No credentials found in AsyncStorage");
    }
    const { usr, pwd } = JSON.parse(saved);

    console.log("dataatCompy", data)
    const response = await axios.post(
      BASE_URL,
      data, // JSON body containing your request data
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
};




const PROFILE_FILES_URL =
  "https://erp.knestaluform.in/api/method/knest_custom_app.knest_aluform.apis.nesting_portal.list_profile_files";


export const getProfileFilesAPI = async (data: ProfileRequestBody) => {
  try {
    // 1. Get saved credentials from AsyncStorage
    const saved = await AsyncStorage.getItem("credentials");

    if (!saved) {
      throw new Error("No credentials found in AsyncStorage");
    }

    let credentials: { usr: string; pwd: string };

    try {
      credentials = JSON.parse(saved);
    } catch {
      throw new Error("Failed to parse credentials from storage.");
    }

    const { usr, pwd } = credentials;



    // 3. Send POST request 
    const response = await axios.post(
      PROFILE_FILES_URL,
      data,
      {
        params: { usr, pwd },
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000, // optional timeout
      }
    );

    // 4. Return the response data
    return response.data;

  } catch (error: any) {
    console.error("[Profile API] Error:", error);

    if (axios.isAxiosError(error)) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Server returned an error");
    } else if (error.request) {
      throw new Error("No response from server");
    } else {
      throw new Error(error.message || "Unexpected error");
    }
  }
};