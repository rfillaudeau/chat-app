import React, {createContext, useContext, useEffect, useState} from "react"
import api from "../services/api.js"

const UserContext = createContext({})

function UserContextProvider({children}) {
    const [token, setToken] = useState(null)
    const [user, setUser] = useState(null)

    useEffect(() => {
        const storedToken = localStorage.getItem("token")
        if (storedToken == null) {
            return
        }

        setToken(JSON.parse(storedToken))
    }, [])

    useEffect(() => {
        if (token == null) {
            setUser(null)
            return
        }

        api.get("/users/me", {
            headers: {Authorization: `${token.token_type} ${token.access_token}`}
        }).then(response => {
            console.log(response.data)

            setUser(response.data)
        }).catch(error => {
            console.log("First time")
            if (!(error instanceof AxiosError)) {
                console.error(error)
                return
            }

            if (error.response.status === 401) {
                // Use refresh token
                refreshToken()
            }

            console.error(error)
        })
    }, [token])

    function refreshToken() {
        let formData = new FormData()
        formData.append("grant_type", "refresh_token")
        formData.append("client_id", import.meta.env.VITE_API_CLIENT_ID)
        formData.append("client_secret", import.meta.env.VITE_API_CLIENT_SECRET)
        formData.append("refresh_token", token.refresh_token)

        api.post("/auth/token", formData).then(response => {
            console.log(response.data)

            updateToken(response.data)
        }).catch(response => {
            console.error(response)

            removeToken()
        })
    }

    function updateCurrentUser(newUser) {
        localStorage.setItem("user", JSON.stringify(newUser))

        setUser(prevUser => ({
            ...prevUser,
            newUser
        }))
    }

    function updateToken(newToken) {
        localStorage.setItem("token", JSON.stringify(newToken))

        setToken(newToken)
    }

    function removeToken() {
        localStorage.clear()

        setToken(null)
        setUser(null)
    }

    return (
        <UserContext.Provider value={{
            currentUser: user,
            updateCurrentUser,
            token,
            updateToken,
            removeToken
        }}>
            {children}
        </UserContext.Provider>
    )
}

const useUser = () => useContext(UserContext)

export {UserContextProvider, useUser}

export default UserContext
