import { Animated, FlatList, StyleSheet, Text, View, Image, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { getPlayListVideos } from '@/service/apiService';
import VideoListingCard from '@/components/VideoListingCard';
import { setPlayListVideos } from '@/redux/userProfileSlice';
import { LoadingSpinner } from '@/components/loadSpinner';
import AntDesign from '@expo/vector-icons/AntDesign';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export default function Playlist() {
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const { playListInfo }: any = useLocalSearchParams();
  const parsedPlayList = playListInfo ? JSON.parse(playListInfo) : null;
  const {user} = useSelector((state: any) => state.auth.user);
  const dispatch = useDispatch();
  const playListVideos = useSelector((state: any) => state.userProfile.playListVideos);
  

  const getPlayListvideos = async () => {
    try {
      if (!parsedPlayList) return;
      const res = await getPlayListVideos(parsedPlayList?.id);
      if (res) {
        dispatch(setPlayListVideos(res));
      }
    } catch (error: any) {
      // alert(`Error while fetching playlist details: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await getPlayListvideos();
    setIsRefreshing(false);
  };

  useEffect(() => {
    getPlayListvideos();
  }, [parsedPlayList?._id]);


  const videos = playListVideos || [];

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Playlist Header */}
      <Image
        source={{
          uri: parsedPlayList?.thumbnail ||
            'https://images.pexels.com/photos/326055/pexels-photo-326055.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        }}
        style={styles.image}
      />
      <View style={styles.infoContainer}>
        <View>
          <View style={styles.userContainer}>
            <Image
              source={{ uri: parsedPlayList?.owner?.avatar }}
              style={styles.avatar}
            />
            <Text style={styles.title}>{parsedPlayList?.name || 'Playlist Title'}</Text>
          </View>
          <Text style={styles.subText}>
            {parsedPlayList?.videoCount} videos
          </Text>
        </View>
        {user?.id === parsedPlayList?.owner?.id && <AntDesign
          name="setting"
          size={25}
          style={styles.settingsIcon}
          color="white"
        />}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? LoadingSpinner() :
      <AnimatedFlatList
      data={videos}
      keyExtractor={(item: any) => item.id}
      renderItem={({ item }) => <VideoListingCard video={item} />}
      contentContainerStyle={styles.listContainer}
      ListHeaderComponent={renderHeader}
      refreshing={isRefreshing}
      onRefresh={handleRefresh}
      />
    }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    width: '100%',
  },
  headerContainer: {
    width: '100%',
    backgroundColor: 'black',
  },
  image: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  subText: {
    fontSize: 14,
    color: 'gray',
    marginTop: 4,
  },
  settingsIcon: {
    marginTop: 10,
    paddingRight: 20,
  },
  listContainer: {
    paddingBottom: 16,
  },
});
