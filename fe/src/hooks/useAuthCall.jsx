import axios from "axios";
import useAxios from "./useAxios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchFail,
  fetchStart,
  loginSuccess,
  logoutSuccess,
  registerSuccess,
} from "../features/authSlice";
import { toastErrorNotify, toastSuccessNotify } from "../helper/ToastNotify";

const useAuthCall = () => {
  const { axiosWithToken } = useAxios();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_API_URL;

  const login = async (userInfo) => {
    // ! Hook'lar ya bir React component'i icinde ya da baska bir custom hook icinde kullanilabilir, pure js function'lari icinde yer alamaz.

    // ! Hook/Custom Hook isimleri de "use" ile baslamak zorundadir.

    // ! Custom hook yazmak 2 sart gerceklestiginde mantikli olur:
    // ! 1-) Bircok component'te kullanilacak bir hook varsa
    // ! 2-) JSX dondurmeden body'de bir hook kullanmak gerekiyorsa

    dispatch(fetchStart());
    try {
      const { data } = await axios.post(`${BASE_URL}auth/login/`, userInfo);
      // console.log(data);
      dispatch(loginSuccess(data));
      toastSuccessNotify("Logged in successfully.");
      navigate("/stock");
    } catch (error) {
      const err = `Error ${error.response.status}: ${error.message}`;
      dispatch(fetchFail(err));
      toastErrorNotify(err);
      console.log(err);
    }
  };

  const logout = async () => {
    dispatch(fetchStart());
    try {
      await axiosWithToken.get(`${BASE_URL}auth/logout/`);
      dispatch(logoutSuccess());
      toastSuccessNotify("Logged out.");
      navigate("/");
    } catch (error) {
      const err = `Error ${error.response.status}: ${error.message}`;
      dispatch(fetchFail(err));
      toastErrorNotify(err);
      console.log(err);
    }
  };

  const register = async (newUser) => {
    dispatch(fetchStart());
    try {
      const { data } = await axios.post(`${BASE_URL}users/`, newUser);
      // console.log(data);
      dispatch(registerSuccess(data));
      toastSuccessNotify("Registration successful!");
      navigate("/stock");
    } catch (error) {
      const err = `Error ${error.response.status}: ${error.message}`;
      dispatch(fetchFail(err));
      toastErrorNotify(err);
      console.log(err);
    }
  };

  return { login, logout, register };
};

export default useAuthCall;
