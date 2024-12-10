import React, { useCallback, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  RefreshControl,
  Keyboard,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import VideoListingCard from '@/components/VideoListingCard';
import axios from 'axios';
import { API_URI } from '@/utils/api';
import { LoadingSpinner } from '@/components/loadSpinner';
import Entypo from '@expo/vector-icons/Entypo';

export default function SearchPage() {
  const [query, setQuery] = useState<string>(''); 
  const [loading, setLoading] = useState<boolean>(false);
  const [videos, setVideos] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch videos
  const fetchVideos = async (reset: boolean = false) => {
    if (reset) setIsRefreshing(true);
    else setLoading(true);
    if(!query) {
      setVideos([])
      setLoading(false)
      return;
    }
    try {
      const response = await axios.get(
        `${API_URI}/api/v1/video?page=${reset ? 1 : page}&query=${query}`,
        { withCredentials: true }
      );
      const newVideos = response?.data?.data || [];
      setVideos((prevVideos) => (reset ? newVideos : [...prevVideos, ...newVideos]));
      setError(null);
    } catch (err) {
      setError(`Failed to fetch videos. Try again later.: ${err}`);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleSearch = () => {
    setLoading(true);
    Keyboard.dismiss();
    setPage(1);
    setVideos([]);
    fetchVideos(true);
  };

  const handleRefresh = () => {
    if(!query) {
      setVideos([])
      setLoading(false)
      return
    }
    setPage(1);
    fetchVideos(true);
  };

  const handleClearQuery = () => {
    setQuery('');
    // setVideos([]); 
    setError(null);
  };

  const renderVideoCard = useCallback(({ item }: any) => <VideoListingCard video={item} />, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Search"
            placeholderTextColor="gray"
            textColor="white"
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
          />
          {/* Clear (Cross) Button */}
          {query.length > 0 && (
            <TouchableOpacity onPress={handleClearQuery} style={styles.clearButton}>
              <Entypo name="cross" size={20} color="gray" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {loading && videos.length === 0 ? (
        LoadingSpinner()
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : videos.length === 0 ? (
        <Text style={styles.noVideosText}>No videos found</Text>
      ) : (
        <FlatList
          data={videos}
          renderItem={renderVideoCard}
          keyExtractor={(item, index) => index.toString()}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
          }
          ListFooterComponent={loading ? LoadingSpinner() : null}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 5,
  },
  inputWrapper: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    backgroundColor: '#212529',
    paddingHorizontal: 15,
    color: 'white',
    fontSize: 16,
    borderRadius: 5,
    marginRight: 10,
    marginTop: 10,
  },
  clearButton: {
    position: 'absolute',
    right: 15,
    top: '60%',
    transform: [{ translateY: -10 }],
  },
  searchButton: {
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  searchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
  noVideosText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});
