import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { formatDuration, timeAgo } from '@/utils/timeAgo';
import { useRouter } from 'expo-router';
import Entypo from '@expo/vector-icons/Entypo';

const { width } = Dimensions.get('window');

export default function VideoListingCard({ video, showRemoveOption, onRemove }:
  { video: any, showRemoveOption?: boolean, onRemove?: (videoId: number) => void }) {

  const createdAgo = timeAgo(video?.createdAt ?? video?.created_at);
  const formattedDuration = formatDuration(video?.duration);
  const router = useRouter();

  const handlePress = (video: any) => {
    router.push({
      pathname: '/(video)/watchpage',
      params: { videoDeatails: JSON.stringify(video) },
    });
  };

  const handlePopupRemoveVideo = () => {
    if (onRemove) {
      onRemove(video?.id);
    }
  };

  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.98}>
      {/* Thumbnail on the left */}
      <TouchableOpacity 
      activeOpacity={1}
      onPress={() => handlePress(video)}
      style={styles.thumbnailContainer}>
        <Image source={{ uri: video?.thumbnail }} style={styles.thumbnail} />
        <Text style={styles.videoDuration}>{formattedDuration}</Text>
      </TouchableOpacity>

      {/* Video details on the right */}
      <TouchableOpacity
      activeOpacity={1}
      onPress={() => handlePress(video)}
      style={styles.details}>
        <Text style={styles.title} numberOfLines={2}>{video?.title}</Text>
        <Text style={styles.meta}>{video?.username} • {video?.views} views • {createdAgo}</Text>
      </TouchableOpacity>

      {/* Three-dot icon for options */}
      {showRemoveOption && (
        <TouchableOpacity onPress={handlePopupRemoveVideo} style={styles.removeIcon}>
          <Entypo name="dots-three-vertical" size={20} color="#adb5bd" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width,
    flexDirection: 'row',
    padding: 10,
    // marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  thumbnailContainer: {
    position: 'relative',
  },
  thumbnail: {
    width: 140,
    height: 90,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  videoDuration: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 3,
  },
  details: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#f8f9fa',
    marginBottom: 4,
    lineHeight: 20,
  },
  meta: {
    fontSize: 12,
    color: '#adb5bd',
  },
  removeIcon: {
    alignSelf: 'flex-start',
    marginTop: 5,
    paddingLeft: 10,
  },
});
