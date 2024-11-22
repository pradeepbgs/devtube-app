import { Animated, FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setUserVideos } from '@/redux/userProfileSlice';
import { fetchUserVideosData } from '@/service/apiService';
import { LoadingSpinner } from '@/components/loadSpinner';
import { useLocalSearchParams } from 'expo-router';
import VideoListingCard from '@/components/VideoListingCard';
import { setScrollY } from '@/redux/scrollSlice';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export default function HomeVieos() {
  const [nextUserVideoLoading, setNextUserVideoLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isPageRefreshing,setIsPageRefreshing] = useState<boolean>(false)
  const { userVideos } = useSelector((state: any) => state.userProfile)

  const { userDetails }: any = useLocalSearchParams();
  const parsedUser = userDetails ? JSON.parse(userDetails) : null;
  const bounceAnim = useRef(new Animated.Value(1)).current;


  const renderVideoCard = useCallback(({ item }: any) => <VideoListingCard video={item} />, []);
  const dispatch = useDispatch()

  const fetchUserVideos = async () => {
    if(userVideos.length > 0) return
    setNextUserVideoLoading(true);
    try {
      const newVideos = await fetchUserVideosData(parsedUser?._id)
      dispatch(setUserVideos(newVideos));
    } catch (error) {
      alert("Something went wrong while fetching user videos")
      console.log("Something went wrong while fetching user videos", error)
    } finally {
      setNextUserVideoLoading(false);
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsPageRefreshing(true)
    await fetchUserVideos()
    setIsPageRefreshing(false)
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: bounceAnim } } }],
    {
      useNativeDriver: false,
      listener: (event:any) => {
        const scrollY = event.nativeEvent.contentOffset.y;
        dispatch(setScrollY(scrollY)); 
      }
    }
  );

  useEffect(() => {
    const fetchData = async () => {
      await fetchUserVideos();
    }
    fetchData()
    setLoading(false)
  }, []);

  if (loading || nextUserVideoLoading) {
    return LoadingSpinner()
  }
  

  return (
    <AnimatedFlatList
      style={styles.container}
      data={userVideos}
      keyExtractor={(item: any, index) => item?._id ?? index.toString()}
      renderItem={renderVideoCard}
      showsVerticalScrollIndicator={false}
      onRefresh={handleRefresh}
      refreshing={isPageRefreshing}
      onScroll={handleScroll}
      ListFooterComponent={
        nextUserVideoLoading ? (
          LoadingSpinner()
        ) : null
      }
    />
  )
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: '#1e1e1e',
    // paddingBottom:110,
  },
})