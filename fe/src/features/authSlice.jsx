import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toastSuccessNotify } from "../helper/ToastNotify";
import ErrorCatcher from "../helper/ErrorCatch";

export const refreshAccessToken = createAsyncThunk(
  "auth/refreshAccessToken",
  async (refreshToken, thunkAPI) => {
    const BASE_URL = process.env.REACT_APP_API_URL;
    const { getState, rejectWithValue } = thunkAPI;
    try {
      const response = await axios.get(`${BASE_URL}auth/refresh_others/`, {
        headers: {
          "X-Refresh-Token": refreshToken,
          "Content-Type": "application/json",
        },
      });

      const { data } = response;
      toastSuccessNotify("Your token has been successfully renewed.");
      return data.bearer.access;
    } catch (error) {
      console.error(error);
      const err = ErrorCatcher(error);
      return rejectWithValue(err.response?.data);
    }
  }
);

const authSlice = createSlice({
  name: "auth",

  initialState: {
    currentUser: null,
    loading: false,
    error: false,
    isActive: false,
    isAdmin: false,
    isStaff: false,
    token: null,
    accessToken: null,
    refreshToken: null,
  },
  reducers: {
    // auth/fetchstart
    fetchStart: (state) => {
      state.loading = true;
      state.error = false;
    },
    // auth/loginSuccess
    loginSuccess: (state, { payload }) => {
      state.loading = false;
      state.currentUser = payload?.user?.username;
      state.isActive = payload?.user?.isActive;
      state.isStaff = payload?.user?.isStaff;
      state.isAdmin = payload?.user?.isAdmin;
      state.token = payload?.token;
      state.accessToken = payload?.bearer?.access;
      state.refreshToken = payload?.bearer?.refresh;
    },
    // auth/logoutSuccess
    logoutSuccess: (state) => {
      state.loading = false;
      state.currentUser = null;
      state.token = null;
      state.accessToken = null;
      state.refreshToken = null;
    },
    // auth/registerSuccess
    registerSuccess: (state, { payload }) => {
      state.loading = false;
      state.currentUser = payload?.username;
      state.token = payload?.token;
      state.accessToken = payload?.bearer?.access;
      state.refreshToken = payload?.bearer?.refresh;
      state.error = false;
    },
    // auth/fetchFail
    fetchFail: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.accessToken = action.payload; // action.payload burada yeni accessToken olacaktır.
        state.loading = false; // İşlem tamamlandığında loading durumunu false yapabiliriz.
      })
      .addCase(refreshAccessToken.pending, (state) => {
        state.loading = true; // İstek başladığında loading'i true yapabiliriz.
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
        state.error = action.payload; // Hata durumunda error bilgisini güncelleyebiliriz.
        state.loading = false; // İşlem tamamlandığında loading durumunu false yapabiliriz.
      });
  },
});

export const {
  fetchStart,
  loginSuccess,
  logoutSuccess,
  registerSuccess,
  fetchFail,
} = authSlice.actions;
export default authSlice.reducer;
