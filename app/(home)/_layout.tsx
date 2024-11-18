import { Link, Tabs, useRouter, useSegments } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign'; 

export default function HomeLayout() {
  const segments = useSegments()
  const router = useRouter();
  let isHomePage = true
  if (segments.length > 1){
    isHomePage = false
  }

  return (
    <View style={styles.container}>
      {
        isHomePage && (
          <View style={styles.header}>
            <Link
            href={"/"}
            style={styles.logo}
            >
            <Image
            resizeMode="contain"
            source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/e/ef/Youtube_logo.png" }}
            style={styles.logo}
          />
            </Link>
          
          
          <TouchableOpacity 
          style={styles.notificationIcon}
          onPress={() => router.push('/(notication)/notification')}>
            <Ionicons name="notifications" size={24} color="white" />
          </TouchableOpacity>
        </View>
        )
      }
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
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    // justifyContent:'center',
    // alignItems:'center',
    backgroundColor:'black'
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
    // paddingLeft:5,
    backgroundColor: "black",
  },
  uploadIcon: {
    fontSize:30,
    borderBlockColor:'white',
    borderColor:'white'
  },
  searchIcon: {
    borderRadius:100
  },
  text:{
    color:'white',
    fontSize:20
  },
  logo: {
    width: 50,
    height: 30,
    resizeMode: "contain",
    paddingLeft:20,
  },
  notificationIcon: {
    marginRight: 20,
    width: 30,
    height: 20,
    resizeMode: "contain",
  },
})