import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

interface CompanyItem {
  name?: string;
  type?: string;
  drawings?: number;
  last_ts?: string;
  ipo_no?: string;
  folder_count?: string;
  // Profile-level fields
  child_name?: string;
  file_url?: string;
  uploaded_on?: string;
  version_no?: number;
}

interface FileCardProps {
  item: CompanyItem;
  onPress?: () => void;
  onDownload?: () => void;
  showFolderIcon: boolean;
  showFileIcon: boolean;
}

const FileCard: React.FC<FileCardProps> = ({
  item,
  onPress,
  onDownload,
  showFileIcon,
  showFolderIcon,
}) => {
  const getFilename = (url?: string): string => {
    if (!url) return "Unnamed";
    const parts = url.split("/");
    const fileWithExt = parts[parts.length - 1];
    const filename = fileWithExt.replace(/\.[^/.]+$/, ""); // removes .pdf or other extension
    return filename;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-xl p-2 m-2 shadow-md"
    >
      <View className="flex-row justify-between items-center">
        <View>
          <Text className="text-sm text-black">
            {item.type || "Profile File"}
          </Text>
        </View>

        {showFolderIcon && (
          <MaterialIcons name="folder" size={50} color="#FEBD17" />
        )}

        {showFileIcon && <FontAwesome6 name="file-pdf" size={30} color="red" />}
      </View>

      <View className="flex-1 ml-4">
        <Text className="text-sm font-semibold text-gray-800">
          {item.name || item?.ipo_no || getFilename(item.file_url) || "Unnamed"}
        </Text>

        {item.drawings !== undefined && (
          <Text className="text-xs font-medium text-gray-500 my-1">
            {item.folder_count} folder {item.drawings} drawing
          </Text>
        )}
      </View>

      <View className="flex-row justify-between items-center">
        <View>
          <Text className="text-xs text-gray-500 font-medium mt-1">
            {item.last_ts || item.uploaded_on}
          </Text>
        </View>

        <TouchableOpacity onPress={onDownload} className="p-1">
          <Feather name="download" size={20} color="#333" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default FileCard;
