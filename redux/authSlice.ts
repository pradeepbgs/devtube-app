import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    isLoggedIn: boolean;
    user: any
  }

  interface LoginPayload {
    isLoggedIn: boolean;
    user: any;
  }

const authSlice = createSlice({
    name: 'auth',
    initialState: <AuthState> {
        isLoggedIn : false,
        user: null,
    },
    reducers: {
        login: (state, action: PayloadAction<LoginPayload>) => {
            state.isLoggedIn = true;
            state.user = action.payload;
        },
        logout: (state) => {
            state.isLoggedIn = false;
            state.user = null;
        },
        updateUser: (state:any, action:any) => {
            if (state.isLoggedIn) {
                state.user = { ...state.user, ...action.payload };
            }
        }
    }
})

export const { login, logout , updateUser} = authSlice.actions;

export default authSlice.reducer;