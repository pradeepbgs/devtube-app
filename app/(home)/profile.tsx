import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import UserProfileLayout from '@/app/(profile)';
import { useSelector } from 'react-redux';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function Profile() {
  const { isLoggedIn , user} = useSelector((state: any) => state.auth);
  const { userDetails }: any = useLocalSearchParams();
  const router = useRouter();
  if (!isLoggedIn) {
    return (
      <View style={styles.container}>
        <View>

        <Text style={styles.message}>You're not signed in.</Text>
        <Text style={styles.subMessage}>Please sign in to view your profile.</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/login')}>
          <Text 
          onPress={() => router.push('/(auth)/login')}
          style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
          </View>
      </View>
    );
  }


  useEffect(() => {
    if (isLoggedIn && user?.user?._id) {
      router.push({
        pathname: '/(home)/profile',
        params: { userDetails: JSON.stringify(user?.user) },
      });
    }
  }, [isLoggedIn,user?._id,userDetails])

  return (
    <View style={styles.container}>
      <UserProfileLayout />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
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
