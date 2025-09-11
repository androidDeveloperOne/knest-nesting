import axios from "axios";
let authToken: string | null = null;
const api=axios.create({
    baseURL:"https://backend.knestfs.com:5000/api/",
    headers:{
        "Content-Type":'application/json'
    },
    timeout:10000
})

api.interceptors.request.use((config) => {
  if (authToken && config.headers) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
})
export const setAuthToken = (token: string | null) => {
  authToken = token;
};







export default api