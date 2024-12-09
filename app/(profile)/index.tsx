import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setUserVideos } from "@/redux/userProfileSlice";
import { LoadingSpinner } from "@/components/loadSpinner";
import { fetchUserVideosData, getUserProfileData, logoutUser, subscribe } from "@/service/apiService";
import { Animated } from "react-native";
import ListOfPlayList from "./(playlist)/ListOfPlayList";
import AboutPage from "./about";
import AntDesign from "@expo/vector-icons/AntDesign";
import VideoListingCard from "@/components/VideoListingCard";
import * as SecureStore from 'expo-secure-store'
import { logout } from "@/redux/authSlice";
import { PopUp } from "@/components/LogoutPopup";
import Fontisto from '@expo/vector-icons/Fontisto';

interface userT {
  avatar?: string,
  coverImage?: string,
  email?: string,
  id: number,
  username: string,
  fullName?: string,
  createdAt: string,
  subscribers: number,
  is_subscribed: boolean
}

const { width } = Dimensions.get("window");
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export default function Index() {
  const [loading, setLoading] = useState<boolean>(false);
  const [isPageRefreshing, setIsPageRefreshing] = useState<boolean>(false)
  const [nextUserVideoLoading, setNextUserVideoLoading] = useState<boolean>(false);
  const [logoutPopupVisible, setLogoutPopupVisible] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("Home");
  const { userDetails }: any = useLocalSearchParams();
  const localUser: userT = useSelector((state: any) => state.auth?.user?.user);
  const parsedUser: userT = userDetails ? JSON.parse(userDetails) : {};
  const { user } = useSelector((state: any) => state.userProfile)
  const { userVideos } = useSelector((state: any) => state.userProfile)

  const router = useRouter()
  const dispatch = useDispatch()
  const renderVideoCard = useCallback(({ item }: any) => <VideoListingCard video={item} />, []);

  const joinedAgo = new Date(user?.createdAt)
  const monthCreated = joinedAgo.toLocaleString('default', { month: 'long' });
  const yearCreated = joinedAgo.getFullYear();  


  const getUserProfile = async () => {
    if (!parsedUser || !parsedUser.id) return;
    try {
      const userData = await getUserProfileData(parsedUser.username)
      if (userData.data) {
        dispatch(setUser(userData.data));
      }
    } catch (error) {
      // alert("Something went wrong while fetching user profile")
      console.log("Something went wrong while fetching user profile", error)
    } finally {
      setLoading(false);
    }
  };

  const fetchUserVideos = async (userId: number) => {
    // if(userVideos.length > 0) return
    if (!userId) return;
    setNextUserVideoLoading(true);
    try {
      const newVideos = await fetchUserVideosData(userId)
      // console.log('fetched videos',newVideos)
      dispatch(setUserVideos(newVideos))
    } catch (error) {
      // alert("Something went wrong while fetching user videos")
      console.log("Something went wrong while fetching user videos", error)
    } finally {
      setNextUserVideoLoading(false);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const accessToken = await SecureStore.getItemAsync("accessToken");

    try {
      await logoutUser(accessToken as string)
      dispatch(logout())
      await SecureStore.deleteItemAsync("accessToken");
      await SecureStore.deleteItemAsync("refreshToken");
      router.push('/')
    } catch (error) {
      // alert(`something went wrong while logging out user: ${error}`)
    } finally {
      setLogoutPopupVisible(false)
    }
  };

  const toggleSubscribe = async () => {
    if (!parsedUser?.id) return;
    const accessToken = await SecureStore.getItemAsync("accessToken");
    try {
      const response: any = await subscribe(parsedUser?.id, accessToken as string)
      if (response?.message === "Subscribed successfully") {
        dispatch(setUser({
          ...user,
          is_subscribed: true,
          subscribers: user?.subscribers + 1
        }))
      }
      else if (response?.message === "Unsubscribed successfully") {
        dispatch(setUser({
          ...user,
          is_subscribed: false,
          subscribers: user?.subscribers - 1
        }))
      }
    } catch (error) {
      // alert(`something went wrong while subscribing: ${error}`)
    }
  }

  useEffect(() => {
    // dispatch(setUser(parsedUser))
    const fetchData = async () => {
      await getUserProfile();
      await fetchUserVideos(parsedUser?.id);
    };
    setLoading(true);
    fetchData().finally(() => setLoading(false));
  }, []);

  if (loading) {
    return LoadingSpinner("small", "#fff")
  }

  const handleRefresh = async () => {
    setIsPageRefreshing(true)
    await fetchUserVideos(parsedUser?.id)
    await getUserProfile()
    setIsPageRefreshing(false)
  };

  if (!userDetails) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>You're not signed in.</Text>
        <Text style={styles.subMessage}>Please sign in to view your profile.</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/login')}>
          <Text
            onPress={() => router.push('/(auth)/login')}
            style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderProfileHeader = () => (
    <Animated.ScrollView
      style={[styles.container]}>
      {/* Cover Image */}
      <TouchableOpacity
      onPress={() =>{
        if(user?.coverImage) router.push({
          pathname: '/(profile)/ImageShowScreen',
          params: {
            imageUrl: user?.coverImage
          }
        })
      }}
      >
        <Image
          source={{
            uri: user?.coverImage || "https://via.placeholder.com/800x200",
          }}
          style={styles.coverImage}
        />
      </TouchableOpacity>

      {/* Profile Section */}
      <View style={styles.profileContainer}>
        <TouchableOpacity
        onPress={() =>{
          if(user?.avatar) router.push({
            pathname: '/(profile)/ImageShowScreen',
            params: {
              imageUrl: user?.avatar
            }
          })
        }}
        >
          <Image
            source={{ uri: user?.avatar || "https://via.placeholder.com/100" }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
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
            </View>
            {/* <View style={styles.stat}>
              <Text style={styles.statCount}>{user?.posts || "0"}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View> */}
            <View style={styles.actionsContainer}>
              {localUser?.id === user?.id ? (
                <AntDesign
                  onPress={() => setLogoutPopupVisible(true)}
                 name="logout" size={23} color="red" />
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    toggleSubscribe()
                  }
                  }
                  style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>{user?.is_subscribed ? 'Subscribed' : 'Subscribe'}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.subscriberContainer}>
      <Text style={styles.statCount}>{user?.subscribers || "0"}</Text>
      <Text style={styles.statLabel}>Subscribers</Text>
      </View>

      {/* Joined Date */}
      <View style={styles.joinedContainer}>
        <Fontisto
          name="date"
          size={12}
          color="green"
          style={styles.dateIcon}
        />
        <Text style={styles.joinedAgo}>
          {`Joined ${monthCreated} ${yearCreated}.`}
        </Text>
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
      <PopUp
        visible={logoutPopupVisible}
        onClose={() => setLogoutPopupVisible(false)}
        onHandler={handleLogout}
        title='Are you sure you want to logout?'
        nextBtn='Logout'
      />
      {
        activeTab === 'Home' && userVideos?.length === 0 && (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" , marginTop:10 }}>
          <AntDesign name="frowno" size={30} color="white" />
          <Text style={{ color: "#fff", fontSize: 16 }}>No Videos Found</Text>
        </View>
        )
      }
    </Animated.ScrollView>
  )



  return (
    <View
      style={styles.homeVideos}>

      {
        activeTab === 'Home' && 
        (
          <AnimatedFlatList
            style={styles.container}
            data={userVideos}
            keyExtractor={(item: any, index) => item?._id ?? index.toString()}
            renderItem={renderVideoCard}
            showsVerticalScrollIndicator={false}
            onRefresh={handleRefresh}
            refreshing={isPageRefreshing}
            ListHeaderComponent={renderProfileHeader}
            ListFooterComponent={
              nextUserVideoLoading ? (
                LoadingSpinner()
              ) : null
            }
          />
        )
      }
      {
        activeTab === 'Playlist' && (<ListOfPlayList header={renderProfileHeader} fectUserDetails={getUserProfile} />)
      }
      {
        activeTab === 'About' && (<AboutPage header={renderProfileHeader} fectUserDetails={getUserProfile} />)
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    width:width
  },
  coverImage: {
    width: width,
    height: 180,
    resizeMode: "cover",
  },
  profileContainer: {
    flex: 1,
    flexDirection: "row",
    marginTop: -25,
    width:'100%',
    // justifyContent: "space-evenly",
    // paddingHorizontal:10,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "white",
  },
  userName: {
    color: "#7BD3EA",
    fontSize: 14,
  },
  fullname: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
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
    borderTopWidth: 1,
    borderTopColor: "#333",
    borderBottomColor: "#333",
    paddingRight:15
  },
  stat: {
    alignItems: "center",
    flexDirection: "row",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
    marginRight:10
  },
  actionButton: {
    backgroundColor: "#1E90FF",
    paddingVertical: 5,
    paddingHorizontal: 7,
    borderRadius: 50,
  },
  messageButton: {
    backgroundColor: "gray",
  },
  actionButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize:11
  },
  statsMainConatainer: {
    flex: 1,
    justifyContent: "space-evenly",
    width: "100%",
    paddingTop: 10,
    paddingLeft: 7,
  },
  MainProfileContainer: {

  },
  tabContent: {
    flex: 1,
    flexDirection: "row",
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    marginBottom: 10
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
    color: "green",
    padding: 10,
    fontSize: 16,
    borderRadius: 10,
    marginRight: 10,
    fontWeight: "bold",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "green",
  },
  homeVideos: {
    flex: 1,
    backgroundColor: "black",
    padding: 5
  },
  playlist: {
    backgroundColor: "black",
  },
  subMessage: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#1E90FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  message: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  joinedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginTop: 10,
    // marginLeft: 5,
    padding: 2,
  },
  dateIcon: {
    marginRight: 8,
  },
  joinedAgo: {
    color: '#adb5bd',
    fontSize: 14,
    // fontWeight: 'bold',
  },
  subscriberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 1,
  },
  statCount: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
    // marginLeft: 10,
  },
  statLabel: {
    color: "#adb5bd",
    fontSize: 14,
    marginRight: 15,
  },

});
