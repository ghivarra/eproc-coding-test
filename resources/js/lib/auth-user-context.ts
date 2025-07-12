import { User } from "@/types"
import React from "react"

const AuthUserContext = React.createContext<User | null>(null)

export default AuthUserContext