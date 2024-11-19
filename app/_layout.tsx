import { Stack, Tabs } from "expo-router";
import { StyleSheet, View, StatusBar } from "react-native";
import { Provider } from "react-redux";
import store from "@/redux/store";

export default function RootLayout() {
  return (
    <Provider store={store}>
    <View style={styles.container}>
      <StatusBar barStyle={'default'} backgroundColor="black" />
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
          headerShown:false,
        }}
        />

        <Stack.Screen 
        name="(video)" 
        options={{headerShown:false}} 
        />
      </Stack>
    </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
});
