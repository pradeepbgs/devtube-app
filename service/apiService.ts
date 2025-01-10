import { API_URI } from '@/utils/api';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';


export const getVideoDetails = async (videoId: string) => {
  if (!videoId) return;

  const accessToken = await SecureStore.getItemAsync("accessToken");

  try {
    const response = await axios.get(`${API_URI}/api/v1/videos/${videoId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      withCredentials: true,
    });

    return response.data.data

  } catch (error) {
    console.error("Error fetching video details:", error);
  }

};

export const getUserProfileData = async (username: string, accessToken:string) => {
  const res = await axios.get(
    `${API_URI}/api/v1/user/c/${username}/`,{
      headers: { Authorization: `Bearer ${accessToken}` },
      withCredentials: true,
    }
  );
  if(res) return res?.data
  return []
};

export const fetchUserVideosData = async (userId:number) => {
  try {
    const accessToken = await SecureStore.getItemAsync("accessToken");
    const response = await axios.get(`${API_URI}/api/v1/video/c/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });

    return response?.data?.data ?? [] 
  } catch (error) {
    console.error('Error fetching videos:', error);
    return null;
  }
};


export const getUserPlayLists = async (userId: number) => {
  const response = await axios.get(`${API_URI}/api/v1/playlist/user/${userId}/`,
    {withCredentials: true});
  return response?.data?.data || [];
}

export const createUserPlayLists = async (playlistName: string, accessToken:string) => {
  const response = await axios.post(`${API_URI}/api/v1/playlist/create/`,
    {
      playlistName:playlistName
    },
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      withCredentials: true
    });
  return response?.data || [];
}

export const getPlayListVideos = async (playListId: string) => {
  const response = await axios.get(`${API_URI}/api/v1/playlist/${playListId}/`,
    {withCredentials: true, });
    return response?.data?.data ?? []
}

export const logoutUser = async (accessToken:string) => {
  const response = await axios.post(`${API_URI}/api/v1/user/logout/`, null,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    withCredentials: true,
  });
  return response?.data?.data || [];
}

export const subscribe = async (channelId:number,accessToken:string) => {
  const response = await axios.post(
    `${API_URI}/api/v1/subscription/toggle/${channelId}/`,
    null,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      withCredentials: true
    }
  );
  return response?.data || [];
}

export const addVideoToPlayList = async (playListId:number,videoId:number,accessToken:string) => {
  const response = await axios.post(
    `${API_URI}/api/v1/playlist/add-video/${playListId}/${videoId}/`,
    null,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      withCredentials: true
    }
  );
  return response?.data || [];
}

export const removeVideoToPlayList = async (playListId:number,videoId:number,accessToken:string) => {
  const response = await axios.delete(
    `${API_URI}/api/v1/playlist/remove-video/${playListId}/${videoId}/`,
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
  userId: number;
}

export const uploadVideo = async (formData:BodyT) => {
  const accessToken = await SecureStore.getItemAsync("accessToken");
  const response = await fetch(`${API_URI}/api/v1/video/upload/`,{
    method:'POST',
    body:formData,
    headers:{
      'Content-Type':'multipart/form-data',
      'Authorization':`Bearer ${accessToken}`
    },
    credentials:'include',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to upload video');
  }
  return await response.json() ?? [];
}