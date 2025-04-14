import { API_URI, AUTH_API_URI, PLAYLIST_API_URI, SUBSCRIBE_API_URI, USER_API_URI, VIDEO_API_URI } from '@/utils/api';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export let globalAccessToken = SecureStore.getItem('accessToken')


export const getVideoDetails = async (videoId: string) => {
  if (!videoId) return;

  // const accessToken = await SecureStore.getItemAsync("accessToken");

  try {
    const response = await axios.get(`${VIDEO_API_URI}/${videoId}`, {
      headers: { Authorization: `Bearer ${globalAccessToken}` },
      withCredentials: true,
    });

    return response.data.data

  } catch (error) {
    console.error("Error fetching video details:", error);
  }

};

export const getUserProfileData = async (username: string, accessToken:string) => {
  const res = await axios.get(
    `${USER_API_URI}/c/${username}/`,{
      headers: { Authorization: `Bearer ${accessToken}` },
      withCredentials: true,
    }
  );
  if(res) return res?.data
  return []
};

export const fetchUserVideosData = async (userId:string) => {
  try {
    // const accessToken = await SecureStore.getItemAsync("accessToken");
    const response = await axios.get(`${VIDEO_API_URI}/c/${userId}`, {
      headers: {
        Authorization: `Bearer ${globalAccessToken}`,
      },
      withCredentials: true,
    });

    return response?.data?.data ?? [] 
  } catch (error) {
    console.error('Error fetching videos:', error);
    return null;
  }
};


export const getUserPlayLists = async (userId: string) => {
  const response = await axios.get(`${PLAYLIST_API_URI}/user/${userId}/`,
    {withCredentials: true});
  return response?.data?.data || [];
}

export const createUserPlayLists = async (playlistName: string, accessToken:string) => {
  const response = await axios.post(`${PLAYLIST_API_URI}`,
    {
      name:playlistName
    },
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      withCredentials: true
    });
    console.log('logging res of ',response?.data)
  return response?.data || [];
}

export const getPlayListVideos = async (playListId: string) => {
  // in backend needs to make an api that can get the playlist videos
  const response = await axios.get(`${PLAYLIST_API_URI}/${playListId}/`,
    {withCredentials: true, });
    return response?.data?.data ?? []
}

export const logoutUser = async (accessToken:string) => {
  const response = await axios.post(`${AUTH_API_URI}/logout/`, null,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    withCredentials: true,
  });
  return response?.data?.data || [];
}

export const subscribe = async (channelId:string,accessToken:string) => {
  const response = await axios.post(
    `${SUBSCRIBE_API_URI}/toggle/${channelId}/`,
    null,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      withCredentials: true
    }
  );
  return response?.data || [];
}

export const addVideoToPlayList = async (playListId:string,videoId:string,accessToken:string) => {
  const response = await axios.patch(
    `${PLAYLIST_API_URI}/add/${videoId}/${playListId}/`,
    null,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      withCredentials: true
    }
  );
  return response?.data || [];
}

export const removeVideoToPlayList = async (playListId:string,videoId:number,accessToken:string) => {
  const response = await axios.delete(
    `${PLAYLIST_API_URI}/remove-video/${playListId}/${videoId}/`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      withCredentials: true
    }
  );
  return response?.data || [];
}

export interface BodyT {
  title: string;
  description?: string;
  thumbnail: File;
  video: File;
  userId: string;
}

export const uploadVideo = async (formData:BodyT) => {
  // const accessToken = await SecureStore.getItemAsync("accessToken");
  const response = await fetch(`${VIDEO_API_URI}/upload`,{
    method:'POST',
    body:formData,
    headers:{
      'Content-Type':'multipart/form-data',
      'Authorization':`Bearer ${globalAccessToken}`
    },
    credentials:'include',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to upload video');
  }
  return await response.json() ?? [];
}