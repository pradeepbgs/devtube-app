import { Stack } from "expo-router";
import { StyleSheet, View, StatusBar, Text } from "react-native";
import { Provider, useDispatch } from "react-redux";
import store from "@/redux/store";
import * as SecureStore from 'expo-secure-store';
import { login } from "@/redux/authSlice";
import React, { useEffect, useState } from "react";
import { isTokenExpired } from "@/utils/jwt";
import axios from "axios";
import { API_URI } from "@/utils/api";
 
export default function RootLayout() {
  
  return (
    <Provider store={store}>
      <AppInitializer />
    </Provider>
  );
}

function AppInitializer() {
  const dispatch = useDispatch();
  const [isloading,setisloading] = useState<boolean>(true)

  async function initializeUser() {
    const user = await SecureStore.getItemAsync("user");
    const accessToken :any = await SecureStore.getItemAsync("accessToken");
    const refreshToken = await SecureStore.getItemAsync("refreshToken");
    const isTokenExpire:boolean = await isTokenExpired(accessToken as string);

    if(isTokenExpire){
      const res = await axios.post(`${API_URI}/api/v1/user/refresh-token/`, {}, {
        headers: { Authorization: `Bearer ${refreshToken}` },
        withCredentials: true,
      });
      
      if (res.data.data) {
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = res.data.data;
      
        await SecureStore.setItemAsync("accessToken", newAccessToken);
        await SecureStore.setItemAsync("refreshToken", newRefreshToken);
      } 
    }

    if (user) {
      dispatch(login({ isLoggedIn: true, user: JSON.parse(user) }));
    }
    setisloading(false)
  }
  
  useEffect(() => {
    initializeUser();
  }, [dispatch,isloading]);
  



  return (
    <View style={styles.container}>
      <StatusBar barStyle="default" backgroundColor="black" />
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
});
