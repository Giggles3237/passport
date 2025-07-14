import Cookies from 'js-cookie';

export const setCookieIfConsented = (name, value, options) => {
  const consent = Cookies.get('cookie_consent');
  if (consent !== 'false') {
    Cookies.set(name, value, options);
  }
};
