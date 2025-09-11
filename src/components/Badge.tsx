import { View, Text } from 'react-native';

const Badge = ({ count }: { count: number }) => {
  if (count <= 0) return null;

  return (
    <View className="absolute -right-1 -top-1 bg-red-600 rounded-full min-w-[16px] h-4 flex justify-center items-center px-1.5">
      <Text className="text-white text-xs font-bold">{count}</Text>
    </View>
  );
};
export default Badge