import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const _layout = () => {
  return (
    <View style={styles.container}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: 'black' },
          headerTintColor: 'white',
        }}
      >
      <Stack.Screen name="login" options={{ title: 'Login', headerShown: true }} />
      <Stack.Screen name="register" options={{ title: 'Register', headerShown: true }} />
      </Stack>
    </View>
  )
}

export default _layout

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height:'auto',
    backgroundColor: 'black',
  },
});
