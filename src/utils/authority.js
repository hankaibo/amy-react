// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(str) {
  // return localStorage.getItem('myantdpro-authority') || ['admin', 'user'];
  const authorityString =
    typeof str === 'undefined' ? localStorage.getItem('myantdpro-authority') : str;
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
  const myantdproAuthority = typeof authority === 'string' ? authority.split(',') : authority;
  return localStorage.setItem('myantdpro-authority', JSON.stringify(myantdproAuthority));
}
