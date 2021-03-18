import Cookie from 'js-cookie';
import axios from 'axios';

//How do I handle having no token and no refresh token

export function getToken() {
  const expirationTime = Cookie.get("expirationTime") ? Cookie.get("expirationTime") : null;
  const currentTime = new Date().getTime();
  //if token expires in the next 10 minutes or has already expired
  if ((currentTime + 600000) > expirationTime) {
    return refreshToken();
  } else {
    const access_token = Cookie.get("access_token") ? Cookie.get("access_token") : null;
    return access_token;
  }
}

function refreshToken() {
  //Refreshes and returns access_token
  const refresh_token = Cookie.get("refresh_token") ? Cookie.get("refresh_token") : null;
  axios.get(`/api/refresh`,
    { headers: { Authorization: `Bearer ${refresh_token}` }}
  ).then(response => {
    //set newExpirationTime to current time + 1 hour
    const newExpirationTime = (new Date().getTime()) + 3600000;
    Cookie.set("access_token", response.data.access_token, { SameSite: 'lax' });
    Cookie.set("expirationTime", newExpirationTime, { SameSite: 'lax' });
    return response.data.access_token;
  }).catch(error => {
    console.log(error);
    return "Login required, refresh token may be expired";
  });
}
