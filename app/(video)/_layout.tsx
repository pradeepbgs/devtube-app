import { StyleSheet, View } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';

export default function _layout() {
  return (
    // <View style={styles.container}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: 'black' },
          headerTintColor: 'black',
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="watchpage"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    // {/* </View> */}
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height:'auto',
    backgroundColor: 'black',
  },
});
