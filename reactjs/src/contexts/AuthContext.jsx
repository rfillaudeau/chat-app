import React, {createContext, useContext, useEffect, useState} from "react"
import axios, {AxiosError, CanceledError} from "axios"
import storage from "../services/storage.js"

const ACCESS_TOKEN_KEY = "access_token"
const ACCESS_TOKEN_EXPIRY_DATE_KEY = "access_token_expiry_date"
const REFRESH_TOKEN_KEY = "refresh_token"
const REFRESH_TOKEN_EXPIRY_DATE_KEY = "refresh_token_expiry_date"
const USER_KEY = "user"

const AuthContext = createContext(null)

export function AuthContextProvider({children}) {
    const [accessToken, setAccessToken] = useState(storage.loadString(ACCESS_TOKEN_KEY))
    const [refreshToken, setRefreshToken] = useState(storage.loadString(REFRESH_TOKEN_KEY))
    const [accessTokenExpiryDate, setAccessTokenExpiryDate] = useState(storage.loadDate(ACCESS_TOKEN_EXPIRY_DATE_KEY))
    const [refreshTokenExpiryDate, setRefreshTokenExpiryDate] = useState(storage.loadDate(REFRESH_TOKEN_EXPIRY_DATE_KEY))
    const [user, setUser] = useState(storage.loadObject(USER_KEY))

    let apiConfig = {
        baseURL: import.meta.env.VITE_API_BASE_URL
    }

    if (accessToken !== null) {
        apiConfig.headers = {
            Authorization: `Bearer ${accessToken}`
        }
    }

    const api = axios.create(apiConfig)

    // Refresh the Access Token when expired
    useEffect(() => {
        if (
            accessTokenExpiryDate === null
            || (refreshTokenExpiryDate !== null && refreshTokenExpiryDate <= new Date())
        ) {
            return
        }

        const callRefreshTime = (accessTokenExpiryDate.getTime() - (new Date()).getTime())
        const timeoutId = setTimeout(() => updateTokens(), callRefreshTime)

        return () => clearTimeout(timeoutId)
    }, [accessTokenExpiryDate])

    // Log the user out when the Refresh Token is expired
    useEffect(() => {
        if (refreshTokenExpiryDate === null) {
            return
        }

        const callClearTime = (refreshTokenExpiryDate.getTime() - (new Date()).getTime())
        if (callClearTime > 24 * 60 * 60 * 1000) {
            return
        }

        const timeoutId = setTimeout(() => clearData(), callClearTime)

        return () => clearTimeout(timeoutId)
    }, [refreshTokenExpiryDate])

    // Update the logged user data
    useEffect(() => {
        if (accessToken === null) {
            return
        }

        let controller = new AbortController()

        api.get("/users/me", {
            signal: controller.signal
        }).then(response => {
            const userObject = response.data

            setUser(userObject)
            storage.saveObject(USER_KEY, userObject)
        }).catch(error => {
            if (error instanceof CanceledError) {
                return
            }

            console.error(error)
        })

        return () => controller.abort()
    }, [accessToken])

    function login(email, password) {
        let formData = new FormData()
        formData.append("grant_type", "password")
        formData.append("client_id", import.meta.env.VITE_API_CLIENT_ID)
        formData.append("client_secret", import.meta.env.VITE_API_CLIENT_SECRET)
        formData.append("username", email)
        formData.append("password", password)

        return api.post("/auth/token", formData).then(response => {
            saveTokenData(response.data)

            return response
        })
    }

    function updateTokens() {
        let formData = new FormData()
        formData.append("grant_type", "refresh_token")
        formData.append("client_id", import.meta.env.VITE_API_CLIENT_ID)
        formData.append("client_secret", import.meta.env.VITE_API_CLIENT_SECRET)
        formData.append("refresh_token", refreshToken)

        api.post("/auth/token", formData).then(response => {
            saveTokenData(response.data)
        }).catch(error => {
            if (error instanceof AxiosError && error.status === 401) {
                clearData()
                return
            }

            console.error(error)
        })
    }

    function saveTokenData(tokenData) {
        let accessTokenExpiry = new Date()
        accessTokenExpiry.setSeconds(accessTokenExpiry.getSeconds() + tokenData.expires_in)

        let refreshTokenExpiry = new Date()
        refreshTokenExpiry.setMonth(refreshTokenExpiry.getMonth() + 1)

        storage.saveString(ACCESS_TOKEN_KEY, tokenData.access_token)
        storage.saveDate(ACCESS_TOKEN_EXPIRY_DATE_KEY, accessTokenExpiry)
        storage.saveString(REFRESH_TOKEN_KEY, tokenData.refresh_token)
        storage.saveDate(REFRESH_TOKEN_EXPIRY_DATE_KEY, refreshTokenExpiry)

        setAccessToken(tokenData.access_token)
        setAccessTokenExpiryDate(accessTokenExpiry)
        setRefreshToken(tokenData.refresh_token)
        setRefreshTokenExpiryDate(refreshTokenExpiry)
    }

    function logout() {
        // TODO: Send a request to revoke the current accessToken and refreshToken

        clearData()
    }

    function clearData() {
        setAccessToken(null)
        setAccessTokenExpiryDate(null)
        setRefreshToken(null)
        setRefreshTokenExpiryDate(null)
        setUser(null)

        storage.clear()
    }

    return (
        <AuthContext.Provider value={{
            currentUser: user,
            isAuthenticated: user != null,
            login,
            logout,
            api
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)

export default AuthContext
