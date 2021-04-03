import Cookie from 'js-cookie';
const axios = require('axios');
export const axiosApiInstance = axios.create();

// Request interceptor for API calls
axiosApiInstance.interceptors.request.use(
  async config => {
    const access_token = Cookie.get("access_token") ? Cookie.get("access_token") : null;
    config.headers = {
      'Authorization': `Bearer ${access_token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
    return config;
  },
  error => {
    Promise.reject(error)
});

// Response interceptor for API calls
axiosApiInstance.interceptors.response.use((response) => {
  return response
}, async function (error) {
  const originalRequest = error.config;
  if (error.response.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;
    //console.log("Refreshing access token");
    const refresh_token = Cookie.get("refresh_token") ? Cookie.get("refresh_token") : null;
    await axios.post(`/api/refresh`, {},
          { headers: { Authorization: `Bearer ${refresh_token}` }}
        ).then(response => {
          Cookie.set("access_token", response.data.access_token, { SameSite: 'lax' });
          axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.access_token;
        }).catch(error => {
          console.log(error);
          axios.defaults.headers.common['Authorization'] = 'Bearer failed';
        })
    return axiosApiInstance(originalRequest);
  }
  return Promise.reject(error);
});
