import React, { useState, useEffect } from "react";
import { StyleSheet, View, FlatList, Text, TouchableOpacity, ScrollView , ActivityIndicator} from "react-native";
import VideoCard from "@/components/VideoCard";
import axios from "axios";
import { API_URI } from "@/utils/api";
const suggestionArray = ["All","JavaScript","Programming","Algorithms","Gaming","Videos","Web Development","System Programming"]

export default function Index() {
  const [videos, setVideos] = useState<string[]>([]);
  const [page,setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [nextVideoLoading, setNextVideoLoading] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string|null>(null);

  const fetchHomeVideos = async () => {
    const isPagination = page > 1;
    if (isPagination) setNextVideoLoading(true);
    else setLoading(true);

    try {
      let query = selectedCategory ?? "";
      const response = await axios.get(`${API_URI}/api/v1/videos?page=${page}&query=${query}`, {
        withCredentials: true,
      });
      const newVideos = response?.data?.data || [];
      if (page === 1) {
        setVideos(newVideos);
      } else {
        setVideos((prevVideos):any => [...prevVideos, ...newVideos]);
      }
    } catch (error) {
      console.log("Error fetching videos:", error);
    } finally {
      setLoading(false);
      setNextVideoLoading(false);
    }
  };

  const handleCategorySelect = (category:any) => {
    setSelectedCategory(category === "All" ? null : category);
    setPage(1);
  };

  const handleEndReached = () => {
    if (!loading) {
      setPage(prevPage => prevPage + 1); 
    }
  };

  useEffect(() => {
    fetchHomeVideos();
  }, [selectedCategory,page,]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator 
        size="small" color="#00ff00" />
        {/* <Text style={styles.text}>Loading videos...</Text> */}
      </View>
    );
  }

  if (videos.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {
            suggestionArray.map((category:any) => (
              <TouchableOpacity 
              style={styles.categoryButton}  
              onPress={() => handleCategorySelect(category)}
              key={category}
              >
              <Text style={styles.categoryText}>
                {category}
              </Text>
              </TouchableOpacity>
            ))
          }
          </ScrollView>
      </View>
        <Text style={styles.text}>No Videos Available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {
            suggestionArray.map((category:any, index:any) => (
              <TouchableOpacity 
              style={styles.categoryButton}  
              onPress={() => handleCategorySelect(category)}
              key={category}
              >
              <Text key={index} style={styles.categoryText}>
                {category}
              </Text>
              </TouchableOpacity>
            ))
          }
          </ScrollView>
      </View>
      <FlatList
      style={styles.videocard}
        data={videos}
        keyExtractor={(item:any, index) => item?._id ?? index.toString()}
        renderItem={({ item }) => <VideoCard video={item} />}
        showsVerticalScrollIndicator={false}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          nextVideoLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#00ff00" />
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    paddingTop:1,
  },
  loadingContainer:{
    flex:1,
    justifyContent:"center",
    alignItems:"center",
    backgroundColor:"black"
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 5,
    borderBottomWidth: 0.9,
    borderBottomColor: "#555",
  },
  suggestion:{
    flex:1,
    flexDirection:'column',
  },
  text: {
    color: "white",
    fontSize: 18,
  },
  categoryButton: {
    paddingHorizontal:10,
    paddingVertical: 5,
  },
  categoryText: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
    backgroundColor: '#555',
    borderRadius: 20,
    paddingHorizontal: 5,
    paddingVertical: 5,
    // marginRight: 10,
  },
  videocard:{
    marginTop:5
  }
  
});

