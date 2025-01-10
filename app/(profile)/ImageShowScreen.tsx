// ImageShowScreen.tsx
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Image, View, Text } from 'react-native';


const ImageShowScreen: React.FC<any> = () => {

    const {imageUrl}: { imageUrl: string } = useLocalSearchParams()

  return (
    <View style={styles.container}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export default ImageShowScreen;
