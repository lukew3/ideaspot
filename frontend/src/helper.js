import Cookie from 'js-cookie';
import axios from 'axios';

//How do I handle having no token and no refresh token

export function getToken() {
  //returns a promise with token as return
  const expirationTime = Cookie.get("expirationTime") ? Cookie.get("expirationTime") : null;
  const currentTime = new Date().getTime();
  //if token expires in the next 10 minutes or has already expired
  if ((currentTime + 600000) > expirationTime) {
    //Get a new token
    const refresh_token = Cookie.get("refresh_token") ? Cookie.get("refresh_token") : null;
    let new_access_token = "";
    return(
      axios.post(`/api/refresh`, {},
        { headers: { Authorization: `Bearer ${refresh_token}` }}
      ).then(response => {
        //set newExpirationTime to current time + 1 hour
        const newExpirationTime = (new Date().getTime()) + 3600000;
        Cookie.set("access_token", response.data.access_token, { SameSite: 'lax' });
        Cookie.set("expirationTime", newExpirationTime, { SameSite: 'lax' });
        new_access_token = response.data.access_token;
        return new_access_token;
      }).catch(error => {
        console.log(error);
        new_access_token = "refresh failed";
        return new_access_token;
      })
    );
  } else {
    // Get current token, return as a promise for consistency
    const token_promise = new Promise((resolve, reject) => {
      const access_token = Cookie.get("access_token") ? Cookie.get("access_token") : null;
      resolve(access_token);
    });
    return(
      token_promise.then((access_token) => {
        return access_token;
      })
    )
  }
}
