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
    `${API_URI}/api/v1/users/c/${username}`
  );
  if(res) return res?.data?.data
  return []
};

export const fetchUserVideosData = async (userId: string) => {
  const accessToken = await SecureStore.getItemAsync("accessToken");
  const response = await axios.get(
    `${API_URI}/api/v1/videos/c/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    }
  );
  return response?.data?.data || [];
}

export const getUserPlayLists = async (userId: string) => {
  const accessToken = await SecureStore.getItemAsync("accessToken");
  const response = await axios.get(`${API_URI}/api/v1/playlists/user/${userId}`,
    {withCredentials: true});
  return response?.data?.data || [];
}

export const getPlayListVideos = async (playListId: string) => {

  const response = await axios.get(`${API_URI}/api/v1/playlists/${playListId}`,
    {withCredentials: true, });
    return response?.data?.data ?? []
}

export const logoutUser = async (accessToken:string) => {
  const response = await axios.post(`${API_URI}/api/v1/users/logout`, null,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    withCredentials: true,
  });
  return response?.data?.data || [];
}

export const subscribe = async (channelId:string,accessToken:string) => {
  const response = await axios.post(
    `${API_URI}/api/v1/subscriptions/c/${channelId}`,
    null,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      withCredentials: true
    }
  );
}