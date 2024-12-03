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

export const getUserProfileData = async (username: string) => {
  const res = await axios.get(
    `${API_URI}/api/v1/user/c/${username}/`
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

    return response?.data?.data ?? [] // Return data object with videos and owner
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
    `${API_URI}/api/v1/subscriptions/c/${channelId}`,
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