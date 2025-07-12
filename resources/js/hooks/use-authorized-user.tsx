import AuthUserContext from "@/lib/auth-user-context";
import type { User } from "@/types";
import { useContext } from "react";


export default function useAuthorizedUser(): User | null {
    const context = useContext(AuthUserContext)
    return context
}