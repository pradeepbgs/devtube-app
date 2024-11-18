import React, { useState, useEffect } from "react";
import { StyleSheet, View, FlatList, Text, TouchableOpacity, ScrollView } from "react-native";
import VideoCard from "@/components/VideoCard";
import axios from "axios";

const suggestionArray = ["All","JavaScript","Programming","Algorithms","Gaming","Videos","Web Development","System Programming"]

export default function Index() {
  const [videos, setVideos] = useState([]);
  const [page,setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const fetchVideos = async () => {

    try {
      let query = selectedCategory ? selectedCategory : "";
      const response = await axios.get(`http://192.168.0.105:3000/api/v1/videos?page=${page}&query=${query}`, {
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
    fetchVideos();
  }, [selectedCategory,page]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Loading videos...</Text>
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
        data={videos}
        keyExtractor={(item:any, index) => item?._id ?? index.toString()}
        renderItem={({ item }) => <VideoCard video={item} />}
        showsVerticalScrollIndicator={false}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    // alignItems: "center",
    // justifyContent: "center",
    paddingTop:15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderBottomWidth: 1,
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
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  categoryText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
