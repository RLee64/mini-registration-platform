import axios from "axios";
const baseUrl = "http://localhost:3001/api";

const getAccounts = () => {
  const request = axios.get(`${baseUrl}/accounts`);
  return request.then((response) => response.data);
};

const getEvents = () => {
  const request = axios.get(`${baseUrl}/events`);
  return request.then((response) => response.data);
};

const postAccount = (newAccount) => {
  const request = axios.post(`${baseUrl}/accounts`, newAccount);
  return request.then((response) => response.data);
};

const postEvent = (newEvent) => {
  const request = axios.post(`${baseUrl}/events`, newEvent);
  return request.then((response) => response.data);
};

const authLogin = (loginDetails) => {
  const request = axios.post(`${baseUrl}/auth`, loginDetails);
  return request.then((response) => response.data);
};

export default { getAccounts, getEvents, postAccount, postEvent, authLogin };
