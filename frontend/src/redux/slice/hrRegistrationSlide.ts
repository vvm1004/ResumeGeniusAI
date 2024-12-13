import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { callFetchHrRegister } from "@/config/api";
import { IUser } from "@/types/backend";

// Define the shape of the state interface
interface HrRegistrationState {
  data: IUser[];
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: HrRegistrationState = {
  data: [],
  isLoading: false,
  error: null,
};

// Async thunk to fetch HR registrations
export const fetchHrRegister = createAsyncThunk(
  "hrRegistration/fetchHrRegister",
  async (_, thunkAPI) => {
    try {
      const response = await callFetchHrRegister();
      return response.data; // Assuming `response.data` contains the array of users
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

// Slice definition
const hrRegistrationSlice = createSlice({
  name: "hrRegistration",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHrRegister.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchHrRegister.fulfilled,
        (state, action: PayloadAction<IUser[]>) => {
          state.isLoading = false;
          state.data = action.payload;
        }
      )
      .addCase(
        fetchHrRegister.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.error = action.payload;
        }
      );
  },
});

// Export the reducer
export default hrRegistrationSlice.reducer;
