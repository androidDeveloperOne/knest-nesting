import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Dimensions, TouchableOpacity, Text, BackHandler } from 'react-native';
import Pdf from 'react-native-pdf';
import { RouteProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/Stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import FullScreenLoader from './FullScreenLoader';

type PdfViewerRouteProp = RouteProp<RootStackParamList, 'PdfViewer'>;

interface Props {
  route: PdfViewerRouteProp;
}

const PdfViewer: React.FC<Props> = ({ route }) => {
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const { fileUrl } = route.params;

  // Extract filename from URL
  const getFileName = (url: string) => {
    try {
      const parts = url.split('/');
      const lastPart = parts[parts.length - 1];
      return decodeURIComponent(lastPart.split('?')[0]); // removes any query params
    } catch {
      return 'Document.pdf'; // fallback filename
    }
  };

  const fileName = getFileName(fileUrl);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.goBack();
        return true;
      };
  
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
  
      return () => subscription.remove();
    }, [navigation])
  );
  
  useEffect(() => {
    const fallback = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(fallback);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}> 
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {fileName}
          </Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
            <Text style={styles.closeText}>X</Text>
          </TouchableOpacity>
        </View>

        <Pdf
          source={{ uri: fileUrl, cache: true }}
          style={styles.pdf}
          onLoadComplete={() => setLoading(false)}
          onLoadProgress={(percent) => {
            // This might not fire for remote URL, but included anyway
            if (percent >= 0.9) setLoading(false);
          }}
          onError={(error) => {
            console.log("pdferror", error);
            setLoading(false);
          }}
        />
      </View>

      <FullScreenLoader visible={loading} useGif message="Loading..." />
    </SafeAreaView>
  );
};

export default PdfViewer;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
    backgroundColor: '#f8f8f8',
  },
  title: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: 'black',
  },
  closeButton: {
    marginLeft: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,0,0,0.2)',
    borderRadius: 6,
  },
  closeText: {
    color: 'red',
    fontSize: 14,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
  },
});
