import { Dimensions, Image, StyleSheet, Text, View, TouchableOpacity, ScrollView, FlatList, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useSelector } from 'react-redux';
import VideoListingCard from '@/components/VideoListingCard';
import { API_URI } from '@/utils/api';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import VideoCard from '@/components/VideoCard';

const { width } = Dimensions.get('window');

export default function Index() {
  const [userVideos,setUserVideos] = useState(null)
  const [nextUserVideoLoading , setNextUserVideoLoading] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<string>('Home');
  const { user }: any = useLocalSearchParams();
  const localUser = useSelector((state: any) => state.auth.user);
  const parsedUser = user ? JSON.parse(user) : null;

  const fetchUserVideos = async () => {
    setNextUserVideoLoading(true)
    const accessToken = await SecureStore.getItemAsync("accessToken");
    try {
      const response = await axios.get(`${API_URI}/api/v1/videos/c/${parsedUser?._id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        withCredentials: true,
      });
      const newVideos = response?.data?.data || [];
      setUserVideos(newVideos)
    } catch (error) {
      console.log("Error fetching videos:", error);
    } finally {
      setNextUserVideoLoading(false)
    }
  }

  useEffect(() => {
      fetchUserVideos();
  }, [activeTab])

  return (
    <ScrollView style={styles.container}>
      {/* Cover Image */}
      <View>
        <Image
          source={{ uri: parsedUser?.coverImage || 'https://via.placeholder.com/800x200' }}
          style={styles.coverImage}
        />
      </View>

      {/* Profile Section */}
      <View style={styles.profileContainer}>
        <View>
          <Image
            source={{ uri: parsedUser?.avatar || 'https://via.placeholder.com/100' }}
            style={styles.profileImage}
          />
        </View>
        <View style={styles.statsMainConatainer}>
          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <View>
                <Text style={styles.fullname}>{parsedUser?.fullname || 'Anonymous User'}</Text>
                <Text style={styles.userName}>@{parsedUser?.username || 'No username'}</Text>
              </View>
              <Text style={styles.statCount}>{parsedUser?.followers || '0'}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statCount}>{parsedUser?.posts || '0'}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.actionsContainer}>
              {localUser?.id !== parsedUser?.id ? <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>
                  Subscribe
                </Text>
              </TouchableOpacity>
                : null}
            </View>
          </View>
        </View>
      </View>

      {/* Users videos , playlist */}
      <View style={styles.MainProfileContainer}>
        {/* will make a list like home , videos, playlist , about and do flexDirection row */}
        <View style={styles.tabContent}>

          <Text
            onPress={() => setActiveTab('Home')}
            style={activeTab === 'Home' ? styles.activeTabText : styles.tabText}>
            Home
          </Text>

          {/* <Text
            onPress={() => setActiveTab('Videos')}
            style={activeTab === 'Videos' ? styles.activeTabText : styles.tabText}>
            Videos
          </Text> */}

          <Text
            onPress={() => setActiveTab('Playlist')}
            style={activeTab === 'Playlist' ? styles.activeTabText : styles.tabText}>
            Playlist
          </Text>

          <Text
            onPress={() => setActiveTab('About')}
            style={activeTab === 'About' ? styles.activeTabText : styles.tabText}>
            About
          </Text>

        </View>
      </View>

      {/* Video Listing Page  */}
      {activeTab === 'Home' && <View>
        <FlatList 
        data={userVideos}
        keyExtractor={(item:any, index) => item?._id ?? index.toString()}
        renderItem={({ item }) => <VideoCard video={item} />}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          nextUserVideoLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#00ff00" />
            </View>
          ) : null
        }
        />
      </View>}


    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  }, 
  loadingContainer:{
    flex:1,
    justifyContent:"center",
    alignItems:"center",
    backgroundColor:"black"
  },
  coverImage: {
    width: width,
    height: 190,
    resizeMode: 'cover',
  },
  profileContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: -30,
    // marginLeft:10
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'white',
  },
  userName: {
    color: 'white',
    fontSize: 14,
    // fontWeight: 'bold',
    // marginBottom: 1,
    // marginLeft:25,
  },
  fullname: {
    color: 'white',
    fontSize: 19,
    fontWeight: 'bold',
    marginTop: 8,
    // marginLeft:25,
  },
  userBio: {
    color: 'gray',
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
    borderBottomColor: '#333',
  },
  stat: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  statCount: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 20,
    marginLeft: 10
  },
  statLabel: {
    color: 'gray',
    fontSize: 14,
    marginRight: 15,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  actionButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  messageButton: {
    backgroundColor: 'gray',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  statsMainConatainer: {
    flex: 1,
    justifyContent: 'space-evenly',
    width: '100%',
    paddingTop: 10,
    paddingLeft: 7
  },
  MainProfileContainer: {
    // width:'100%',
    // paddingTop:10,
    // paddingLeft:7,
  },
  tabContent: {
    flex: 1,
    flexDirection: 'row',
    // justifyContent:'space-between',
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  tabText: {
    color: '#686D76',
    padding: 10,
    fontSize: 16,
    borderRadius: 10,
    marginRight: 10,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  activeTabText: {
    color: 'white',
    padding: 10,
    fontSize: 16,
    borderRadius: 10,
    marginRight: 10,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  }

});
