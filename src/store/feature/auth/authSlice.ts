// src/features/auth/authSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { loginAPI } from "./authApi";
import { LoginRequest } from "./authTypes";

import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthState {
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  credentials: { usr: string; pwd: string } | null;
  isRestoring: boolean;
}

const initialState: AuthState = {
  loading: false,
  error: null,
  isAuthenticated: false,
  credentials: null,
  isRestoring: true,
};

export const login = createAsyncThunk(
  "auth/login",
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await loginAPI(credentials);
      await AsyncStorage.setItem("credentials", JSON.stringify(credentials));
      // console.log("response",response)
      return response; // response can be any type
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const restoreLogin = createAsyncThunk(
  "auth/restoreLogin",
  async (_, { rejectWithValue }) => {
    try {
      const saved = await AsyncStorage.getItem("credentials");
      if (saved) {
        const parsed = JSON.parse(saved);
        const response = await loginAPI(parsed); // validate with backend if needed
        return parsed;
      }
      return rejectWithValue("No credentials found");
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.isAuthenticated = false;
      state.error = null;
      AsyncStorage.removeItem("credentials");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.credentials = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      //////////////restore

      .addCase(restoreLogin.pending, (state) => {
        state.isRestoring = true;
      })
      .addCase(restoreLogin.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.credentials = action.payload;
        state.isRestoring = false;
      })
      .addCase(restoreLogin.rejected, (state) => {
        state.isAuthenticated = false;
        state.credentials = null;
        state.isRestoring = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
