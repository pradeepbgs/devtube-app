import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import React, { useState } from 'react';
import Input from '@/components/Input';
import { useRouter } from 'expo-router';
import { z } from 'zod';
import { signinSchema, signUpValidation } from '@/zod/authZodValidation';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_URI } from '@/utils/api';
import { login } from '@/redux/authSlice';
import { useDispatch } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';

export default function Login({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullname, setFullname] = useState('');
  const [avatar, setAvatar] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      // signinSchema.parse({ identifier: username, password });
      const data = new FormData()
      data.append('username', username)
      data.append('password', password)
      const response = await axios.post(
        `${API_URI}/api/v1/user/login/`,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        }
      );
      // console.log(response.data)
      const { user } = response.data;
      // console.log('this is user',user)
      await SecureStore.setItemAsync('user', JSON.stringify(user));
      await SecureStore.setItemAsync('accessToken', response.data.user.accessToken);
      await SecureStore.setItemAsync('refreshToken', response.data.user.refreshToken);
      dispatch(login({ isLoggedIn: true, user: user }));
      router.push('/(home)');
    } catch (error: any) {
      setError(error?.response?.data?.message || 'An error occurred during login.');
      // alert(`Login error: ${error?.response?.data?.message || 'Please try again later.'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    setError(null); // Reset error before new request
    try {
      signUpValidation.parse({ username, fullname, password, confirmPassword, avatar, coverImage });
      const data = new FormData();
      data.append('username', username);
      data.append('email', email);
      data.append('fullname', fullname);
      data.append('password', password);
      data.append('avatar', {
        uri: avatar,
        name: 'avatar.jpg',
        type: 'image/jpeg',
      });

      if (coverImage) {
        data.append('coverImage', {
          uri: coverImage,
          name: 'coverImage.jpg',
          type: 'image/jpeg',
        });
      }

      const response = await axios.post(`${API_URI}/api/v1/user/register/`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        setIsRegistering(false);
        // alert('Registration successful. You can now log in.');
      } else {
        throw new Error('Registration failed. Please try again.');
      }
    } catch (error: any) {
      setError(error?.response?.data?.message || 'An error occurred during registration.');
      // alert(`Registration error: ${error?.response?.data?.message || 'Please try again later.'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleImagePick = async (setImage: any) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{isRegistering ? 'Register' : 'Login'}</Text>
      {isRegistering && (
        <>
          <TouchableOpacity style={styles.imagePicker} activeOpacity={1} onPress={() => handleImagePick(setCoverImage)}>
            <Text style={styles.imageText}>Upload Cover Image</Text>
            {coverImage && <Image source={{ uri: coverImage }} style={styles.image} />}
          </TouchableOpacity>

          <TouchableOpacity style={styles.imagePicker} onPress={() => handleImagePick(setAvatar)}>
            <Text style={styles.imageText}>Upload Avatar</Text>
            {avatar && <Image source={{ uri: avatar }} style={styles.avatar} />}
          </TouchableOpacity>

          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
          />
          <Input
            label="Full Name"
            value={fullname}
            onChangeText={setFullname}
            placeholder="Enter your full name"
          />
        </>
      )}
      <Input
        label="Username"
        value={username}
        onChangeText={setUsername}
        placeholder="Enter your username"
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
        onPress={isRegistering ? handleRegister : handleLogin}
        disabled={loading}
      >
        {
          loading ? 
          <Text style={styles.buttonText}>...</Text>
          :
          <Text style={styles.buttonText}>{isRegistering ? 'Register' : 'Login'}</Text>
        }
      </TouchableOpacity>

      {/* Toggle between Login and Register */}
      <TouchableOpacity style={styles.switchButton} onPress={() => setIsRegistering(!isRegistering)}>
        <Text style={styles.switchButtonText}>
          {isRegistering
            ? 'Already have an account? '
            : 'Don’t have an account? '}
          <Text 
          style={{ color: 'skyblue' }}>
            {isRegistering ? 'Login' : 'Register'}
          </Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: 'black',
    padding: 10,
    justifyContent: 'center',
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
  imagePicker: {
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    borderRadius: 8,
  },
  imageText: {
    color: 'white',
    marginBottom: 10,
    backgroundColor: 'grey',
    borderRadius: 10,
    padding: 5,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 10,
  },
  loadingText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 10,
  },
});
