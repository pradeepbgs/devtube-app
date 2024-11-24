import { ActivityIndicator, Animated, Dimensions, Easing, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import VideoScreen from './player';
import { timeAgo } from '@/utils/timeAgo';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { API_URI } from '@/utils/api';
import * as SecureStore from 'expo-secure-store';
import AntDesign from '@expo/vector-icons/AntDesign';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import CommentsPage from '../(comments)/comments';
import { handleBounce } from '@/utils/bounce';
import { LoadingSpinner } from '@/components/loadSpinner';
import VideoListingCard from '@/components/VideoListingCard';
import { PopUp } from '@/components/LogoutPopup';


const { width } = Dimensions.get('window');

export default function Watchpage() {
  const [loading, setLoading] = useState<boolean>(true)
  const [video, setVideo] = useState<any>(null);
  const [suggestionVideos, setsuggestionVideos] = useState<any>(null);
  const [page, setPage] = useState<number>(1)
  const [suggestionVideoLoading, setsuggestionVideoLoading] = useState<boolean>(false)
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [logoutPopupVisible, setLogoutPopupVisible] = useState<boolean>(false);
  const { videoDeatails }: any = useLocalSearchParams();
  const { isLoggedIn } = useSelector((state: any) => state.auth);
  const [isCommentOpened, setIsCommentOpened] = useState<boolean>(false)
  const videoData = videoDeatails ? JSON.parse(videoDeatails) : null;
  const createdAgo = timeAgo(videoData?.createdAt);

  const router = useRouter();
  const bounceAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Fetch video details from API
  const getVideoDetails = async () => {
    setLoading(true)
    if (!videoData?._id) return;

    const accessToken = await SecureStore.getItemAsync("accessToken");

    try {
      const response = await axios.get(`${API_URI}/api/v1/videos/${videoData._id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      });

      if (response.data.data) {
        setVideo(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching video details:", error);
    }
    finally {
      setLoading(false)
    }
  };

  // Toggle subscribe/unsubscribe functionality
  const toggleSubscribe = async (channelId: any) => {
    if (!isLoggedIn) {
      setLogoutPopupVisible(true);
      return 
    }
    if (!channelId) return;
    const accessToken = await SecureStore.getItemAsync("accessToken");

    try {
      const response = await axios.post(
        `${API_URI}/api/v1/subscriptions/c/${channelId}`,
        null,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true
        }
      );

      if (response.data.message === "subscribed successfully") {
        setVideo((prevVideo: any) => ({
          ...prevVideo,
          isSubscribed: true,
          subscribersCount: prevVideo?.subscribersCount + 1
        }));
      } else if (response.data.message === "unsubscribed successfully") {
        setVideo((prevVideo: any) => ({
          ...prevVideo,
          isSubscribed: false,
          subscribersCount: prevVideo?.subscribersCount - 1
        }));
      }
    } catch (error: any) {
      alert(`Error toggling subscription: ${JSON.stringify(error.response?.data)}`);
    }
  };

  const toggleLike = async () => {
    if (!isLoggedIn) {
      setLogoutPopupVisible(true);
      return;
    }
    if (!video?._id) return;
    handleBounce(bounceAnim)
    const accessToken = await SecureStore.getItemAsync("accessToken");
    try {
      const res = await axios.post(`${API_URI}/api/v1/likes/toggle/v/${video?._id}`, null, {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      })
      if (res.data.message === "liked video") {
        setVideo((prevVideo: any) => ({
          ...prevVideo,
          isLiked: true,
          likesCount: prevVideo?.likesCount + 1
        }));
      } else if (res.data.message === "unliked video") {
        setVideo((prevVideo: any) => ({
          ...prevVideo,
          isLiked: false,
          likesCount: prevVideo?.likesCount - 1
        }));
      }
    } catch (error: any) {
      alert(`Error toggling subscription: ${JSON.stringify(error.response?.data)}`);
    }
  }

  const getSuggestionVideo = async () => {
    setsuggestionVideoLoading(true)
    try {
      const response = await axios.get(`${API_URI}/api/v1/videos?page=${page}`, {
        withCredentials: true,
      });
      const newVideos = response?.data?.data || [];
      if (page === 1) {
        setsuggestionVideos(newVideos);
      } else {
        setsuggestionVideos((prevVideos): any => [...prevVideos, ...newVideos]);
      }
    } catch (error) {
      console.log("Error fetching videos:", error);
    } finally {
      setLoading(false);
      setsuggestionVideoLoading(false);
    }
  }

  const handlePress = (user: any) => {
    router.push({
      pathname: '/(profile)',
      params: { user: JSON.stringify(user) },
    });
  };



  useEffect(() => {
    getVideoDetails();
    getSuggestionVideo()
  }, [videoData?._id]);


  const renderHeader = () => (
      <View style={styles.textContainer} >
        <Text onPress={() => setIsExpanded(!isExpanded)} style={styles.text}>{video?.title || 'No Title'}</Text>
        <Text onPress={() => setIsExpanded(!isExpanded)} style={styles.viewsAndTimeText}>
          {video?.views || 0} views · {createdAgo} 
          <Text 
          onPress={() => setIsExpanded(!isExpanded)}
          style={styles.viewMore} >
             {isExpanded ? '...Read Less' : '...Read More'}
            </Text>
        </Text>
        {/* description  */}
        <TouchableOpacity style={styles.descriptionConatiner} onPress={() => setIsExpanded(!isExpanded)} activeOpacity={0.9}>
          <Text
            style={[
              styles.descriptionText,
              { display: isExpanded ? 'flex' : 'none' },
            ]}
            numberOfLines={isExpanded ? undefined : 1}
          >
            {video?.description || 'No Description'}
          </Text>
        </TouchableOpacity>
        {/*  */}
        <View style={styles.owner}>
          <View style={styles.ownerContainer}>
            <TouchableOpacity
              onPress={() => handlePress(video.owner)}
            >
              <Image
                source={{ uri: video?.owner?.avatar }}
                style={styles.avatar}
              />
            </TouchableOpacity>
            {/* <View> */}
              <Text style={styles.ownerText}>{video?.owner?.fullname || 'Unknown User'}</Text>
              <Text style={styles.subscribersText}>
                {video?.subscribersCount || 0} 
              </Text>
            {/* </View> */}
          </View>
          <TouchableOpacity
            style={video?.isSubscribed ? styles.subscribeButton : styles.unsubscribeButton}
            onPress={() => toggleSubscribe(video?.owner?._id)}
          >
            <Text style={video?.isSubscribed ? styles.subscribeText : styles.unsubscribeText}>
              {video?.isSubscribed ? 'Subscribed' : 'Subscribe'}
            </Text>
          </TouchableOpacity>
        </View>
        {/* fro like & comment btn  */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            onPress={() => toggleLike()}
          >
            <Animated.View
              style={[
                styles.likeButton,
                { transform: [{ scale: bounceAnim }] },
              ]}
            >
              <AntDesign
                name={video?.isLiked ? "like1" : "like2"}
                size={14}
                color={video?.isLiked ? "green" : "white"}
              />
              <Text style={styles.likeText}>{video?.likesCount}</Text>
            </Animated.View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton} >
            <AntDesign name="sharealt" size={13} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setIsCommentOpened(!isCommentOpened)}
            style={styles.commentButton} >
            <EvilIcons
              name="comment"
              size={24}
              color={isCommentOpened ? '#6bd3ff' : 'white'}
            />
          </TouchableOpacity>
        </View>
        <PopUp 
        visible={logoutPopupVisible}
        onClose={() => setLogoutPopupVisible(false)}
        onHandler={() => {
          setLogoutPopupVisible(false);
          router.push('/(auth)/login')
        }}
        title='You need to login to subscribe to this channel'
        nextBtn='Login'
      />
      </View>
  )

  return (
    <>
      <View style={styles.container}>
       <VideoScreen url={video?.videoFile} />
      
      <View style={styles.commentContainer}>
        {
          isCommentOpened && <CommentsPage onClose={() => setIsCommentOpened(false)} />
        }
      </View>
      
         <FlatList
        style={styles.videocard}
        data={suggestionVideos}
        keyExtractor={(item: any, index) => item?._id ?? index.toString()}
        renderItem={({ item }) => <VideoListingCard video={item} />}
        showsVerticalScrollIndicator={false}
        // onEndReached={handleEndReached}
        ListHeaderComponent={renderHeader}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          suggestionVideoLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#00ff00" />
            </View>
          ) : null
        }
      />
      
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    backgroundColor: 'black',
  },
  textContainer: {
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -10,
    borderBottomWidth:2,
    borderBottomColor:'rgba(255, 255, 255, 0.2)',
    marginBottom:6
  },
  text: {
    color: 'white',
    fontSize: 18,
    // marginBottom: 5,
    fontWeight: 'bold',
    fontFamily: 'Arial',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black"
  },
  viewsAndTimeText: {
    color: '#bbb',
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'Arial',
  },

  avatar: {
    width: 35,
    height: 35,
    borderRadius: 25,
    marginRight: 12,
  },
  ownerText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '800',
    fontFamily: 'Roboto',
  },
  owner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  ownerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  subscribersText: {
    color: '#bbb',
    fontSize: 12,
    marginTop: 2,
    marginLeft:10,
    fontFamily: 'Arial',
    fontWeight: '700',
    textAlign:'center'
  },
  descriptionConatiner:{
    backgroundColor: 'rgba(50, 50, 50, 0.6)',
    borderRadius: 10,
    marginTop: 5,
    paddingHorizontal:10
  },
  descriptionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 22,
    fontFamily: 'Arial',
    marginTop: 5,
    borderRadius: 10,
    padding: 5,
  },
  subscribeButton: {
    backgroundColor: '#FF0000',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 20,
  },
  unsubscribeButton: {
    backgroundColor: '#ccc',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 20,
  },
  subscribeText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  unsubscribeText: {
    backgroundColor: '#ccc',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  showMoreText: {
    color: '#1e90ff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 5,
    textAlign: 'right',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    alignItems: 'center',
    textAlign:'center'
  },
  likeButton: {
    // flex:1,
    flexDirection: 'row',
    borderRadius: 80,
    alignItems:'center',
    backgroundColor: '#252422',
    width: 55,
    height: 28,
    paddingLeft:10
  },
  unlikeButton: {
    flexDirection: 'row',
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 80,
    backgroundColor: '#252422',
    width: 55,
    height: 28,
    paddingLeft:10
  },
  likeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '400',
    textAlign: 'center',
    marginLeft: 7,
  },
  shareButton: {
    borderRadius: 30,
    backgroundColor: '#252422',
    padding: 12,
    paddingLeft: 20,
    width: 55,
    height: 35
  },
  commentButton: {
    borderRadius: 80,
    backgroundColor: '#252422',
    padding: 6,
    paddingLeft: 15,
    width: 55,
    height: 35
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  videocard: {
    marginTop: 5
  },
  commentContainer: {
    // flex:1,
  },
  viewMore: {
    color: '#6bd3ff',
    fontSize: 12,
    fontWeight: 'bold',
  }

});
