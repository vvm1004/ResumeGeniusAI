import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { IHrRegistration } from "@/types/backend";
import { callFetchHrRegister, callFetchHrRegisterById } from "@/config/api";

interface IState {
  isFetching: boolean;
  meta: {
    current: number;
    pageSize: number;
    pages: number;
    total: number;
  };
  result: IHrRegistration[];
  isFetchSingle: boolean;
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
  isFetching: true,
  isFetchSingle: true,
  meta: {
    current: 1,
    pageSize: 10,
    pages: 0,
    total: 0,
  },
  result: [],
  singleHrRegistration: {
    _id: "",
    company: {
      _id: "",
      name: "",
    },
    email: "",
    fullName: "",
    phone: "",
    address: "",
    age: 0,
    gender: "",
    status: "pending",
    createdBy: {
      _id: "",
      email: "",
    },
    updatedBy: {
      _id: "",
      email: "",
    },
    deletedBy: {
      _id: "",
      email: "",
    },
    createdAt: "",
    updatedAt: "",
    isDeleted: false,
    deletedAt: null,
  },
};

export const hrRegistrationSlice = createSlice({
  name: "hrRegistration",
  initialState,
  reducers: {
    resetSingleHr: (state, action) => {
      state.singleHrRegistration = {
        _id: "",
        company: {
          _id: "",
          name: "",
        },
        email: "",
        fullName: "",
        phone: "",
        address: "",
        age: 0,
        gender: "",
        status: "pending",
        createdBy: {
          _id: "",
          email: "",
        },
        updatedBy: {
          _id: "",
          email: "",
        },
        deletedBy: {
          _id: "",
          email: "",
        },
        createdAt: "",
        updatedAt: "",
        isDeleted: false,
        deletedAt: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchHr.pending, (state, action) => {
      state.isFetching = true;
    });
    builder.addCase(fetchHr.fulfilled, (state, action) => {
      if (action.payload?.data) {
        state.isFetching = false;
        state.meta = action.payload.data.meta;
        state.result = action.payload.data.result;
      }
    });
    builder.addCase(fetchHr.rejected, (state) => {
      state.isFetching = false;
    });

    builder.addCase(fetchHrById.pending, (state, action) => {
      state.isFetchSingle = true;
      state.singleHrRegistration = {
        _id: "",
        company: {
          _id: "",
          name: "",
        },
        email: "",
        fullName: "",
        phone: "",
        address: "",
        age: 0,
        gender: "",
        status: "pending",
        createdBy: {
          _id: "",
          email: "",
        },
        updatedBy: {
          _id: "",
          email: "",
        },
        deletedBy: {
          _id: "",
          email: "",
        },
        createdAt: "",
        updatedAt: "",
        isDeleted: false,
        deletedAt: null,
      };
    });
    builder.addCase(fetchHrById.fulfilled, (state, action) => {
      if (action.payload?.data) {
        state.isFetchSingle = false;
        state.singleHrRegistration = {
          _id: "",
          company: {
            _id: "",
            name: "",
          },
          email: "",
          fullName: "",
          phone: "",
          address: "",
          age: 0,
          gender: "",
          status: "pending",
          createdBy: {
            _id: "",
            email: "",
          },
          updatedBy: {
            _id: "",
            email: "",
          },
          deletedBy: {
            _id: "",
            email: "",
          },
          createdAt: "",
          updatedAt: "",
          isDeleted: false,
          deletedAt: null,
        };
      }
    });
    builder.addCase(fetchHrById.rejected, (state) => {
      state.isFetchSingle = false;
      state.singleHrRegistration = {
        _id: "",
        company: {
          _id: "",
          name: "",
        },
        email: "",
        fullName: "",
        phone: "",
        address: "",
        age: 0,
        gender: "",
        status: "pending",
        createdBy: {
          _id: "",
          email: "",
        },
        updatedBy: {
          _id: "",
          email: "",
        },
        deletedBy: {
          _id: "",
          email: "",
        },
        createdAt: "",
        updatedAt: "",
        isDeleted: false,
        deletedAt: null,
      };
    });
  },
});

export const { resetSingleHr } = hrRegistrationSlice.actions;

export default hrRegistrationSlice.reducer;
