import React, {createContext, useContext, useEffect, useState} from "react"
import axios from "axios"

const UserContext = createContext({})

function UserContextProvider({children}) {
    const [user, setUser] = useState(document.user)

    useEffect(() => {
        axios.get("/api/users/me", {
            baseURL: "http://localhost:8080"
        }).then(response => {
            console.log(response.data)

            setUser(response.data)
        }).catch(error => {
            console.error(error)
        })
    }, [])

    function updateCurrentUser(newUser) {
        setUser(prevUser => ({
            ...prevUser,
            newUser
        }))
    }

    return (
        <UserContext.Provider value={{
            currentUser: user,
            updateCurrentUser
        }}>
            {children}
        </UserContext.Provider>
    )
}

const useUser = () => useContext(UserContext)

export {UserContextProvider, useUser}

export default UserContext
