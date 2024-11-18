import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image, StyleSheet } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign'; 

export default function HomeLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "white",
        tabBarStyle: { backgroundColor: "black" },
        headerShown:false
      }}

      >
      {/* Home Feed */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />
          ),
        }}
      />

      {/* Subscriptions */}
      <Tabs.Screen
        name="subscriptions"
        options={{
          title: "Subscriptions",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
            name={focused ? "people" : "people-outline"} 
            size={24} 
            color={color}
             />
          ),
        }}
      />

      {/* search  */}
      <Tabs.Screen
       name="Search"
       options={{
        title:"Search",
        tabBarIcon: ({color,focused}) => (
          <AntDesign
              name={focused ? "search1" : "search1"} 
              size={24}
              color={color}
              
            />
        )
       }}
       />

      {/* Upload Video */}
      <Tabs.Screen
        name="upload"
        options={{
          title: "upload",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name="add-circle"
              size={30}
              color={color}
            />
          ),
        }}
      />

    // User profile 
    <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name="person"
                size={24}
                color={color}
              />
          ),
        }}
      />

    </Tabs>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'black'
  },
  uploadIcon: {
    fontSize:30,
    borderBlockColor:'white',
    borderColor:'white'
  },
  searchIcon: {
    borderRadius:100
  }
})