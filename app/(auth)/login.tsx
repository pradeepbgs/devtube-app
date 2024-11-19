import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import Input from '@/components/Input'; 
import { useRouter } from 'expo-router';
import { z } from 'zod';
import { signinSchema, signUpValidation } from '@/zod/authZodValidation';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_URI } from '@/utils/api';

export default function Login({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullname, setFullname] = useState('');
  const [avatar, setAvatar] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [isRegistering, setIsRegistering] = useState(false); 
  const router = useRouter();

  const handleLogin = async () => {
    try {
      signinSchema.parse({identifier:email, password })
      const response = await axios.post(
        `${API_URI}/api/v1/users/login`,
        {
          identifier:email,
          password,
        },
        {
          withCredentials: true,
        }
      );
      
      const { user } = response.data.data;
      await SecureStore.setItemAsync('user', JSON.stringify(user));
      // will store access & refreshtoke in local str and many more things
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log(error.errors); 
        alert(error.errors.map(err => err.message).join("\n"));
      }
    }
  };

  const handleRegister = async () => {
    try {
      signUpValidation.parse({ username, fullname, password, confirmPassword, avatar, coverImage });
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log(error.errors)
        alert(error.errors.map(err => err.message).join("\n"));
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isRegistering ? 'Register' : 'Login'}</Text>
      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
      />
      
      <Input
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        secureTextEntry
      />
      
      {isRegistering && (
        <Input
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm your password"
          secureTextEntry
        />
      )}

      <TouchableOpacity 
        style={styles.button} 
        onPress={isRegistering ? handleRegister : handleLogin}>
        <Text style={styles.buttonText}>{isRegistering ? 'Register' : 'Login'}</Text>
      </TouchableOpacity>

      {/* Toggle between Login and Register */}
      <TouchableOpacity style={styles.switchButton} onPress={() => setIsRegistering(!isRegistering)}>
        <Text style={styles.switchButtonText}>
          {isRegistering 
            ? 'Already have an account? ' 
            : 'Don’t have an account? '}
          <Text style={{ color: 'skyblue' }}>
            {isRegistering ? 'Login' : 'Register'}
          </Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 20,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
  },
  switchButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  switchButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
