import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import VideoScreen from './player';
import { timeAgo } from '@/utils/timeAgo';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { API_URI } from '@/utils/api';
import * as SecureStore from 'expo-secure-store';
import AntDesign from '@expo/vector-icons/AntDesign';
import EvilIcons from '@expo/vector-icons/EvilIcons';



const { width } = Dimensions.get('window');

export default function Watchpage() {
  const [video, setVideo] = useState<any>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const { videoDeatails }: any = useLocalSearchParams();
  const { isLoggedIn } = useSelector((state:any) => state.auth);
  const videoData = videoDeatails ? JSON.parse(videoDeatails) : null;
  const createdAgo = timeAgo(videoData?.createdAt);

  const router = useRouter();

  // Fetch video details from API
  const getVideoDetails = async () => {
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
  };

  // Toggle subscribe/unsubscribe functionality
  const toggleSubscribe = async (channelId: any) => {
    if (!isLoggedIn) {
      router.push('/(auth)/login')
      return;
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
    } catch (error:any) {
      alert(`Error toggling subscription: ${JSON.stringify(error.response?.data)}`);
    }
  };

  const handlePress = (user: any) => {
    router.push({
      pathname: '/(profile)',
      params: { user: JSON.stringify(user) },
    });
  };

  useEffect(() => {
    getVideoDetails();
  }, [videoData?._id]);
  return (
    <View style={styles.container}>
      <VideoScreen url={video?.videoFile} />
      <View style={styles.textContainer}>
        <Text style={styles.text}>{video?.title || 'No Title'}</Text>
        <Text style={styles.viewsAndTimeText}>
          {video?.views || 0} views · {createdAgo}
        </Text>
        <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)} activeOpacity={0.9}>
          <Text
            style={styles.descriptionText}
            numberOfLines={isExpanded ? undefined : 1}
          >
            {video?.description || 'No Description'}
          </Text>
        </TouchableOpacity>
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
            <View>
              <Text style={styles.ownerText}>{video?.owner?.fullname || 'Unknown User'}</Text>
              <Text style={styles.subscribersText}>
                {video?.subscribersCount || 0} subscribers
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={video?.isSubscribed ? styles.subscribeButton : styles.unsubscribeButton}
            onPress={() => toggleSubscribe(video?.owner?._id)}
          >
            <Text style={video?.isSubscribed ? styles.subscribeText: styles.unsubscribeText}>
              {video?.isSubscribed ? 'Subscribed' : 'Subscribe'}
            </Text>
          </TouchableOpacity>
        </View>
        {/* fro like & comment btn  */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.likeButton} >
          <AntDesign 
          name="like2" size={24} color="white" /> 
          <Text style={styles.text}>{video?.likesCount}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton} >
          <AntDesign name="sharealt" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.commentButton} >
            <EvilIcons name="comment" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
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
    // marginTop: -10,
  },
  text: {
    color: 'white',
    fontSize: 18,
    marginBottom: 5,
    fontWeight: 'bold',
    fontFamily: 'Arial',
  },
  viewsAndTimeText: {
    color: '#bbb',
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'Arial',
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 25,
    marginRight: 15,
  },
  ownerText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Roboto',
  },
  owner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
  },
  ownerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subscribersText: {
    color: '#bbb',
    fontSize: 14,
    marginTop: 2,
    fontFamily: 'Arial',
  },
  descriptionText: {
    color: 'white',
    fontSize: 13,
    lineHeight: 22,
    fontFamily: 'Arial',
    marginTop: 8,
    backgroundColor: 'rgba(50, 50, 50, 0.6)',
    borderRadius: 10,
    padding: 5,
  },
  subscribeButton: {
    backgroundColor: '#FF0000',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  unsubscribeButton: {
    backgroundColor: '#ccc',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  subscribeText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
  },
  unsubscribeText: {
    backgroundColor: '#ccc',
    fontSize: 16,
    fontWeight: '400',
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
  },
  likeButton: {
    flex:1,
    flexDirection: 'row',
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 80,
    backgroundColor: 'grey',
    padding:20,
    width:68,
    height:46
  },
  shareButton: {
    flex: 1,
    borderRadius: 30,
    backgroundColor: 'grey',
    padding:17,
    width:70,
    height:55
  },
  commentButton: {
    flex: 1,
    borderRadius: 80,
    backgroundColor: 'grey',
    padding:16,
    width:69,
    height:52
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
