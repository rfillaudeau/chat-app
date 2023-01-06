import React, {createContext, useContext, useEffect, useState} from "react"

const UserContext = createContext({})

function UserContextProvider({children}) {
    const [token, setToken] = useState(null)
    const [user, setUser] = useState(null)

    useEffect(() => {
        // axios.get("/api/users/me", {
        //     baseURL: "http://localhost:8080"
        // }).then(response => {
        //     console.log(response.data)
        //
        //     setUser(response.data)
        // }).catch(error => {
        //     console.error(error)
        // })
    }, [])

    function updateCurrentUser(newUser) {
        setUser(prevUser => ({
            ...prevUser,
            newUser
        }))
    }

    function updateToken(newToken) {
        // TODO: store the token

        setToken(newToken)
    }

    return (
        <UserContext.Provider value={{
            currentUser: user,
            updateCurrentUser,
            updateToken
        }}>
            {children}
        </UserContext.Provider>
    )
}

const useUser = () => useContext(UserContext)

export {UserContextProvider, useUser}

export default UserContext
