import { createSlice, PayloadAction } from "@reduxjs/toolkit";


const userProfilSlice = createSlice({
    name: 'userProfile',
    initialState: {
        user: null,
        userVideos: [],
        playLists:[],
        playListVideos: [],
        nextUserVideoLoading: false,
        loading: false,
        activeTab: "videos",
        userDetails: null,
    },
    reducers: {
        setUser: (state, action: PayloadAction<any>) => {
            state.user = action.payload;
        },
        setUserVideos: (state, action: PayloadAction<any>) => {
            state.userVideos = action.payload;
        },
        setNextUserVideoLoading: (state, action: PayloadAction<any>) => {
            state.nextUserVideoLoading = action.payload;
        },
        setLoading: (state, action: PayloadAction<any>) => {
            state.loading = action.payload;
        },
        setActiveTab: (state, action: PayloadAction<any>) => {
            state.activeTab = action.payload;
        },
        setUserDetails: (state, action: PayloadAction<any>) => {
            state.userDetails = action.payload;
        },
        setPlayLists: (state, action: PayloadAction<any>) => {
            state.playLists = action.payload;
        },
        setPlayListVideos: (state, action: PayloadAction<any>) => {
            state.playListVideos = action.payload;
        },
    }
})
export const { setUser, setUserVideos, setNextUserVideoLoading, setLoading, setActiveTab, setUserDetails,setPlayLists ,setPlayListVideos} = userProfilSlice.actions;
export default userProfilSlice.reducer;