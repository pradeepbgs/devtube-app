import { Animated, FlatList, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { useDispatch, useSelector } from 'react-redux';
import { getUserPlayLists } from '@/service/apiService';
import PlayListCard from '@/components/PlayListCard';
import { LoadingSpinner } from '@/components/loadSpinner';
import { setPlayLists } from '@/redux/userProfileSlice';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Colors } from '@/constant/colors';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList)

export default function ListOfPlayList({ header, fectUserDetails }: any) {
  const [loading, setLoading] = useState<boolean>(false);
  // const [playList,setPlayList]= useState<string[]>([])
  const [nextPlayListLoding, setnextPlayListLoding] = useState<boolean>(false)
  const [isPageRefreshing, setIsPageRefreshing] = useState<boolean>(false)
  const { userDetails }: any = useLocalSearchParams();
  const parsedUser = userDetails ? JSON.parse(userDetails) : null;

  const playList = useSelector((state: any) => state.userProfile?.playLists[parsedUser?.id]) ?? [];
  const renderPlayListCard = useCallback(({ item }: any) => <PlayListCard playList={item} />, []);
  const dispatch = useDispatch()


  const getUserPlaylist = async () => {
    // if (playList.length > 0) {
    //   return;
    // }
    setLoading(true);
    try {
      const data = await getUserPlayLists(parsedUser?._id);
      dispatch(setPlayLists({
        userId: parsedUser.id,
        playlists: data
      }))
    } catch (error: any) {
      ToastAndroid.show(`something went wrong while fetching user profile: ${error?.message}`, ToastAndroid.SHORT)

      // console.log("Something went wrong while fetching user profile", error)
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsPageRefreshing(true)
    dispatch(setPlayLists({
      userId: parsedUser._id,
      playLists: []
    }));
    await getUserPlaylist()
    await fectUserDetails()
    setIsPageRefreshing(false)
  };

  useEffect(() => {
    const fetchData = async () => {
      if (parsedUser) await getUserPlaylist();
    };
    fetchData()
  }, [parsedUser?._id, dispatch]);

  if (playList?.length === 0) {
    return (
      <>
        {header()}
        <View style={{ 
          flex: 0, 
          backgroundColor:Colors.charCoalBlack,
          justifyContent: "center", 
          alignItems: "center", 
           }}>
          <AntDesign name="frowno" size={30} color="white" />
          <Text style={{ color: "#fff", fontSize: 16 }}>No PlayList Found</Text>
        </View>
      </>
    )
  }

  return (
    <View style={styles.container}>
      <AnimatedFlatList
        style={styles.container}
        data={playList}
        keyExtractor={(item: any, index) => item?._id ?? index.toString()}
        renderItem={renderPlayListCard}
        refreshing={isPageRefreshing}
        onRefresh={handleRefresh}
        ListHeaderComponent={header}
        ListFooterComponent={
          nextPlayListLoding ? (
            LoadingSpinner()
          ) : null
        }
      />

    </View>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:Colors.charCoalBlack,
  },

})