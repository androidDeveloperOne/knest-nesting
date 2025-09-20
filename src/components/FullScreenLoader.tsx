import { ActivityIndicator, Image, Modal, Text, View } from "react-native";
interface FullScreenLoaderProps {
    visible: boolean;
    useGif?: boolean;
    message?: string;
  }
  


const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({ visible, useGif = false, message }) => {
    if (!visible) return null;
  
    return (
      <Modal visible={visible} transparent animationType="fade">
        <View className="flex-1 bg-black/50 justify-center items-center">
          {useGif ? (
            <Image
              source={require("../../assets/Loader.gif")}
              className="w-24 h-24"
            />
          ) : (
            <ActivityIndicator size="large" color="#fff" />
          )}
          {message && <Text className="text-white mt-4 text-lg">{message}</Text>}
        </View>
      </Modal>
    );
  };
  
  export default FullScreenLoader;