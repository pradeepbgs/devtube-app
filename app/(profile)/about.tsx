import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

export default function AboutPage({ header ,fectUserDetails}: any) {
  return (
    <View style={styles.container}>
      {header && header()}
      <Text style={styles.aboutText}>This is the about section.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  aboutText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 20,
  },
});
