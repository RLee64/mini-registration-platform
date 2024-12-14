import axios from "axios";

const baseUrl = "/api";

const getConfig = (accessToken) => {
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
  const request = axios.post(`${baseUrl}/accounts/register`, newAccount);
  return request.then((response) => response.data);
};

//ADMIN NEEDED
const postEvent = (newEvent, accessToken) => {
  const request = axios.post(`${baseUrl}/events`, newEvent, getConfig(accessToken));
  return request.then((response) => response.data);
};

const authLogin = (loginDetails) => {
  const request = axios.post(`${baseUrl}/accounts/auth`, loginDetails);
  return request.then((response) => response.data);
};

const editName = (newName, accessToken) => {
  const request = axios.put(`${baseUrl}/accounts/edit-name`, {name: newName}, getConfig(accessToken))
  return request.then((response) => response.data)
}

const joinEvent = (eventId, accessToken) => {
  const request = axios.put(`${baseUrl}/accounts/join-event`, {eventId: eventId}, getConfig(accessToken))
  return request.then((response) => response.data)
}

export default { getAccounts, getEvents, postAccount, postEvent, authLogin, editName, joinEvent };
