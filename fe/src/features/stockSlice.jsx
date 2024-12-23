import { createSlice } from "@reduxjs/toolkit";

// ? slice reducers key'leri action.type'a gore store state'lerini gunceller. Ama buradaki key'ler otomatik olarak sliceName/reducerKeyName seklinde action type da olustur. Bu nedenle case'e gore state guncelledigi icin case-reducer, action type olusturdugu icin action creator olarak iki farkli sekilde anilabilirler.
// ? Redux ve Redux Toolkit, action type çakışmalarını otomatik olarak engelleyen veya yönlendiren bir mekanizma sunmaz. Bu nedenle, action type'ların benzersiz olmasını sağlamak ve çakışmaları önlemek geliştiricinin sorumluluğundadır.
// - dispatch(actionCreator()) -> actionCreator action.type'ina gore(case) reducer calisir.

const stockSlice = createSlice({
  name: "stock",

  initialState: {
    purchases: { result: [] },
    sales: { result: [] },
    firms: { result: [] },
    brands: { result: [] },
    products: { result: [] },
    categories: { result: [] },
    loading: false,
    error: false,
    // test: 0,
  },
  reducers: {
    // Action Creator/Case Reducer
    // console.log(fetchStart.type) -> stock/fetchstart
    // console.log(fetchStart()) -> {type:"fetchStart", payload: undefined}
    fetchStart: (state) => {
      state.loading = true;
      state.error = false;
    },
    // Action Creator/Case Reducer
    // console.log(getSuccess.type) -> stock/getSuccess
    // console.log(getSuccess()) -> {type:"getSuccess", payload: { data, url }}
    getSuccess: (state, { payload: { data, url } }) => {
      state.loading = false;
      state[url] = data;
    },
    // Action Creator/Case Reducer
    // console.log(getProdCatgBrndsSuccess.type) -> stock/getProdCatgBrndsSuccess
    getProdCatgBrndsSuccess: (state, { payload }) => {
      state.loading = false;
      state.products = payload[0];
      state.categories = payload[1];
      state.brands = payload[2];
    },
    // Action Creator/Case Reducer
    // console.log(getPurchSalesSuccess.type) -> stock/getPurchSalesSuccess
    getPurchSalesSuccess: (state, { payload }) => {
      state.loading = false;
      state.purchases = payload[0];
      state.sales = payload[1];
    },
    // Action Creator/Case Reducer
    // console.log(fetchFail.type) -> stock/fetchFail
    // console.log(fetchFail()) -> {type:"fetchFail", payload: errorMessage}
    fetchFail: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
    // Action Creator/Case Reducer
    // console.log(test.type) -> stock/test
    // console.log(test()) -> {type:"test", payload: argumentPassed}
    // test: (state, { payload }) => {
    //   payload++;
    //   return { ...state, updatedPayload: payload };
    // },
  },
});

export const {
  fetchStart,
  getSuccess,
  fetchFail,
  getProdCatgBrndsSuccess,
  getPurchSalesSuccess,
  // test,
} = stockSlice.actions;
export default stockSlice.reducer;
