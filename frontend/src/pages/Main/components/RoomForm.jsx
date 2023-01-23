import React, {useRef, useState} from "react"
import {useAuth} from "../../../contexts/AuthContext.jsx"
import SelectUsersInput from "./SelectUsersInput.jsx"

function RoomForm({onSuccess}) {
    const {currentUser, api} = useAuth()
    const [inputs, setInputs] = useState({
        name: "",
        users: []
    })
    const [error, setError] = useState(null)
    const submitButtonRef = useRef(null)

    function handleChange(event) {
        const {name, value} = event.target

        setInputs(prevInputs => ({
            ...prevInputs,
            [name]: value
        }))
    }

    function handleSelectedUsersChange(users) {
        setInputs(prevInputs => ({
            ...prevInputs,
            users: users
        }))
    }

    function handleValidation() {
        setError(null)

        if (inputs.name.trim() === "") {
            setError("The name must be filled.")
            return false
        }

        if (inputs.users.length === 0) {
            setError("At least one user should be added to the room.")
            return false
        }

        return true
    }

    function handleSubmit(event) {
        event.preventDefault()

        submitButtonRef.current.disabled = true

        if (!handleValidation()) {
            submitButtonRef.current.disabled = false
            return
        }

        let users = inputs.users.map(user => ({user: user["@id"]}))
        users.push({user: currentUser["@id"]})

        api.post("/rooms", {
            name: inputs.name,
            users: users
        }).then(response => {
            if (onSuccess instanceof Function) {
                onSuccess(response.data)
            }
        }).catch(error => {
            console.error(error)

            setError("Unknown error.")
        }).finally(() => {
            submitButtonRef.current.disabled = false
        })
    }

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="">
                <label htmlFor="name" className="block text-sm mb-2">
                    Name
                </label>

                <input
                    type="text"
                    name="name"
                    id="name"
                    autoComplete="off"
                    required
                    className="block w-full rounded-md px-3 py-2 bg-transparent border-2 border-zinc-600 focus:border-zinc-500 focus:ring-zinc-500"
                    value={inputs.name}
                    onChange={handleChange}
                />
            </div>

            <div className="">
                <label htmlFor="users" className="block text-sm mb-2">
                    Users
                </label>

                <SelectUsersInput onChange={handleSelectedUsersChange}/>
            </div>

            {error !== null && (
                <div className="p-4 bg-red-800 rounded-md">{error}</div>
            )}

            <div>
                <button
                    type="submit"
                    className="w-full text-center rounded-md border border-transparent bg-zinc-600 py-2 px-4 text-sm font-medium hover:bg-zinc-500 focus:outline-none focus:ring-0 focus:ring-zinc-500"
                    ref={submitButtonRef}
                >
                    Create
                </button>
            </div>
        </form>
    )
}

export default RoomForm
