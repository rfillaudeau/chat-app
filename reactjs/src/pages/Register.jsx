import React, {useEffect, useRef, useState} from "react"
import {Link, useNavigate} from "react-router-dom"
import axios from "axios"
import {useUser} from "../contexts/UserContext.jsx"

function Register() {
    const {currentUser} = useUser()
    const [inputs, setInputs] = useState({
        email: "",
        username: "",
        password: "",
        passwordConfirmation: ""
    })
    const [error, setError] = useState(null)
    const submitButtonRef = useRef(null)
    const navigate = useNavigate()

    useEffect(() => {
        if (currentUser !== null) {
            navigate("/")
        }
    }, [])

    function handleChange(event) {
        const {name, value} = event.target

        setInputs(prevInputs => ({
            ...prevInputs,
            [name]: value
        }))
    }

    function handleValidation() {
        setError(null)

        if (inputs.password !== inputs.passwordConfirmation) {
            setError("The password and its confirmation do not match.")
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

        console.log(inputs)

        axios.post("/api/register", {
            email: inputs.email,
            username: inputs.username,
            password: inputs.password
        }, {
            baseURL: "http://localhost:8080"
        })
            .then(response => {
                console.log(response.data)

                navigate("/login")
            })
            .catch(response => console.error(response))
            .finally(() => {
                submitButtonRef.current.disabled = false
            })
    }

    return (
        <div className="flex justify-center py-12 px-4 text-zinc-200">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <i className="bi bi-chat-dots text-6xl text-zinc-500"/>

                    <h2 className="mt-6 text-3xl font-bold tracking-tight">
                        Create a new account
                    </h2>

                    <p className="mt-2 text-sm">
                        Or <Link to="/login" className="text-zinc-200 hover:text-zinc-100">sign in</Link>
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="">
                        <label htmlFor="email" className="block text-sm mb-2">
                            Email address
                        </label>

                        <input
                            type="email"
                            name="email"
                            id="email"
                            autoComplete="email"
                            required
                            className="block w-full rounded-md px-3 py-2 bg-transparent border-2 border-zinc-600 focus:border-zinc-500 focus:ring-zinc-500"
                            value={inputs.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="">
                        <label htmlFor="username" className="block text-sm mb-2">
                            Username
                        </label>

                        <input
                            type="text"
                            name="username"
                            id="username"
                            autoComplete="username"
                            required
                            className="block w-full rounded-md px-3 py-2 bg-transparent border-2 border-zinc-600 focus:border-zinc-500 focus:ring-zinc-500"
                            value={inputs.username}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="">
                        <label htmlFor="password" className="block text-sm mb-2">
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            id="password"
                            required
                            className="block w-full rounded-md px-3 py-2 bg-transparent border-2 border-zinc-600 focus:border-zinc-500 focus:ring-zinc-500"
                            value={inputs.password}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="">
                        <label htmlFor="passwordConfirmation" className="block text-sm mb-2">
                            Confirm password
                        </label>

                        <input
                            type="password"
                            name="passwordConfirmation"
                            id="passwordConfirmation"
                            required
                            className="block w-full rounded-md px-3 py-2 bg-transparent border-2 border-zinc-600 focus:border-zinc-500 focus:ring-zinc-500"
                            value={inputs.passwordConfirmation}
                            onChange={handleChange}
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
                            Create account
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Register
