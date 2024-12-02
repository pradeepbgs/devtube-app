import { Animated, FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { useDispatch, useSelector } from 'react-redux';
import { getUserPlayLists } from '@/service/apiService';
import PlayListCard from '@/components/PlayListCard';
import { LoadingSpinner } from '@/components/loadSpinner';
import { setPlayLists } from '@/redux/userProfileSlice';
import AntDesign from '@expo/vector-icons/AntDesign';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList)

export default function ListOfPlayList({header,fectUserDetails}:any) {
  const [loading, setLoading] = useState<boolean>(false);
  // const [playList,setPlayList]= useState<string[]>([])
  const [nextPlayListLoding, setnextPlayListLoding] = useState<boolean>(false)
  const [isPageRefreshing,setIsPageRefreshing] = useState<boolean>(false)
  const { userDetails }: any = useLocalSearchParams();
  const parsedUser = userDetails ? JSON.parse(userDetails) : null;

  const playList = useSelector((state: any) => state.userProfile.playLists);
  const renderPlayListCard = useCallback(({ item }: any) => <PlayListCard playList={item} />, []);
  const dispatch = useDispatch()


  const getUserPlaylist = async () => {
    // if (playList.length > 0) {
    //   return;
    // }
    setLoading(true);
    try {
      const data = await getUserPlayLists(parsedUser?.id);
      console.log('playlllllistttt',data)
      dispatch(setPlayLists(data))
    } catch (error:any) {
      // alert(`Something went wrong while fetching user profile : ${error}`)
      // console.log("Something went wrong while fetching user profile", error)
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsPageRefreshing(true)
    await getUserPlaylist()
    await fectUserDetails()
    setIsPageRefreshing(false)
  };

  useEffect(() => {
    const fetchData = async () => {
      if (parsedUser) await getUserPlaylist();
    };
    fetchData()
  }, []);

  if(playList.length === 0){
    return (
      <>
      {header()}
      <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
      <AntDesign name="frowno" size={30} color="white" />
        <Text style={{color:"#fff",fontSize:16}}>No PlayList Found</Text>
      </View>
      </>
    )
  }

  return (
    <View>
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
    // flex: 1,
    // backgroundColor: '#1e1e1e',
    // padding: 10,
  },
  
})