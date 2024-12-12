import { Animated, FlatList, StyleSheet, Text, View, Image, ToastAndroid } from 'react-native';
import React, { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { getPlayListVideos, removeVideoToPlayList } from '@/service/apiService';
import VideoListingCard from '@/components/VideoListingCard';
import { setPlayListVideos } from '@/redux/userProfileSlice';
import { LoadingSpinner } from '@/components/loadSpinner';
import AntDesign from '@expo/vector-icons/AntDesign';
import { PopUp } from '@/components/LogoutPopup';
import PlayListVideoSettingPopUp from '@/components/PlayListVideoSettingPopUp';
import PlayListSetting from './PlayListSetting';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export default function Playlist() {
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [removeVideoPopUp,setRemoveVideoPopUp] = useState<boolean>(false)
  const [removeVideoId, setRemoveVideoId] = useState<number>()
  const { playListInfo }: any = useLocalSearchParams();
  const parsedPlayList = playListInfo ? JSON.parse(playListInfo) : null;
  const user = useSelector((state: any) => state.auth?.user?.user);

  const dispatch = useDispatch();
  
  const playListVideos = 
  useSelector((state: any) => state.userProfile.playListVideos[`${parsedPlayList?.owner?.id}-${parsedPlayList?.id}`]) ?? [];


  const getPlayListvideos = async () => {
    try {
      if (!parsedPlayList) return;
      const res = await getPlayListVideos(parsedPlayList?.id);
      if (res) {
        dispatch(setPlayListVideos({
          userId:`${parsedPlayList?.owner?.id}-${parsedPlayList?.id}`,
          videos:res
        }));
      }
    } catch (error: any) {
      ToastAndroid.show(
        JSON.stringify(error?.message) || 'Something went wrong',
        ToastAndroid.SHORT
      )
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    dispatch(setPlayListVideos({
      userId:`${parsedPlayList?.owner?.id}-${parsedPlayList?.id}`,
      videos:[]
    }));
    await getPlayListvideos();
    setIsRefreshing(false);
  };

  const handlePopUpForRemoveVideo = (videoId: number) => {
    setRemoveVideoPopUp(true)
    setRemoveVideoId(videoId)
  };

  const handleRemoveVideo = async () => {
    // const accessToken = await SecureStore.getItemAsync("accessToken");
    try {
      await removeVideoToPlayList(parsedPlayList?.id, removeVideoId!, user?.accessToken)
      setRemoveVideoPopUp(false)
      await getPlayListvideos()
    } catch (error) {
      ToastAndroid.show(
        `something went wrong while removing video from playlist: ${error}`,
        ToastAndroid.SHORT
      )
      // alert(`something went wrong while removing video from playlist: ${error}`)
    }
  }

  useEffect(() => {
    getPlayListvideos();
  }, [parsedPlayList?.id,dispatch]);


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
          onPress={() => {
            router.push({
              pathname: '/(profile)/(playlist)/PlayListSetting',
              params: {
                playListInfo: JSON.stringify(parsedPlayList)
              }
            })
          }}
        />}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? LoadingSpinner() :
      <AnimatedFlatList
      data={videos}
      keyExtractor={(item: any,index:number) => item?.id ?? `key-${index}`}
      renderItem={({ item }) => <VideoListingCard 
      video={item} 
      showRemoveOption={true} 
      onRemove={handlePopUpForRemoveVideo} 
      />}
      contentContainerStyle={styles.listContainer}
      ListHeaderComponent={renderHeader}
      refreshing={isRefreshing}
      onRefresh={handleRefresh}
      />
    }
    <PlayListVideoSettingPopUp
    visible={removeVideoPopUp}
    onClose={()=>setRemoveVideoPopUp(false)}
    onRemove={handleRemoveVideo}
    videoId={removeVideoId!}
    />

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
