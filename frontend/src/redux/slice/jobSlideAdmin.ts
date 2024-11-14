import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { callFetchJobWithAdmin } from '@/config/api';
import { IJob } from '@/types/backend';

interface IState {
    isFetching: boolean;
    meta: {
        current: number;
        pageSize: number;
        pages: number;
        total: number;
    },
    result: IJob[]
}

// Create a thunk for fetching jobs with admin access
export const fetchAdminJob = createAsyncThunk(
    'job/fetchAdminJob',
    async ({ query }: { query: string }) => {
        const response = await callFetchJobWithAdmin(query);
        return response;
    }
);

const initialState: IState = {
    isFetching: true,
    meta: {
        current: 1,
        pageSize: 10,
        pages: 0,
        total: 0
    },
    result: []
};

export const adminJobSlice = createSlice({
    name: 'adminJob',
    initialState,
    reducers: {
        // Define reducers if needed
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAdminJob.pending, (state) => {
            state.isFetching = true;
        });
        builder.addCase(fetchAdminJob.rejected, (state) => {
            state.isFetching = false;
        });
        builder.addCase(fetchAdminJob.fulfilled, (state, action) => {
            if (action.payload && action.payload.data) {
                state.isFetching = false;
                state.meta = action.payload.data.meta;
                state.result = action.payload.data.result;
            }
        });
    },
});

export default adminJobSlice.reducer;
