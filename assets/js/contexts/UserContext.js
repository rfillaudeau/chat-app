import React, {createContext, useContext, useState} from "react"

const UserContext = createContext({})

function UserContextProvider({children}) {
    const [user, setUser] = useState(document.user)

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
