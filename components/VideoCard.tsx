import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const formatDuration = (duration: number) => {
  const seconds = Math.floor(duration % 60);
  const minutes = Math.floor((duration / 60) % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')} minutes`;
};

function timeAgo(dateString: any) {
  const now: any = new Date();
  const createdAt: any = new Date(dateString);
  const differenceInMilliseconds = now - createdAt;

  const seconds = Math.floor(differenceInMilliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) {
    return `${years} year${years > 1 ? 's' : ''} ago`;
  } else if (months > 0) {
    return `${months} month${months > 1 ? 's' : ''} ago`;
  } else if (weeks > 0) {
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  } else if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else {
    return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
  }
}


const VideoCard = ({ video, onPress }: any) => {
  const formattedDuration = formatDuration(video?.duration);
  const timeDifference = timeAgo(video.createdAt);


  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.98}>
      <View>
        <Image
          source={{ uri: video?.thumbnail }}
          style={styles.thumbnail}
        />      
        <Text style={styles.videoDuration}>{formattedDuration}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Image source={{ uri: video?.owner?.avatar }} style={styles.avatar} />
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
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    alignSelf: 'center',
    elevation: 3,
    paddingTop:10,
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
