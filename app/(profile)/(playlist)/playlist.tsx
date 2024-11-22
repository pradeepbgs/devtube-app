import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router';
import { useSelector } from 'react-redux';
import { getUserPlayLists } from '@/service/apiService';

export default function Playlist() {
  const [loading, setLoading] = useState(true);
  const [playList,setPlayList]= useState<string[]>([''])
  const { userDetails }: any = useLocalSearchParams();
  const parsedUser = userDetails ? JSON.parse(userDetails) : null;
  const localUser = useSelector((state: any) => state.auth.user);


  return (
    <View style={styles.container}>
      <Text style={styles.text}>playlist</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:"black",
    alignItems:"center",
    justifyContent:"center"
  },
  text:{
    fontSize:20,
    fontWeight:"bold",
    color:'white'
  }
})