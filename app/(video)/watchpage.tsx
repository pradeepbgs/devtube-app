import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import VideoScreen from "./player";
import { timeAgo, whenCreated } from "@/utils/timeAgo";
import axios from "axios";
import { useSelector } from "react-redux";
import { API_URI } from "@/utils/api";
import * as SecureStore from "expo-secure-store";
import AntDesign from "@expo/vector-icons/AntDesign";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import CommentsPage from "../(comments)/comments";
import { handleBounce } from "@/utils/bounce";
import { LoadingSpinner } from "@/components/loadSpinner";
import VideoListingCard from "@/components/VideoListingCard";
import { PopUp } from "@/components/PopUp";
import { PlayListPopUp } from "@/components/PlayListPopUp";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import DescriptionPage from "./DescriptionPage";

const { width } = Dimensions.get("window");

export default function Watchpage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [video, setVideo] = useState<any>(null);
  const [suggestionVideos, setsuggestionVideos] = useState<any>(null);
  const [page, setPage] = useState<number>(1);
  const [suggestionVideoLoading, setsuggestionVideoLoading] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [logoutPopupVisible, setLogoutPopupVisible] = useState<boolean>(false);
  const [playlistPopupVisible, setPlaylistPopupVisible] = useState<boolean>(false);
  const { videoDeatails }: any = useLocalSearchParams();
  const { isLoggedIn } = useSelector((state: any) => state.auth);
  const [isCommentOpened, setIsCommentOpened] = useState<boolean>(false);
  const videoData = videoDeatails ? JSON.parse(videoDeatails) : null;
  const createdAgo = timeAgo(videoData?.createdAt);
  const createdOn = whenCreated(videoData?.createdAt);
  const localUser = useSelector((state: any) => state.auth.user?.user);
  const router = useRouter();
  const bounceAnim = useRef(new Animated.Value(1)).current;

  // Fetch video details from API
  const getVideoDetails = async () => {
    setLoading(true);
    if (!videoData?.id) return;

    const accessToken = (await SecureStore.getItemAsync("accessToken"));

    try {
      const response = await axios.get(`${API_URI}/api/v1/video/video-details/${videoData.id}`, {
        headers: {
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
        withCredentials: true,
      });
      if (response.data?.data) {
        setVideo(response.data.data);
      }
    } catch (error) {
      ToastAndroid.show("something went wrong while getting video details", ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  // Toggle subscribe/unsubscribe functionality
  const toggleSubscribe = async (channelId: any) => {
    if (!isLoggedIn) {
      setLogoutPopupVisible(true);
      return;
    }
    if (!channelId) return;
    const accessToken = await SecureStore.getItemAsync("accessToken");

    try {
      const response = await axios.post(`${API_URI}/api/v1/subscription/toggle/${channelId}/`, null, {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      });

      if (response.data.message === "Subscribed successfully") {
        setVideo((prevVideo: any) => ({
          ...prevVideo,
          isSubscribed: true,
          subscribers: prevVideo?.subscribers + 1,
        }));
      } else if (response.data.message === "Unsubscribed successfully") {
        setVideo((prevVideo: any) => ({
          ...prevVideo,
          isSubscribed: false,
          subscribers: prevVideo?.subscribers - 1,
        }));
      }
    } catch (error: any) {
      ToastAndroid.show(`Error toggling subscription`, ToastAndroid.SHORT);
      // alert(`Error toggling subscription: ${JSON.stringify(error.response?.data)}`);
    }
  };

  const toggleLike = async () => {
    if (!isLoggedIn) {
      setLogoutPopupVisible(true);
      return;
    }
    if (!video?.id) return;
    handleBounce(bounceAnim);
    const accessToken = await SecureStore.getItemAsync("accessToken");
    try {
      const res = await axios.post(`${API_URI}/api/v1/like/toggle/${video?.id}/`, null, {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      });
      if (res.data.message === "Video liked successfully") {
        setVideo((prevVideo: any) => ({
          ...prevVideo,
          isLiked: true,
          likes: prevVideo?.likes + 1,
        }));
      } else if (res.data.message === "Video unliked successfully") {
        setVideo((prevVideo: any) => ({
          ...prevVideo,
          isLiked: false,
          likes: prevVideo?.likes - 1,
        }));
      }
    } catch (error: any) {
      ToastAndroid.show(`Error toggling subscription`, ToastAndroid.SHORT);
      // alert(`Error toggling subscription: ${JSON.stringify(error.response?.data)}`);
    }
  };

  const getSuggestionVideo = async () => {
    setsuggestionVideoLoading(true);
    try {
      const response = await axios.get(`${API_URI}/api/v1/video?page=${page}`, {
        withCredentials: true,
      });
      const newVideos = response?.data?.data || [];
      if (page === 1) {
        setsuggestionVideos(newVideos);
      } else {
        setsuggestionVideos((prevVideos: any) => [...prevVideos, ...newVideos]);
      }
    } catch (error:any) {
      ToastAndroid.show(`Error fetching videos`, ToastAndroid.SHORT);
      // console.log("Error fetching videos:", error);
    } finally {
      setLoading(false);
      setsuggestionVideoLoading(false);
    }
  };

  const handlePress = (user: any) => {
    router.push({
      pathname: "/(profile)",
      params: { userDetails: JSON.stringify(user) },
    });
  };

  useEffect(() => {
    getVideoDetails();
    getSuggestionVideo();
  }, [videoData?.id]);


  const renderHeader = () => (
    <View style={styles.textContainer}>
      <Text onPress={() => setIsExpanded(!isExpanded)} style={styles.text}>
        {video?.title || "No Title"}
      </Text>

      <View>
      <Text onPress={() => setIsExpanded(!isExpanded)} style={styles.viewsAndTimeText}>
        {video?.views || 0} views · {createdAgo}
        <TouchableOpacity
        activeOpacity={1}
        onPress={() => setIsExpanded(!isExpanded)}
        style={styles.viewMoreContainer}
        >
        <Text style={styles.viewMore}>
          {isExpanded ? "...less" : "...more"}
        </Text>
        </TouchableOpacity>
      </Text>
      </View>

      {/*  */}
      <View style={styles.owner}>
        <View style={styles.ownerContainer}>
          <TouchableOpacity onPress={() => handlePress(video.owner)}>
            <Image source={{ uri: video?.owner?.avatar }} style={styles.avatar} />
          </TouchableOpacity>
          {/* <View> */}
          <Text style={styles.ownerText}>{video?.owner?.fullname || "Unknown User"}</Text>
          <Text style={styles.subscribersText}>{video?.subscribers || 0}</Text>
          {/* </View> */}
        </View>
        <TouchableOpacity
          style={video?.isSubscribed ? styles.subscribeButton : styles.unsubscribeButton}
          onPress={() => toggleSubscribe(video?.owner?.id)}
        >
          <Text style={video?.isSubscribed ? styles.subscribeText : styles.unsubscribeText}>
            {video?.isSubscribed ? "Subscribed" : "Subscribe"}
          </Text>
        </TouchableOpacity>
      </View>
      {/* fro like & comment btn  */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={() => toggleLike()}>
          <Animated.View style={[styles.likeButton, { transform: [{ scale: bounceAnim }] }]}>
            <AntDesign
              name={video?.isLiked ? "like1" : "like2"}
              size={14}
              color={video?.isLiked ? "green" : "white"}
            />
            <Text style={styles.likeText}>{video?.likes ? video.likes : 0}</Text>
          </Animated.View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareButton}>
          <AntDesign name="sharealt" size={13} color="white" />
        </TouchableOpacity>
        {/* for playlist save  */}
        <TouchableOpacity onPress={() => setPlaylistPopupVisible(true)} style={styles.saveButton}>
          <MaterialIcons name="playlist-add" size={17} color="white" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsCommentOpened(!isCommentOpened)} style={styles.commentButton}>
          <EvilIcons name="comment" size={24} color={isCommentOpened ? "#6bd3ff" : "white"} />
        </TouchableOpacity>
      </View>
      <PlayListPopUp
        userId={localUser?.id}
        videoId={video?.id}
        visible={playlistPopupVisible}
        onClose={() => setPlaylistPopupVisible(false)}
      />

      <PopUp
        visible={logoutPopupVisible}
        onClose={() => setLogoutPopupVisible(false)}
        onHandler={() => {
          setLogoutPopupVisible(false);
          router.push("/(auth)/login");
        }}
        header = 'Login'
        title="You need to login to subscribe to this channel"
        nextBtn="Login"
      />
    </View>
  );

  return (
    <>
      <View style={styles.container}>
        {loading && LoadingSpinner()}
        <VideoScreen url={video?.url} />

        <View style={styles.commentContainer}>
          {isCommentOpened && <CommentsPage onClose={() => setIsCommentOpened(false)} />}
        </View>

        {/* description  */}
        {isExpanded && (
        <DescriptionPage 
        video={video}
        createdOn={createdOn}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        /> 
        )
        }
        {/*  */}

        <FlatList
          style={styles.videocard}
          data={suggestionVideos}
          keyExtractor={(item: any, index) => item?._id ?? index.toString()}
          renderItem={({ item }) => <VideoListingCard video={item} />}
          showsVerticalScrollIndicator={false}
          // onEndReached={handleEndReached}
          ListHeaderComponent={renderHeader}
          onEndReachedThreshold={0.5}
          ListFooterComponent={suggestionVideoLoading ? LoadingSpinner() : null}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    backgroundColor: "black",
    paddingHorizontal:2
  },
  textContainer: {
    padding: 9,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -6,
    borderBottomWidth: 2,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
    marginBottom: 6,
  },
  text: {
    color: "white",
    fontSize: 16,
    // marginBottom: 5,
    fontWeight: "bold",
    fontFamily: "Arial",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  viewsAndTimeText: {
    color: "#bbb",
    fontSize: 12,
    fontWeight: "400",
    fontFamily: "Arial",
    marginTop:6
  },

  avatar: {
    width: 35,
    height: 35,
    borderRadius: 25,
    marginRight: 12,
  },
  ownerText: {
    color: "white",
    fontSize: 13,
    fontWeight: "800",
    fontFamily: "Roboto",
  },
  owner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
  },
  ownerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  subscribersText: {
    color: "#bbb",
    fontSize: 12,
    marginTop: 2,
    marginLeft: 10,
    fontFamily: "Arial",
    fontWeight: "700",
    textAlign: "center",
  },
  
  subscribeButton: {
    backgroundColor: "#FF0000",
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 20,
  },
  unsubscribeButton: {
    backgroundColor: "#ccc",
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 20,
  },
  subscribeText: {
    color: "white",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  unsubscribeText: {
    backgroundColor: "#ccc",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  showMoreText: {
    color: "#1e90ff",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 5,
    textAlign: "right",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    alignItems: "center",
    textAlign: "center",
  },
  likeButton: {
    // flex:1,
    flexDirection: "row",
    borderRadius: 80,
    alignItems: "center",
    backgroundColor: "#252422",
    width: 55,
    height: 28,
    paddingLeft: 10,
  },
  unlikeButton: {
    flexDirection: "row",
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 80,
    backgroundColor: "#252422",
    width: 55,
    height: 28,
    paddingLeft: 10,
  },
  likeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "400",
    textAlign: "center",
    marginLeft: 7,
  },
  shareButton: {
    borderRadius: 30,
    backgroundColor: "#252422",
    padding: 12,
    paddingLeft: 20,
    width: 55,
    height: 35,
  },
  commentButton: {
    borderRadius: 80,
    backgroundColor: "#252422",
    padding: 6,
    paddingLeft: 15,
    width: 55,
    height: 35,
  },
  saveButton: {
    borderRadius: 80,
    backgroundColor: "#252422",
    padding: 8,
    paddingLeft: 19,
    width: 55,
    height: 35,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  videocard: {
    marginTop: 5,
  },
  commentContainer: {
    // flex:1,
  },
  viewMoreContainer:{
    // textAlign:'center'
  },
  viewMore: {
    color: "#6bd3ff",
    fontSize: 12,
    fontWeight: "bold",
    marginLeft:10,
    // marginTop:10
  },

});
