// src/features/company/companySlice.ts

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  CompanyDataState,
  RequestBody,
  ProfileRequestBody,
} from "./nestingTypes";
import { getCompanyDataAPI, getProfileFilesAPI } from "./nestingApi";

const initialState: CompanyDataState = {
  loading: false,
  error: null,
  data: null,

  ////////

  profileLoading: false,
  profileError: null,
  profileData: null,
};

// Async thunk
export const getCompanyData = createAsyncThunk(
  "company/getCompanyData",
  async (body: RequestBody, { rejectWithValue }) => {
    try {
      const response = await getCompanyDataAPI(body);


      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const getProfileData = createAsyncThunk(
  "profile/getProfileData",
  async (body: ProfileRequestBody, { rejectWithValue }) => {
    console.log("body", body);
    try {
      const response = await getProfileFilesAPI(body);

      console.log("repsosseprofile", response);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
// Slice
const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    clearCompanyData(state) {
      state.data = null;
      state.error = null;
      state.loading = false;
    },

    clearProfileData(state) {
      state.profileData = null;
      state.profileError = null;
      state.profileLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCompanyData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCompanyData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getCompanyData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //////////////////////////////

      .addCase(getProfileData.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(getProfileData.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.profileData = action.payload;
      })
      .addCase(getProfileData.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload as string;
      });
  },
});

export const { clearCompanyData ,clearProfileData} = companySlice.actions;
export default companySlice.reducer;
