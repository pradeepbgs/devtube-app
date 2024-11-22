import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { formatDuration, timeAgo } from '@/utils/timeAgo';
import { useRouter } from 'expo-router';

export default function VideoListingCard({ video}: { video: any }) {
  const createdAgo = timeAgo(video?.createdAt)
  const formattedDuration = formatDuration(video?.duration);
  const router = useRouter()

  const handlePress = (video:any) => {
    router.push({
      pathname: '/(video)/watchpage',
      params: { videoDeatails: JSON.stringify(video) },
    })
  };
  
  return (
    <TouchableOpacity 
    onPress={() => handlePress(video)}
    style={styles.container} activeOpacity={0.98}>
      {/* Thumbnail on the left */}
      <View>
      <Image source={{ uri: video?.thumbnail }} style={styles.thumbnail} />
      <Text style={styles.videoDuration}>{formattedDuration}</Text>
      </View>

      {/* Video details on the right */}
      <View style={styles.details}>
        <Text style={styles.title} numberOfLines={2}>
          {video?.title}
        </Text>
        <Text style={styles.meta}>
          {video?.username} • {video?.views} views • {createdAgo}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 4,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 3, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  thumbnail: {
    width: 145,
    height: 85,
    borderRadius: 6,
    resizeMode: 'cover',
  },
  videoDuration: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    padding: 4,
    borderRadius: 5,
    fontSize: 9,
    fontWeight: 'bold',
  },
  details: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
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
});
