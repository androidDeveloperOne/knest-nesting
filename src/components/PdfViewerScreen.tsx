import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Dimensions, TouchableOpacity, Text, BackHandler } from 'react-native';
import Pdf from 'react-native-pdf';
import { RouteProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/Stack';
import { SafeAreaView } from 'react-native-safe-area-context';

type PdfViewerRouteProp = RouteProp<RootStackParamList, 'PdfViewer'>;

interface Props {
  route: PdfViewerRouteProp;
}

const PdfViewer: React.FC<Props> = ({ route }) => {
  const navigation = useNavigation();
  const { fileUrl } = route.params;
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.goBack();
        return true;
      };
  
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
  
      return () => subscription.remove();  // Correct way to remove listener now
    }, [navigation])
  );
  

  console.log("fileUrl",fileUrl)
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}> 
    <View style={styles.container}>
         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
        <Text style={styles.closeText}>Close</Text>
      </TouchableOpacity>
      <Pdf
        source={{ uri: fileUrl, cache: true }}
        trustAllCerts={false}
        style={styles.pdf}
        onLoadComplete={(pages) => {
          console.log(`Total pages: ${pages}`);
        }}
        onError={(error) => {
          console.log( "pdferror",  error);
        }}
        // activityIndicator={<ActivityIndicator size="large" color="#4f46e5" />}
      />
    </View>
    </SafeAreaView>
    
  );
};

export default PdfViewer;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff', // or your background color
  },
  container: {
    flex: 1,
 
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  closeButton: {
    position: 'absolute',
    top: 20, // adjust for your UI
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255,0,0,0.2)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  closeText: {
    color: 'red',
    fontSize: 14,
  },
});
