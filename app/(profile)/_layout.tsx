import { Colors } from '@/constant/colors';
import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

export default function ProfileLayout() {
  return (
    <View style={styles.container}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colors.charCoalBlack },
          headerTintColor: 'white',
          animation:'fade'
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
    backgroundColor: Colors.charCoalBlack,
  },
});
