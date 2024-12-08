import axios from "axios";

const baseUrl = "http://localhost:3001/api";

const getConfig = (accessToken) => {
  console.log(accessToken)
  return { headers: {
    'Authorization': `Bearer ${accessToken}`
  }}
}

//Returns all accounts if admin, but only personal account if member
const getAccounts = (accessToken) => {
  const request = axios.get(`${baseUrl}/accounts`, getConfig(accessToken));
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

//ADMIN NEEDED
const postEvent = (newEvent, accessToken) => {
  const request = axios.post(`${baseUrl}/events`, newEvent, getConfig(accessToken));
  return request.then((response) => response.data);
};

const authLogin = (loginDetails) => {
  const request = axios.post(`${baseUrl}/auth`, loginDetails);
  return request.then((response) => response.data);
};

const editName = (newName, accessToken) => {
  const request = axios.put(`${baseUrl}/edit-name`, {newName: newName}, getConfig(accessToken))
  return request.then((response) => response.data)
}

export default { getAccounts, getEvents, postAccount, postEvent, authLogin, editName };
