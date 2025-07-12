import { router } from "@inertiajs/react"
import axios from "axios"
import { toast } from "sonner"

const deleteCookie = (name: string) => {
    setCookie(name, '', 0)
}

const setCookie = (name: string, value: string, expHours: number) => {
    // set expiring time
    const date = new Date()
    const addedTime = (expHours === 0) ? -1 : (expHours*60*60*1000)
    date.setTime(date.getTime() + addedTime)
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

const fetchApi = () => {
    const token = getCookie('access_token')
    return axios.create({
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

const checkAccess = () => {
    const token = getCookie('access_token')

    return axios.get(route('api.user'), {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

const logout = () => {
    deleteCookie('access_token')
    router.visit(route('home'))
}

const processError = (errorList: object, message: string) => {
    const errors: string[] = []
    Object.values(errorList).forEach((value: string[]) => {
        value.forEach((item) => {
            errors.push(item)
        })
    })
    toast.error(message + '. ' + errors.join(' '))
}

export { deleteCookie, setCookie, getCookie, checkAccess, fetchApi, logout, processError }