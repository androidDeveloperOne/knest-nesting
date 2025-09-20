import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
interface ModalWrapperProps {
  visible: boolean;
  onClose: () => void;
  onPressOk: () => void;
  children: React.ReactNode;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({
  visible,
  onClose,
  children,
  onPressOk,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-white w-4/5 rounded-xl p-3 ">
            {children}

            <View className="flex-row   justify-between p-2  ">
              <TouchableOpacity
                onPress={onPressOk}
                className="mt-4 bg-green-600 px-4 py-2 rounded-xl"
              >
                <Text className="text-white font-semibold">Ok</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onClose}
                className="mt-4 bg-red-600 px-4 py-2 rounded-xl"
              >
                <Text className="text-white
                 font-semibold">Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ModalWrapper;
