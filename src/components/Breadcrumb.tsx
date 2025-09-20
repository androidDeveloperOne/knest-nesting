import React, { useEffect, useRef, useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import Entypo from '@expo/vector-icons/Entypo';

interface BreadcrumbProps {
  items: string[];
  onItemPress?: (label: string, index: number) => void;
  bgColor:string[]
}


const SCROLL_OFFSET = 100;

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, onItemPress, bgColor }) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100); // small delay to ensure content layout is complete
    }
  }, [items]);

  const scrollLeft = () => {
    if (scrollViewRef.current) {
      const newPos = Math.max(scrollPosition - SCROLL_OFFSET, 0);
      scrollViewRef.current.scrollTo({ x: newPos, animated: true });
      setScrollPosition(newPos);
    }
  };

  const scrollRight = () => {
    if (scrollViewRef.current) {
      const maxScroll = contentWidth - containerWidth;
      const newPos = Math.min(scrollPosition + SCROLL_OFFSET, maxScroll);
      scrollViewRef.current.scrollTo({ x: newPos, animated: true });
      setScrollPosition(newPos);
    }
  };



  const canScroll = contentWidth > containerWidth;
  const atStart = scrollPosition <= 0;
  const atEnd = scrollPosition >= contentWidth - containerWidth - 5;


  if (!items.length) return null;

  return (

    <View className="flex-row ">
      {canScroll && (
        <Pressable
          onPress={scrollLeft}
          disabled={atStart}
          className={` rounded-md  justify-center items-center   ${atStart ? "hidded" : "flex"}`}
        >
     <Entypo name="chevron-small-left" size={24} color="black" />
        </Pressable>
      )}

      <ScrollView
        horizontal
        ref={scrollViewRef}
        showsHorizontalScrollIndicator={false}
        onContentSizeChange={(w) => setContentWidth(w)}
        onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
        scrollEventThrottle={16}
        onScroll={(e) => setScrollPosition(e.nativeEvent.contentOffset.x)}
        contentContainerStyle={{ alignItems: "center" }}
        className="flex-grow"
      >
        <View className="flex-row px-2">
          {items.map((item, index) => (
            <View key={index} className="flex-row items-center">
              <Pressable
                onPress={() => onItemPress?.(item, index)}
                hitSlop={8}
              >
                <View className={`rounded-md ${bgColor?.[index] || "bg-gray-400" }  px-2 py-1 rounded-md`}>
                  <Text className="text-xs font-medium text-white">
                    {item}
                  </Text>
                </View>
              </Pressable>
              {index < items.length - 1 && (
                <View className="mx-2 h-0.5 bg-gray-400 w-6" />
              )}
            </View>
          ))}
        </View>
      </ScrollView>


      {canScroll && (
        <Pressable
          onPress={scrollRight}
          disabled={atEnd}
          className={` rounded-md  justify-center items-center     ${atEnd ? "hidden" : "flex"}`}
        >
         <Entypo name="chevron-small-right" size={24} color="black" />
        </Pressable>
      )}
    </View>

  );
};
export default Breadcrumb;
