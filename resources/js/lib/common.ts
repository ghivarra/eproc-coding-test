const setCookie = (name: string, value: string, expHours: number) => {
    // set expiring time
    const date = new Date()
    date.setTime(date.getTime() + (expHours*60*60*1000))
    const expires = "expires=" + date.toUTCString()

    // build string
    const cookieStr = `${name}=${value};${expires};domain=${location.hostname};samesite=strict;path=/`

    // set cookie
    document.cookie = cookieStr
}

const getCookie = (name: string): string => {
  const cookieName = name + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');

  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(cookieName) == 0) {
      return c.substring(cookieName.length, c.length);
    }
  }

  return "";
}


export { setCookie, getCookie }