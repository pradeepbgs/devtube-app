import { configureStore } from "@reduxjs/toolkit";
import authSlice from './authSlice'
import userProfileSlice from './userProfileSlice'
import scrollSlice from './scrollSlice'
const store = configureStore({
  reducer: {
    auth: authSlice,
    userProfile: userProfileSlice,
    scroll: scrollSlice,
 },
});

export default store