import axios from "axios";
import { useDispatch } from "react-redux";
import { setAlert } from "../redux/configSlice";
import { ALERT_TYPE, ERROR_MSG } from "./Constants";
import { getLocalStorage } from "./Common";

const BASE_URL = process.env.REACT_APP_DEV_URL;

export const getApi = (url, isAuthToken = false) => {
  return axios({
    method: "get",
    url: BASE_URL + url,
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: isAuthToken ? "Bearer " + getLocalStorage("token") : "",
    },
  })
    .then(function (response) {
      return response;
    })
    .catch(function (error) {
      const errorRes = {
        data: {
          status: "error",
          code: error.code,
          // message: error.response.data.data,
          message: error.response.data.message,
        },
      };
      return errorRes;
    });
};

export const postApi = (
  url,
  payload,
  isAuthToken = false,
  contentType = "application/json; charset=utf-8"
) => {
  return axios({
    method: "post",
    url: BASE_URL + url,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": contentType,
      Authorization: isAuthToken ? "Bearer " + getLocalStorage("token") : "",
    },
    data: payload,
  })
    .then(function (response) {
      return response;
    })
    .catch(function (error) {
      const errorRes = {
        data: {
          status: "error",
          code: error.code,
          message: error.response.data.errors,
        },
      };
      return errorRes;
    });
};
