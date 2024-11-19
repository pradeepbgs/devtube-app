import { Dimensions, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useSelector } from 'react-redux';

const { width } = Dimensions.get('window');


export default function Index() {
  const { user } = useLocalSearchParams();
  const { isLoggedIn } = useSelector((state: any) => state.auth);

  return (
    <View style={styles.container}>
        <Text style={styles.text}>profile.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    height:'auto',
    backgroundColor: 'black',
  },
  text: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
