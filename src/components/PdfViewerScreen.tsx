import React from 'react';
import { View, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';
import Pdf from 'react-native-pdf';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/Stack';

type PdfViewerRouteProp = RouteProp<RootStackParamList, 'PdfViewer'>;

interface Props {
  route: PdfViewerRouteProp;
}

const PdfViewer: React.FC<Props> = ({ route }) => {
  const { fileUrl } = route.params;

  return (
    <View style={styles.container}>
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
  );
};

export default PdfViewer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
