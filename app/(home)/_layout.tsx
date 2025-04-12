import { Link, Tabs, useRouter, useSegments } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image, StyleSheet, View, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';


export default function HomeLayout() {
  const user = useSelector((state: any) => state.auth?.user);
  const userAvatar = user?.user?.avatar;

  const segments = useSegments();
  const router = useRouter();
  let isHomePage = true;
  if (segments.length > 1) {
    isHomePage = false;
  }

  const handlePress = () => {
    router.push({
      pathname: '/(profile)',
      params: {
        userDetails: JSON.stringify(user?.user ?? undefined),
      },
    });
  };

  return (
    <View style={styles.container}>
      {isHomePage && (
        <View style={styles.header}>
          <Link href={"/"} style={styles.logo}>
            <Image
              resizeMode="contain"
              source={{
                uri: "https://upload.wikimedia.org/wikipedia/commons/e/ef/Youtube_logo.png",
              }}
              style={styles.logo}
            />
          </Link>

          <TouchableOpacity
            style={styles.notificationIcon}
            onPress={() => router.push("/(notication)/notification")}
          >
            <Ionicons name="notifications" size={24} color="white" />
          </TouchableOpacity>
        </View>
      )}
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "white",
          tabBarStyle: { backgroundColor: "black" },
          headerShown: false,
        }}
      >
        {/* Home Feed */}
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={21}
                color={color}
              />
            ),
          }}
        />

        {/* Subscriptions */}
        <Tabs.Screen
          name="subscriptions"
          options={{
            title: "Subscriptions",
            tabBarIcon: ({ color, focused }) => (
              <MaterialIcons
                name={focused ? "people" : "people-outline"}
                size={22}
                color={color}
              />
            ),
          }}
        />

        {/* Search */}


        {/* Upload Video */}
        <Tabs.Screen
          name="upload"
          options={{
            title: "Upload",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name="add-circle" size={30} color={color} />
            ),
          }}
        />

        {/* Search */}

        <Tabs.Screen
          name="search"
          options={{
            title: "Search",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "search" : "search-outline"}
                size={24}
                color={color}
              />
            ),
          }}
        />

        {/* User Profile */}
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, focused }) => (
              userAvatar ? (
                <View
                  style={[
                    styles.avatarWrapper,
                    focused && styles.avatarFocused,
                  ]}
                // onPress={() => handlePress}
                >
                  <Image
                    source={{ uri: userAvatar }}
                    style={styles.userAvatar}
                  />
                </View>
              ) : (
                <Ionicons
                  name="person"
                  size={24}
                  color={color}
                // onPress={() => handlePress}
                />
              )
            ),
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              handlePress()
            }
          }}
        />
      </Tabs>
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
    paddingTop: 4,
    backgroundColor: "black",
  },
  logo: {
    width: 50,
    height: 30,
    resizeMode: "contain",
    paddingLeft: 20,
  },
  notificationIcon: {
    marginRight: 20,
    width: 30,
    height: 20,
    resizeMode: "contain",
  },
  avatarWrapper: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarFocused: {
    borderColor: "white",
  },
  userAvatar: {
    width: 29,
    height: 29,
    borderRadius: 15,
  },
});
