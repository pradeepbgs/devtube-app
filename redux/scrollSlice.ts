// redux/scrollSlice.ts
import { createSlice } from '@reduxjs/toolkit';

interface ScrollState {
  scrollY: number;
}

const initialState: ScrollState = {
  scrollY: 0,
};

const scrollSlice = createSlice({
  name: 'scroll',
  initialState,
  reducers: {
    setScrollY: (state, action) => {
      state.scrollY = action.payload;
    },
  },
});

export const { setScrollY } = scrollSlice.actions;
export default scrollSlice.reducer;
