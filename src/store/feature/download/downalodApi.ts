import axios from "axios";
import * as FileSystem from "expo-file-system";
import { Platform } from "react-native";
import { shareAsync } from "expo-sharing";
import { encode } from "base64-arraybuffer";
export const downloadFileDirect = async (
  usr: string,
  pwd: string,
  child_name: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  try {
    if (!child_name) throw new Error("Missing file name");

    // 1. Call API to get file binary directly
    const response = await axios.get(
      "https://erp.knestaluform.in/api/method/knest_custom_app.knest_aluform.apis.nesting_portal.download",
      {
        params: { usr, pwd, child_name },
        responseType: "arraybuffer", // important to get binary data
        onDownloadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = progressEvent.loaded / progressEvent.total;
            onProgress(progress);
          }
        },
      }
    );

    // 2. Convert binary data to base64
    const base64Data = encode(response.data);

    // 3. Write file locally
    const localPath = FileSystem.cacheDirectory + `${child_name}.pdf`;

    await FileSystem.writeAsStringAsync(localPath, base64Data, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // 4. Check if file exists & size > 0
    const fileInfo = await FileSystem.getInfoAsync(localPath);
    if (!fileInfo.exists || fileInfo.size === 0) {
      throw new Error("Downloaded file is missing or empty");
    }

    // 5. For Android: ask user to save with SAF
    if (Platform.OS === "android") {
      const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (!permissions.granted) {
        console.warn("User denied folder access, sharing file instead");
        await shareAsync(localPath);
        return localPath;
      }

      const safUri = await FileSystem.StorageAccessFramework.createFileAsync(
        permissions.directoryUri,
        `${child_name}.pdf`,
        "application/pdf"
      );

      await FileSystem.writeAsStringAsync(safUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      return safUri;
    }

    // 6. iOS fallback: share file
    await shareAsync(localPath);

    return localPath;
  } catch (error: any) {
    console.error("Download error:", error.message || error);
    throw new Error(error.message || "Download failed");
  }
};
