import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import UserProfileLayout from '@/app/(profile)';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';

export default function Profile() {
  const { isLoggedIn } = useSelector((state: any) => state.auth);
  const router = useRouter();

  if (!isLoggedIn) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>You're not signed in.</Text>
        <Text style={styles.subMessage}>Please sign in to view your profile.</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/login')}>
          <Text 
          onPress={() => router.push('/(auth)/login')}
          style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <UserProfileLayout />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  message: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subMessage: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#1E90FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
