import { StyleSheet, Text, View, TouchableOpacity, Animated, Dimensions, Pressable } from 'react-native';
import React, { useEffect, useRef } from 'react';

interface VideoSettingPopUpProps {
  videoId: number;
  visible: boolean;
  onClose: () => void;
  onRemove: (id: number) => void;
}

const SCREEN_HEIGHT = Dimensions.get('window').height;

const PlayListVideoSettingPopUp: React.FC<VideoSettingPopUpProps> = ({
  videoId,
  visible,
  onClose,
  onRemove
}) => {
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 300,
        useNativeDriver: true
      }).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <Animated.View style={[styles.container, { transform: [{ translateY: slideAnim }] }]}>
        <Text style={styles.title}>Video Options</Text>
        <TouchableOpacity style={styles.optionButton} onPress={() => onRemove(videoId)}>
          <Text style={styles.optionText}>Remove Video from Playlist</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton} onPress={onClose}>
          <Text style={[styles.optionText, { color: 'red' }]}>Cancel</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  container: {
    backgroundColor: '#242423',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  title: {
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
  optionButton: {
    paddingVertical: 14,
    borderTopWidth: 1,
    borderColor: '#3a3a3a',
  },
  optionText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#007AFF',
  },
});

export default React.memo(PlayListVideoSettingPopUp);
