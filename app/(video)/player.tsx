import { LoadingSpinner } from '@/components/loadSpinner';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useState } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function VideoScreen({ url }: { url: string }) {

  const player = useVideoPlayer(url, (player) => {
    player.loop = true; 
    player.play();
  });
  


  return (
    <View style={styles.contentContainer}>
      <VideoView
        style={styles.video}
        player={player}
        allowsFullscreen
        allowsPictureInPicture
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    width:width,
  },
  video: {
    width: width, 
    height: (width - 20) * (9 / 16),
    backgroundColor: 'black',
  },
});
