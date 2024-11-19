import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import VideoScreen from './player';
import { timeAgo } from '@/utils/timeAgo';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { API_URI } from '@/utils/api';

const { width } = Dimensions.get('window');

export default function Watchpage() {
  const [video, setVideo] = useState<any>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const { videoDeatails }: any = useLocalSearchParams();
  const { isLoggedIn } = useSelector((state:any) => state.auth);
  const videoData = videoDeatails ? JSON.parse(videoDeatails) : null;
  const createdAgo = timeAgo(videoData?.createdAt);

  const router = useRouter()

  const getVideoDetails = async () => {
    if (!videoData?._id) return;
    try {
      const response = await axios.get(`${API_URI}/api/v1/videos/${videoData?._id}`, {
        withCredentials: true,
      });

      if (response) {
        const video = response.data.data;
        setVideo(video);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const toggleSubscribe = async (channelId:any) => {
    if(!isLoggedIn){
      alert("Please login to subscribe");
      return;
    }
    if (!channelId) return;
    try {
        const response = await axios.post(
          `http://192.168.0.105:3000/api/v1/subscriptions/c/${channelId}`,
          null,
          { withCredentials: true }
        );
        if(response.data.message === "subscribed successfully"){
          setVideo((prevVideo:any) => ({
            ...prevVideo,
            isSubscribe: true,
          }));
        }else if(response.data.message === "unsubscribed successfully"){
          setVideo((prevVideo:any) => ({
            ...prevVideo,
            isSubscribe: false,
          }));
        }
    } catch(error:any) {
        console.error("Error toggling subscribe:", error.response.data);
    }
  }

  const handlePress = (user:any) => {
    router.push({
      pathname: '/(profile)',
      params: { user: JSON.stringify(user) },
    });
  };

  useEffect(() => {
    if (videoData) {
      setVideo(videoData);
    }
    getVideoDetails();
  }, []);

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
            numberOfLines={isExpanded ? undefined : 2}
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
          <TouchableOpacity style={styles.subscribeButton}>
            <Text 
            onPress={() => toggleSubscribe(video?.owner?._id)}
            style={styles.subscribeText}>
              {video?.isSubscribe ? 'Subscribed' : 'Subscribe'}
            </Text>
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
    padding: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -10,
  },
  text: {
    color: 'white',
    fontSize: 20,
    marginBottom: 5,
    fontWeight: '600',
    fontFamily: 'Arial',
  },
  viewsAndTimeText: {
    color: '#bbb', 
    fontSize: 16, 
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
    fontSize: 16,
    lineHeight: 22,
    fontFamily: 'Arial',
    marginTop: 8,
    backgroundColor: 'rgba(50, 50, 50, 0.6)',
    borderRadius: 10,
    padding: 4,
  },
  subscribeButton: {
    backgroundColor: '#FF0000',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  subscribeText: {
    color: 'white',
    fontSize: 16,
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
});
