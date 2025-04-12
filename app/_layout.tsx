import './global.css'
import { Stack } from "expo-router";
import { StyleSheet, View, StatusBar, Text, SafeAreaView } from "react-native";
import { Provider, useDispatch } from "react-redux";
import store from "@/redux/store";
import * as SecureStore from 'expo-secure-store';
import * as SplashScreen from "expo-splash-screen";
import { login } from "@/redux/authSlice";
import React, { useEffect, useState } from "react";
import { isTokenExpired } from "@/utils/jwt";
import axios from "axios";
import { API_URI, AUTH_API_URI } from "@/utils/api";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  
  return (
    <Provider store={store}>
      <AppInitializer />
    </Provider>
  );
}

function AppInitializer() {
  const dispatch = useDispatch();
  const [appIsReady, setAppIsReady] = useState(false);


  async function initializeUser() {
    try {
      const user = await SecureStore.getItemAsync("user");
      const accessToken :string | null = await SecureStore.getItemAsync("accessToken");
      const refreshToken:string | null = await SecureStore.getItemAsync("refreshToken");
      const isTokenExpire:boolean = await isTokenExpired(accessToken as string);
      if(isTokenExpire){
        const res = await axios.get(`${AUTH_API_URI}/refresh-token/`, {
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${refreshToken}` 
          },
          withCredentials: true,
        });
        if (res.data?.data) {
          const { accessToken: newAccessToken, refreshToken: newRefreshToken } = res.data.data;
        
          await SecureStore.setItemAsync("accessToken", newAccessToken);
          await SecureStore.setItemAsync("refreshToken", newRefreshToken);
        } 
      }
  
      if (user) {
        dispatch(login({ isLoggedIn: true, user: JSON.parse(user) }));
      } 
      else {
        dispatch(login({ isLoggedIn: false, user: null }));
      }
    } catch (error) {
      // // console.error("Error initializing user:", error);
      // await SecureStore.deleteItemAsync("accessToken");
      // await SecureStore.deleteItemAsync("refreshToken");
      dispatch(login({ isLoggedIn: false, user: null }));
    } finally {
      setAppIsReady(true);
    }
  }
  
  useEffect(() => {
    initializeUser();
  }, [dispatch]);
  

  useEffect(() => {
    if(appIsReady) SplashScreen.hideAsync()
  },[appIsReady])


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="default" 
      backgroundColor="black" 
      />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "black" },
          headerTintColor: "black",
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="(home)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(profile)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="(video)" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
});
