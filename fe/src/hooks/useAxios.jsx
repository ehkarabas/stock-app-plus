import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import {
  refreshAccessToken,
  fetchStart,
  fetchFail,
  logoutSuccess,
} from "../features/authSlice";
import { toastSuccessNotify, toastErrorNotify } from "../helper/ToastNotify";
import ErrorCatcher from "../helper/ErrorCatch";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { decodeToken, tokenHasExpired } from "../helper/RefreshCheck";

const useAxios = () => {
  const BASE_URL = process.env.REACT_APP_API_URL;
  const { token, accessToken, refreshToken } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  // axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  // Axios kütüphanesini kullanırken, HTTP isteklerinizin header kısmına otomatik olarakAuthorization` başlığı eklemeye yarar. Bu kod parçası ile yapılan tüm isteklerde, belirtilen token ile yetkilendirme işlemi gerçekleştirilir.

  // token oncelikli authorization header'li axios instance
  // express'te logout controller authorization header'da token flag'i bekliyor token'i silmek icin, bu yuzden bu logic kullaniliyor. login ve register'da backend'te jwt token'lar uretilip response ile gonderildigi icin ve frontend'te de auth slice'ta bu token'lar store/auth'a kaydedildigi icin refresh mekanizmasi yine de sorunsuz calisacaktir.
  const axiosWithToken = axios.create({
    // withCredentials: true,
    baseURL: BASE_URL,
    headers: token
      ? {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        }
      : undefined,
    cancelToken: source.token,
  });

  const axiosWithJWT = axios.create({
    // withCredentials: true,
    baseURL: BASE_URL,
    headers: accessToken
      ? {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        }
      : undefined,
    cancelToken: source.token,
  });

  // // jwt access authorization header'li axios instance
  // const axiosWithToken = axios.create({
  //   baseURL: BASE_URL,
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${token}`,
  //     cancelToken: source.token,
  //   },
  // });

  const logout = async () => {
    dispatch(fetchStart());
    try {
      await axiosWithToken.get("auth/logout/");
      dispatch(logoutSuccess());
      navigate("/");
      toastSuccessNotify("Logged out.");
    } catch (error) {
      console.error(error);
      const err = ErrorCatcher(error);
      dispatch(fetchFail(err));
    }
  };

  if (accessToken) {
    let isRefreshing = false;
    let failedQueue = [];

    const processQueue = (error, accessToken = null) => {
      failedQueue.forEach((prom) => {
        if (error) {
          prom.reject(error);
        } else {
          prom.resolve(accessToken);
        }
      });

      failedQueue = [];
    };

    axiosWithJWT.interceptors.response.use(
      (response) => response,
      (error) => {
        const originalRequest = error.config;

        if (originalRequest.url === "auth/logout/") {
          return originalRequest;
        } else if (
          error.response.status === 403 &&
          !originalRequest._retry &&
          originalRequest.url !== "auth/login/"
        ) {
          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            })
              .then((accessToken) => {
                originalRequest.headers["Authorization"] =
                  "Bearer " + accessToken;
                return axiosWithJWT(originalRequest);
              })
              .catch((err) => {
                console.error(err);
                const error = ErrorCatcher(err);
                toastErrorNotify(error);
                return Promise.reject(err);
              });
          }

          originalRequest._retry = true;
          isRefreshing = true;

          return new Promise((resolve, reject) => {
            dispatch(refreshAccessToken(refreshToken))
              .then((action) => {
                const newToken = action.payload;
                originalRequest.headers["Authorization"] = "Bearer " + newToken;
                processQueue(null, newToken);
                resolve(axiosWithJWT(originalRequest));
              })
              .catch(async (err) => {
                await logout();
                console.error(err);
                const error = ErrorCatcher(err);
                toastErrorNotify(error);
                processQueue(err, null);
                reject(err);
              })
              .finally(() => {
                isRefreshing = false;
              });
          });
        } else {
          console.error(error);
          return Promise.reject(error);
        }
      }
    );
  }

  const axiosPublic = axios.create({
    // withCredentials: true,
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
    cancelToken: source.token,
  });

  axiosPublic.decodeToken = decodeToken;

  useEffect(() => {
    return () => {
      source.cancel("Operation canceled by the user.");
    };
  }, []);

  return { axiosWithToken, axiosWithJWT, axiosPublic };
};

export default useAxios;
