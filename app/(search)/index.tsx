import React, { useCallback, useEffect, useState } from 'react'
import { FlatList, StyleSheet, Text, View, RefreshControl } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import axios from 'axios'
import { API_URI } from '@/utils/api'
import VideoListingCard from '@/components/VideoListingCard'
import { LoadingSpinner } from '@/components/loadSpinner'

export default function VideoListScreen() {
  const [loading, setLoading] = useState<boolean>(false)
  const [videos, setVideos] = useState<string[]>([])
  const [isPageRefreshing, setIsPageRefreshing] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [error, setError] = useState<string | null>(null)

  const { query }: { query: string } = useLocalSearchParams()

  // Video Card Rendering
  const renderVideoCard = useCallback(({ item }: any) => <VideoListingCard video={item} />, [])

  // Fetch Videos
  const fetchVideos = async (reset = false) => {
    if (reset) setIsPageRefreshing(true)
    else setLoading(true)

    try {
      const response = await axios.get(
        `${API_URI}/api/v1/video?page=${reset ? 1 : page}&query=${query}`,
        { withCredentials: true }
      )
      const newVideos = response?.data?.data || []

      setVideos((prevVideos) => (reset ? newVideos : [...prevVideos, ...newVideos]))
      setError(null)
    } catch (err) {
      setError('Something went wrong while fetching videos.')
    } finally {
      setLoading(false)
      setIsPageRefreshing(false)
    }
  }

  // Handle Pull-to-Refresh
  const handleRefresh = () => {
    setPage(1)
    fetchVideos(true)
  }

  // Fetch Videos on Page Change
  useEffect(() => {
    setVideos([])
    fetchVideos()
  }, [page])

  // Handle Empty State
  if (loading) 
    return (LoadingSpinner());
  

  if (!loading && videos.length === 0)
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.noVideosText}>No videos found</Text>
      </View>
    );
  

  return (
    <View style={styles.container}>
      <FlatList
        data={videos}
        renderItem={renderVideoCard}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={() => setPage((prev) => prev + 1)} // Load more when scrolled to bottom
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={isPageRefreshing} onRefresh={handleRefresh} />
        }
        ListFooterComponent={
          loading ? (
            LoadingSpinner()
          ) : null
        }
      />

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  noVideosText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footerSpinner: {
    marginVertical: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
})
