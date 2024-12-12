import React, { useState } from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Alert, Platform } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'

const PlayListSetting = ({ playlist }: { playlist: any }) => {
  const [playlistName, setPlaylistName] = useState(playlist.name);
  const [isEditing, setIsEditing] = useState(false);

  // Handle editing playlist name
  const handleSaveName = () => {
    setIsEditing(false);
    Alert.alert('Playlist Name Updated', `New name: ${playlistName}`);
  };

  // Handle deleting playlist
  const handleDeletePlaylist = () => {
    Alert.alert('Delete Playlist', 'Are you sure you want to delete this playlist?', [
      { text: 'Cancel' },
      { text: 'Delete', onPress: () => console.log('Playlist Deleted') },
    ]);
  };

  // Handle removing video from playlist
  const handleRemoveVideo = (videoId: string) => {
    Alert.alert('Remove Video', 'Are you sure you want to remove this video?', [
      { text: 'Cancel' },
      { text: 'Remove', onPress: () => console.log(`Video ${videoId} removed from playlist`) },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Playlist Name Section */}
      <View style={styles.playlistNameContainer}>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={playlistName}
            onChangeText={setPlaylistName}
            placeholder="Edit Playlist Name"
            placeholderTextColor="#aaa"
          />
        ) : (
          <Text style={styles.playlistName}>{playlistName}</Text>
        )}
        <TouchableOpacity onPress={() => setIsEditing(!isEditing)} style={styles.editButton}>
          <MaterialIcons name={isEditing ? "check" : "edit"} size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Playlist Items List */}
      <FlatList
        data={playlist.videos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.videoItem}>
            <Text style={styles.videoTitle}>{item.title}</Text>
            <TouchableOpacity
              onPress={() => handleRemoveVideo(item.id)}
              style={styles.removeButton}
            >
              <MaterialIcons name="delete" size={20} color="white" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyListText}>No videos in this playlist</Text>}
      />

      {/* Delete Playlist Button */}
      <TouchableOpacity onPress={handleDeletePlaylist} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>Delete Playlist</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PlayListSetting;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#121212',
  },
  playlistNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  playlistName: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  input: {
    color: 'white',
    fontSize: 24,
    borderBottomWidth: 1,
    borderColor: '#aaa',
    paddingBottom: 5,
    flex: 1,
  },
  editButton: {
    marginLeft: 10,
    padding: 8,
    backgroundColor: '#1e90ff',
    borderRadius: 8,
  },
  videoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#333',
  },
  videoTitle: {
    color: 'white',
    fontSize: 16,
    flex: 1,
  },
  removeButton: {
    padding: 8,
    backgroundColor: '#ff4757',
    borderRadius: 8,
  },
  emptyListText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  deleteButton: {
    marginTop: 20,
    backgroundColor: '#ff4757',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // Responsive adjustments for different screen sizes
  '@media (max-width: 400)': {
    container: {
      padding: 15,
    },
    playlistName: {
      fontSize: 20,
    },
    input: {
      fontSize: 20,
    },
    deleteButton: {
      paddingVertical: 12,
    },
    deleteButtonText: {
      fontSize: 16,
    },
  },

  '@media (min-width: 500)': {
    container: {
      padding: 25,
    },
    playlistName: {
      fontSize: 28,
    },
    input: {
      fontSize: 28,
    },
  },
});
