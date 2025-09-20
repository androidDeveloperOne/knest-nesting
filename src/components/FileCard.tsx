import React from "react";
import { TouchableOpacity, View, Text, Image } from "react-native";
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
  bgColor:string
  viewType?: "grid" | "list"; 
  showDownloadIcon?: boolean
}

const FileCard: React.FC<FileCardProps> = ({
  item,
  onPress,
  onDownload,
  showFileIcon,
  showFolderIcon,
  bgColor,
  viewType = "grid" ,
  showDownloadIcon
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
      className={`${bgColor} rounded-2xl p-3 m-2 shadow-xl ${
        viewType === "list" ? "flex-row items-center" : ""
      }`}
    >
      {/* Icon Section */}
      <View className={`${viewType === "list" ? "mr-3" : "items-center"} ${viewType === "grid" ? "mb-2" : ""}`}>
        {showFolderIcon && (
          // <MaterialIcons name="folder" size={viewType === "list" ? 40 : 50} color="#FEBD17" />
          <Image
          source={require("../../assets/folder.png")}
          style={{ width: viewType === "list" ? 40 : 50, height: 50 }}
          />
        )}
        {showFileIcon && (
          <FontAwesome6 name="file-pdf" size={viewType === "list" ? 28 : 30} color="red" />
        )}
      </View>

      {/* Text & Details */}
      <View className="flex-1">
        <Text className="text-sm font-semibold text-gray-800">
          {item.name || item.ipo_no || getFilename(item.file_url) || "Unnamed"}
        </Text>

        {item.drawings !== undefined && (
          <Text className="text-xs font-medium text-gray-500 my-1">
            {/* {item.folder_count} folder{item.folder_count !== "1" ? "s" : ""}, */}
             {item.drawings} drawing{item.drawings !== 1 ? "s" : ""}
          </Text>
        )}

        <Text className="text-xs text-gray-500 font-medium mt-1">
          {item.last_ts || item.uploaded_on}
        </Text>
      </View>
{showDownloadIcon  &&(
        <TouchableOpacity onPress={onDownload} className={`p-2 bg-white rounded-md   ${viewType === "list" ? "ml-2" : "absolute top-2 right-2"}`}>
        <Feather name="download" size={18} color="black" />
      </TouchableOpacity>
)

}
      {/* Download Button (show on list view, or always if needed) */}

    </TouchableOpacity>

  );
};

export default FileCard;
