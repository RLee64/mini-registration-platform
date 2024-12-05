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

export default { getAccounts, getEvents }