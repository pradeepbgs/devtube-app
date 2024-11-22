import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/userProfileSlice";
import { LoadingSpinner } from "@/components/loadSpinner";
import { getUserProfileData } from "@/service/apiService";
import HomeVieos from './home'
import { Animated } from "react-native";
import ListOfPlayList from "./(playlist)/ListOfPlayList";


const { width } = Dimensions.get("window");

export default function Index() {
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("Home");
  const { userDetails }: any = useLocalSearchParams();
  const localUser = useSelector((state: any) => state.auth.user);
  const parsedUser = userDetails ? JSON.parse(userDetails) : null;
  const { user } = useSelector((state: any) => state.userProfile)
  const { scrollY } = useSelector((state: any) => state.scroll);
  const dispatch = useDispatch()
  const userDetailsOpacity = useRef(new Animated.Value(1)).current;
  const router = useRouter()

  const getUserProfile = async () => {
    try {
      const userData = await getUserProfileData(parsedUser?.username)
      if (userData) {
        dispatch(setUser(userData));
      }
    } catch (error) {
      alert("Something went wrong while fetching user profile")
      console.log("Something went wrong while fetching user profile", error)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (parsedUser) await getUserProfile()
    };
    fetchData();
  }, [userDetails]);

  if (loading) {
    return LoadingSpinner("small", "#fff")
  }


  return (
    <>
      <Animated.ScrollView
        style={[styles.container]}>
        {/* Cover Image */}
        <View>
          <Image
            source={{
              uri: user?.coverImage || "https://via.placeholder.com/800x200",
            }}
            style={styles.coverImage}
          />
        </View>

        {/* Profile Section */}
        <View style={styles.profileContainer}>
          <View>
            <Image
              source={{ uri: user?.avatar || "https://via.placeholder.com/100" }}
              style={styles.profileImage}
            />
          </View>
          <View style={styles.statsMainConatainer}>
            <View style={styles.statsContainer}>
              <View style={styles.stat}>
                <View>
                  <Text style={styles.fullname}>
                    {user?.fullname || "Anonymous User"}
                  </Text>
                  <Text style={styles.userName}>
                    @{user?.username || "No username"}
                  </Text>
                </View>
                <Text style={styles.statCount}>{user?.subscribersCount || "0"}</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>
              {/* <View style={styles.stat}>
              <Text style={styles.statCount}>{user?.posts || "0"}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View> */}
              <View style={styles.actionsContainer}>
                {localUser?.id !== user?.id ? (
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>Subscribe</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          </View>
        </View>

        {/* Users videos , playlist */}
        <View style={styles.MainProfileContainer}>
          {/* will make a list like home , videos, playlist , about and do flexDirection row */}
          <View style={styles.tabContent}>
            <Text
              onPress={() => setActiveTab("Home")}
              style={activeTab === "Home" ? styles.activeTabText : styles.tabText}
            >
              Home
            </Text>

            <Text
              onPress={() => setActiveTab("Playlist")}
              style={
                activeTab === "Playlist" ? styles.activeTabText : styles.tabText
              }
            >
              Playlist
            </Text>

            <Text
              onPress={() => setActiveTab("About")}
              style={
                activeTab === "About" ? styles.activeTabText : styles.tabText
              }
            >
              About
            </Text>
          </View>
        </View>
        {/* Video Listing Page  */}
      </Animated.ScrollView>
      <View
        style={styles.homeVideos}>
        {
          activeTab === 'Home' && <HomeVieos />
        }
        {
          activeTab === 'Playlist' && <ListOfPlayList />
        }
      </View>
      {/* {
        activeTab === 'Playlist' && (
          <View style={styles.playlist}>
            <ListOfPlayList />
          </View>
        )
      } */}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    marginBottom: -150,
  },
  coverImage: {
    width: width,
    height: 190,
    resizeMode: "cover",
  },
  profileContainer: {
    flex: 1,
    flexDirection: "row",
    marginTop: -25,
    // marginLeft:10
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "white",
  },
  userName: {
    color: "#EEEEEE",
    fontSize: 14,
    // fontWeight: 'bold',
    // marginBottom: 1,
    // marginLeft:25,
  },
  fullname: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
    // marginTop: 5,
    // marginLeft:25,
  },
  userBio: {
    color: "gray",
    fontSize: 14,
    textAlign: "center",
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    // paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#333",
    borderBottomColor: "#333",
  },
  stat: {
    alignItems: "center",
    flexDirection: "row",
  },
  statCount: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10,
    marginLeft: 10,
  },
  statLabel: {
    color: "gray",
    fontSize: 14,
    marginRight: 15,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  actionButton: {
    backgroundColor: "#1E90FF",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  messageButton: {
    backgroundColor: "gray",
  },
  actionButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  statsMainConatainer: {
    flex: 1,
    justifyContent: "space-evenly",
    width: "100%",
    paddingTop: 10,
    paddingLeft: 7,
  },
  MainProfileContainer: {
    // width:'100%',
    // paddingTop:10,
    // paddingLeft:7,
  },
  tabContent: {
    flex: 1,
    flexDirection: "row",
    // justifyContent:'space-between',
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  tabText: {
    color: "#686D76",
    padding: 10,
    fontSize: 16,
    borderRadius: 10,
    marginRight: 10,
    fontWeight: "bold",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  activeTabText: {
    color: "white",
    padding: 10,
    fontSize: 16,
    borderRadius: 10,
    marginRight: 10,
    fontWeight: "bold",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  homeVideos: {
    flex: 1,
    backgroundColor: "black",
  },
  playlist: {
    // flex: 1,
    backgroundColor: "black",
  },
});
