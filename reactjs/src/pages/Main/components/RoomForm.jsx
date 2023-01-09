import React, {useRef, useState} from "react"
import {useAuth} from "../../../contexts/AuthContext.jsx"

function RoomForm() {
    const {api} = useAuth()
    const [inputs, setInputs] = useState({
        name: "",
        // password: ""
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

    function handleValidation() {
        setError(null)

        return true
    }

    function handleSubmit(event) {
        event.preventDefault()

        submitButtonRef.current.disabled = true

        if (!handleValidation()) {
            submitButtonRef.current.disabled = false
            return
        }

        console.log(inputs)

        api.post("/rooms", {
            email: inputs.email,
            password: inputs.password
        }).then(response => {
            console.log(response.data)

            location.href = "/"
        }).catch(response => {
            console.error(response)

            setError("Incorrect email or password.")
        }).finally(() => {
            submitButtonRef.current.disabled = false
        })
    }

    function searchUsers(event) {
        console.log(event)

        api.get("/users", {
            params: {
                search: event.target.value
            }
        }).then(response => {
            console.log(response.data)

            // location.href = "/"
        }).catch(response => {
            console.error(response)

            // setError("Incorrect email or password.")
        }).finally(() => {
            // submitButtonRef.current.disabled = false
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

                <input
                    type="text"
                    name="users"
                    id="users"
                    autoComplete="off"
                    required
                    className="block w-full rounded-md px-3 py-2 bg-transparent border-2 border-zinc-600 focus:border-zinc-500 focus:ring-zinc-500"
                    // value={inputs.password}
                    onChange={searchUsers}
                />
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
