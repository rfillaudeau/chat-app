import React, {useEffect, useState} from "react"
import {useAuth} from "../../../contexts/AuthContext.jsx"

function SelectUsersInput({onChange}) {
    const {api} = useAuth()
    const [users, setUsers] = useState([])
    const [selectedUsers, setSelectedUsers] = useState([])

    useEffect(() => {
        if (onChange instanceof Function) {
            onChange(selectedUsers)
        }
    }, [selectedUsers])

    function searchUsers(event) {
        api.get("/users", {
            params: {
                usernameOrEmail: event.target.value,
                excludeCurrentUser: true
            }
        }).then(response => {
            setUsers(response.data["hydra:member"])
        }).catch(error => {
            console.error(error)
        })
    }

    function handleUserClick(user) {
        setSelectedUsers(prevSelectedUsers => {
            let newSelectedUsers = [...prevSelectedUsers]

            const index = newSelectedUsers.findIndex(u => u.id === user.id)
            if (index < 0) {
                // Add user to selected users
                newSelectedUsers.push(user)
            } else {
                // Remove user from selected users
                newSelectedUsers.splice(index, 1)
            }

            return newSelectedUsers
        })
    }

    const userElements = users.map((user, index) => (
        <div
            key={index}
            className="px-4 py-2 bg-zinc-700 rounded-2xl hover:bg-zinc-600 hover:cursor-pointer"
            onClick={() => handleUserClick(user)}
        >
            {user.username} ({user.email})
        </div>
    ))

    const selectedUsersElement = selectedUsers.map(user => user.username).join(", ").trimEnd()

    return (
        <div className="space-y-2">
            <input
                type="text"
                name="users"
                id="users"
                autoComplete="off"
                className="block w-full rounded-md px-3 py-2 bg-transparent border-2 border-zinc-600 focus:border-zinc-500 focus:ring-zinc-500"
                onChange={searchUsers}
            />

            <div>
                Selected: {selectedUsersElement}
            </div>

            <div className="space-y-2">
                {userElements}
            </div>
        </div>
    )
}

export default SelectUsersInput
