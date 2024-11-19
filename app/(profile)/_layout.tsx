import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

export default function ProfileLayout() {
  return (
    <View style={styles.container}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: 'black' },
          headerTintColor: 'white',
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Profile', headerShown: true }} />
        <Stack.Screen name="settings" options={{ title: 'Settings' }} />
        <Stack.Screen name="edit" options={{ title: 'Edit Profile' }} />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height:'auto',
    backgroundColor: 'black',
  },
});
