import { API_URI } from '@/utils/api';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

    
    export const getVideoDetails = async (videoId:string) => {
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
