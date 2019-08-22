// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(str) {
  // return localStorage.getItem('fe-authority') || ['admin', 'user'];
  const authorityString = typeof str === 'undefined' ? localStorage.getItem('fe-authority') : str;
  // authorityString could be admin, "admin", ["admin"]
  let authority;
  try {
    authority = JSON.parse(authorityString);
  } catch (e) {
    authority = authorityString;
  }
  if (typeof authority === 'string') {
    return [authority];
  }
  return authority;
}

export function setAuthority(authority) {
  const feAuthority = typeof authority === 'string' ? authority.split(',') : authority;
  return localStorage.setItem('fe-authority', JSON.stringify(feAuthority));
}
