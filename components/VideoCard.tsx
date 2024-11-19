import { formatDuration, timeAgo } from '@/utils/timeAgo';
import { Link, useRouter } from 'expo-router';
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');




const VideoCard = ({ video, onPress }: any) => {
  const formattedDuration = formatDuration(video?.duration);
  const timeDifference = timeAgo(video.createdAt);

  const router = useRouter();

  const handlePress = (video:any) => {
    router.push({
      pathname: '/(video)/watchpage',
      params: { videoDeatails: JSON.stringify(video) },
    });
  };

  const handleUserPress = (user:any) => {
    router.push({
      pathname: '/(profile)',
      params: { user: JSON.stringify(user) },
    });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={() => handlePress(video)} activeOpacity={0.98}>
      <View>
      {/* <Link
     href={`/(video)/watchpage?videoId=${video._id}`}
      > */}
        <Image
          source={{ uri: video?.thumbnail }}
          style={styles.thumbnail}
          />      
        {/* </Link> */}
        <Text style={styles.videoDuration}>{formattedDuration}</Text>
      </View>
      <View style={styles.infoContainer}>
        <TouchableOpacity onPress={() => handleUserPress(video?.owner)} activeOpacity={0.9}>
        <Image source={{ uri: video?.owner?.avatar }} style={styles.avatar} />
        </TouchableOpacity>
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
            {video?.title || "Custom Tab Navigation in Expo Router | React Native Tutorial | Part 1"}
          </Text>
          <Text style={styles.username}>{video?.owner?.username || "testUser"} • {video?.views} views • {timeDifference}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: width * 0.96,
    // marginBottom: 12,/
    borderRadius: 12,
    overflow: 'hidden',
    alignSelf: 'center',
    elevation: 3,
    // paddingTop:10,
  },
  thumbnail: {
    width: '100%',
    height: width * 0.56,
    resizeMode: 'cover',
    borderRadius: 12,
  },
  infoContainer: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  textContainer: {
    marginLeft: 12,
    flex: 1,
  },
  title: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  username: {
    color: '#A9A9A9',
    fontSize: 15,
  },
  details: {
    color: '#A9A9A9',
    fontSize: 12,
    marginTop: 2,
  },
  videoDuration: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    padding: 5,
    borderRadius: 5,
    fontSize: 12,
    fontWeight: 'bold',
  }
});

export default VideoCard;
