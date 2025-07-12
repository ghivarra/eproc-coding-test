import { fetchApi, logout } from "@/lib/common"
import { APIResponse, User } from "@/types"
import { AxiosResponse } from "axios"
import { ReactNode, useCallback, useEffect, useState } from "react"
import AuthorizedUserContext from "@/lib/auth-user-context"
import { router } from "@inertiajs/react"

interface ProviderLayoutProps {
    children: ReactNode,
    updateUser: React.Dispatch<React.SetStateAction<User | null>>
}

export default function ProviderLayout({ children, updateUser }: ProviderLayoutProps) {
    const [ user, setUser ] = useState<User|null>(null)

    const fetchUserData = useCallback(async () => {

        const axios = fetchApi()

        try {
            const response: AxiosResponse = await axios.get(route('api.user'))
            const res = response.data as APIResponse
            if (res.status === 'success') {
                const data = res.data as User
                setUser(data)
                updateUser(data)
            } else {
                logout()
                router.visit(route('view.login'))
            }
        } catch (err) {
            console.log(err)
            logout()
            router.visit(route('view.login'))
        }
        
    }, [updateUser]) // empty dependency

    useEffect(() => {
        fetchUserData()
    }, [fetchUserData])

    return (
        <AuthorizedUserContext.Provider value={user}>
            {children}
        </AuthorizedUserContext.Provider>
    )
}