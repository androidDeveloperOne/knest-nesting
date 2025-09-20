import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getActivityDataAPI } from "./activityApi";
import { AcivityDataState } from "./acitivityTypes";



const initialState: AcivityDataState = {
    loading: false,
    error: null,
    data: null,

    ////////


};
export const getActivity = createAsyncThunk(
    "activity/getActivity",
    async (_, thunkAPI) => {
        try {
            const response = await getActivityDataAPI();
            
            return response.message;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message); // ✅ Correct usage
        }
    }
);


const activitySlice = createSlice({
    name: "activity",
    initialState,
    reducers: {

clearActivityData(state){
    state.data = null;
    state.error = null;
    state.loading = false;
}
    },
    extraReducers: (builder) => {
        builder
            .addCase(getActivity.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getActivity.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(getActivity.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});


export const {clearActivityData}=activitySlice.actions
export default activitySlice.reducer