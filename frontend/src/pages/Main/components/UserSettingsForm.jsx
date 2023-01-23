import React, {useRef, useState} from "react"
import {useAuth} from "../../../contexts/AuthContext.jsx"
import {AxiosError} from "axios"

export default function UserSettingsForm({onSuccess}) {
    const {api, currentUser, saveCurrentUser} = useAuth()
    const [inputs, setInputs] = useState({
        username: currentUser.username,
        email: currentUser.email
    })
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)
    const submitButtonRef = useRef(null)

    function handleChange(event) {
        const {name, value} = event.target

        setInputs(preInputs => ({
            ...preInputs,
            [name]: value
        }))
    }

    function handleValidation() {
        setError(null)

        if (inputs.username.length < 2 || inputs.username.length > 30) {
            setError("The username should contains between 2 and 30 characters.")
            return false
        }

        if (!/^.+@.+\..+$/.test(inputs.email)) {
            setError("The email address should be valid.")
            return false
        }

        if (inputs.username.length > 180) {
            setError("The email address should not contains more than 180 characters.")
            return false
        }

        return true
    }

    function handleSubmit(event) {
        event.preventDefault()

        setSuccess(null)

        submitButtonRef.current.disabled = true
        if (!handleValidation()) {
            submitButtonRef.current.disabled = false
            return
        }

        api.put(`/users/${currentUser.id}`, {
            username: inputs.username,
            email: inputs.email
        }).then(response => {
            saveCurrentUser(response.data)

            setSuccess("Settings successfully updated.")

            if (onSuccess instanceof Function) {
                onSuccess()
            }
        }).catch(error => {
            if (!(error instanceof AxiosError)) {
                console.error(error)

                setError("Unknown error.")

                return
            }

            const violations = error.response?.data?.violations
            if (violations.length === 0) {
                return
            }

            if (violations[0].propertyPath === "username") {
                setError("This username is already taken.")
                return
            }

            if (violations[0].propertyPath === "email") {
                setError("This email address is already taken.")
                return
            }
        }).finally(() => {
            submitButtonRef.current.disabled = false
        })
    }

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
                <label htmlFor="username" className="block text-sm">
                    Username
                </label>

                <input
                    type="text"
                    name="username"
                    id="username"
                    autoComplete="off"
                    required
                    className="block w-full rounded-md px-3 py-2 bg-transparent border-2 border-zinc-600 focus:border-zinc-500 focus:ring-zinc-500"
                    value={inputs.username}
                    onChange={handleChange}
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="email" className="block text-sm">
                    Email
                </label>

                <input
                    type="email"
                    name="email"
                    id="email"
                    autoComplete="off"
                    required
                    className="block w-full rounded-md px-3 py-2 bg-transparent border-2 border-zinc-600 focus:border-zinc-500 focus:ring-zinc-500"
                    value={inputs.email}
                    onChange={handleChange}
                />
            </div>

            {error !== null && (
                <div className="p-4 bg-red-800 rounded-md">{error}</div>
            )}

            {success && <div className="p-4 bg-green-800 rounded-md">{success}</div>}

            <button
                type="submit"
                className="w-full text-center rounded-md border border-transparent bg-zinc-600 py-2 px-4 text-sm font-medium hover:bg-zinc-500 focus:outline-none focus:ring-0 focus:ring-zinc-500"
                ref={submitButtonRef}
            >
                Update
            </button>
        </form>
    )
}
