import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { doanloadDataState } from "./downloadTyes";


import {  downloadFileDirect } from "./downalodApi";
import AsyncStorage from "@react-native-async-storage/async-storage";



const initialState: doanloadDataState = {
    loading: false,
    error: null,
    data: null,

    ////////
};

export const downloadData = createAsyncThunk(
    "download/getdownload",
    async ({ child_name }: { child_name: string }, thunkAPI) => {
        try {

            const saved = await AsyncStorage.getItem("credentials");
            if (!saved) throw new Error("No credentials found");
            const { usr, pwd } = JSON.parse(saved);
      
      const response = await downloadFileDirect(usr, pwd, child_name);

            // console.log("response", response)
            return response;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message); // ✅ Correct usage
        }
    }
);







const downaloadSlice = createSlice({
    name: 'download',
    initialState,
    reducers: {


    },
    extraReducers: (builder) => {
        builder
            .addCase(downloadData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(downloadData.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(downloadData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});







export default downaloadSlice.reducer