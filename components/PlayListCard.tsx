import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router';

export default function PlayListCard({ playList }: any) {
  const router = useRouter()
  const handlePress = (playList: any) => {
    router.push({
      pathname:'/(profile)/(playlist)/playlist',
      params:{
        playListInfo:JSON.stringify(playList)
      }
    })
  };
  return (
    <TouchableOpacity
      onPress={() => handlePress(playList)}
      style={styles.container} activeOpacity={0.98}>
      <View>
      <Image source={{ uri: playList?.thumbnail ?? 'https://media.istockphoto.com/id/1976099664/photo/artificial-intelligence-processor-concept-ai-big-data-array.jpg?s=1024x1024&w=is&k=20&c=dPwo-_Pp_00e1D4iIQz3hEXqsaT409ZiSePfytWYIxI=' }} style={styles.thumbnail} />
      <Text >{playList?.countVideos}</Text>
      </View>
      <View style={styles.details}>
        <Text style={styles.title} numberOfLines={2}>
          {playList?.name ?? "No title"}
        </Text>
      </View>

    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 5,
    paddingLeft: 10,
    marginBottom: 10,
    borderRadius: 8,
    // elevation: 3,
    // shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // height:'100%'
  },
  thumbnail: {
    width: 170,
    height: 100,
    borderRadius: 6,
    resizeMode: 'cover',
  },
  details: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ced4da',
    marginBottom: 4,
  },
  meta: {
    fontSize: 14,
    color: '#adb5bd',
  },
})