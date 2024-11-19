import { useVideoPlayer, VideoView } from 'expo-video';
import { StyleSheet, View, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function VideoScreen({ url }: { url: string }) {
  // Create a video player instance with the passed URL
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  video: {
    width: width, // Adjust to fit most screens with padding
    height: (width - 20) * 0.5625, // Maintain 16:9 aspect ratio
    borderRadius: 10,
    backgroundColor: 'black',
  },
});
