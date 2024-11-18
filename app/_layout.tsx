import { Stack, Tabs } from "expo-router";
import { StyleSheet, View, StatusBar, Image } from "react-native";

export default function RootLayout() {
  return (
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
        options={{headerShown:false}}
        />

        <Stack.Screen 
        name="(video)" 
        options={{headerShown:false}} 
        />
      </Stack>
    </View>
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
