import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ToastAndroid,
  RefreshControl,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { BodyT, uploadVideo } from '@/service/apiService';
import { useRouter } from 'expo-router';

export default function Upload() {
  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [refreshing, setRefreshing] = useState(false); 
  const [uploadLoading, setuploadLoading] = useState<boolean>(false)
  const router = useRouter()
  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
    });
    if (!result.canceled) {
      setVideo(result?.assets[0]?.uri);
    }
  };

  const pickThumbnail = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    if (!result.canceled) {
      setThumbnail(result?.assets[0]?.uri);
    }
  };

  const upload = async() => {
    setuploadLoading(true)
    if (!video || !title || !thumbnail) {
      alert('Please fill all fields and select video & thumbnail!');
      return;
    }
    const data = new FormData()
    data.append('video', {
      uri: video,
      type: 'video/mp4',
      name: 'video.mp4',
    })
    data.append('thumbnail', {
      uri: thumbnail,
      type: 'image/jpeg',
      name: 'thumbnail.jpg',
    })
    data.append('title', title)
    data.append('description', description)

    try {
      const res = await uploadVideo(data)
      if(res.status === 200) {
        ToastAndroid.show("Video uploaded successfully", ToastAndroid.SHORT)
      }
      router.push('/(home)')
    } catch (error) {
      ToastAndroid.show("Error while uploading video",ToastAndroid.SHORT)
    }finally {
      setuploadLoading(false)
      setDescription('')
      setTitle('')
      setThumbnail(null)
      setVideo(null)
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setVideo(null);
    setThumbnail(null);
    setTitle('');
    setDescription('');
    setuploadLoading(false);
    ToastAndroid.show('Refreshed!', ToastAndroid.SHORT);
    setRefreshing(false);
  };

  return (
    <ScrollView 
    style={styles.container}
    refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    }
    >
      <Text style={styles.heading}>Upload Video</Text>

      <TouchableOpacity style={styles.btn} onPress={pickVideo}>
        <Text style={styles.btnText}>{video ? 'Change Video' : 'Select Video'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={pickThumbnail}>
        <Text style={styles.btnText}>
          {thumbnail ? 'Change Thumbnail' : 'Select Thumbnail'}
        </Text>
      </TouchableOpacity>

      {thumbnail && <Image source={{ uri: thumbnail }} style={styles.thumbnail} />}

      <TextInput
        style={styles.input}
        placeholder="Title"
        placeholderTextColor="#aaa"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Description"
        placeholderTextColor="#aaa"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      {
        uploadLoading 
        ?  <TouchableOpacity style={styles.uploadBtn}>
          <Text style={styles.uploadBtnText}>Uploading...</Text>
        </TouchableOpacity>
        : <TouchableOpacity style={styles.uploadBtn} onPress={upload}>
        <Text style={styles.uploadBtnText}>Upload</Text>
      </TouchableOpacity>
      }
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 15,
  },
  heading: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  btn: {
    backgroundColor: '#444',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginVertical: 8,
  },
  btnText: {
    color: 'white',
    fontSize: 14,
  },
  thumbnail: {
    width: '100%',
    height: 150,
    marginTop: 10,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  input: {
    backgroundColor: '#222',
    color: 'white',
    padding: 12,
    borderRadius: 6,
    marginVertical: 8,
    fontSize: 14,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  uploadBtn: {
    backgroundColor: 'red',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginVertical: 15,
  },
  uploadBtnText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
