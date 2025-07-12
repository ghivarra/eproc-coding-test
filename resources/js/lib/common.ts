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

const formatCurrency = (value: number): string => {
    const formatter = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' });
    const amount = formatter.format(value)

    return (amount.includes(',00')) ? amount.slice(0, (amount.length - 3)) : amount
}

const formatDateTime = (time: string | undefined): string  => {

    if (typeof time === 'undefined') {
        return ''
    }

    let utcTime = ''

    if (time.length === 10) {

        utcTime = time + 'T12:00:00+00:00';

    } else {

        // convert to UTC
        // 2025-01-05 23:11:06 become 2025-01-05T23:11:06+00:00
        utcTime = time.includes('T') ? time : time.replace(' ', 'T') + '+00:00';
    }
    
    const dateObj = new Date(utcTime)
    const result = dateObj.toLocaleString('id-ID', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
    })

    return (time.length === 10) ? result.substring(0, 10) : result
}

const formatNumber = (value: number): string => {
    const formatter = new Intl.NumberFormat('id-ID');
    return formatter.format(value)
}

const localDate = (date: string) => {
    const datetime = new Date(date)
    return datetime.toLocaleDateString('id-ID')
}

export { deleteCookie, setCookie, getCookie, checkAccess, fetchApi, logout, processError, formatCurrency, formatDateTime, formatNumber, localDate }