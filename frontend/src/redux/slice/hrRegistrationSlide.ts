import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { IHrRegistration } from "@/types/backend";
import { callFetchHrRegister, callFetchHrRegisterById } from "@/config/api";

interface IState {
  isFetching: boolean;
  isFetchSingle: boolean;
  meta: {
    current: number;
    pageSize: number;
    pages: number;
    total: number;
  };
  result: IHrRegistration[];
  singleHrRegistration: IHrRegistration;
}

export const fetchHr = createAsyncThunk(
  "hrRegistration/fetchHrRegistration",
  async ({ query }: { query: string }) => {
    const response = await callFetchHrRegister(query);
    return response;
  }
);

export const fetchHrById = createAsyncThunk(
  "hrRegistration/fetchHrRegistrationById",
  async (id: string) => {
    const response = await callFetchHrRegisterById(id);
    return response;
  }
);

const initialState: IState = {
  isFetching: false,
  isFetchSingle: false,
  meta: {
    current: 1,
    pageSize: 10,
    pages: 0,
    total: 0,
  },
  result: [],
  singleHrRegistration: {
    _id: "",
    userId: "",
    company: "",
    email: "",
    fullName: "",
    phone: "",
    address: "",
    status: "",
  },
};

export const hrRegistrationSlice = createSlice({
  name: "hrRegistration",
  initialState,
  reducers: {
    resetSingleHr: (state) => {
      state.singleHrRegistration = {
        _id: "",
        userId: "",
        company: "",
        email: "",
        fullName: "",
        phone: "",
        address: "",
        status: "",
      };
    },
  },
  extraReducers: (builder) => {
    // fetchHr
    builder
      .addCase(fetchHr.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(fetchHr.fulfilled, (state, action) => {
        if (action.payload?.data) {
          state.isFetching = false;
          state.meta = action.payload.data.meta;
          state.result = action.payload.data.result;
        }
      })
      .addCase(fetchHr.rejected, (state, action) => {
        state.isFetching = false;
      });

    // fetchHrById
    builder
      .addCase(fetchHrById.pending, (state) => {
        state.isFetchSingle = true;
        state.singleHrRegistration = {
          _id: "",
          userId: "",
          company: "",
          email: "",
          fullName: "",
          phone: "",
          address: "",
          status: "",
        };
      })
      .addCase(fetchHrById.fulfilled, (state, action) => {
        if (action.payload?.data) {
          state.isFetchSingle = false;
          state.singleHrRegistration = action.payload.data;
        }
      })
      .addCase(fetchHrById.rejected, (state, action) => {
        state.isFetchSingle = false;
      });
  },
});

export const { resetSingleHr } = hrRegistrationSlice.actions;

export default hrRegistrationSlice.reducer;
