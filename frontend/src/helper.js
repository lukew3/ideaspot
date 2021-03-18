import Cookie from 'js-cookie';


export function getToken() {
  const access_token = Cookie.get("access_token") ? Cookie.get("access_token") : null;
  return access_token;
}
