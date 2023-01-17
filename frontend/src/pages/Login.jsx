import React, {useEffect, useRef, useState} from "react"
import {Link, useNavigate} from "react-router-dom"
import {useAuth} from "../contexts/AuthContext.jsx"

function Login() {
    const {currentUser, login} = useAuth()
    const [inputs, setInputs] = useState({
        email: "",
        password: ""
    })
    const [error, setError] = useState(null)
    const submitButtonRef = useRef(null)
    const navigate = useNavigate()

    useEffect(() => {
        if (currentUser != null) {
            navigate("/")
        }
    }, [currentUser])

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

        login(inputs.email, inputs.password).catch(response => {
            console.error(response)

            setError("Incorrect email or password.")
        }).finally(() => {
            submitButtonRef.current.disabled = false
        })
    }

    return (
        <div className="flex items-center justify-center py-12 px-4 text-zinc-200">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <i className="bi bi-chat-dots text-6xl text-zinc-500"/>

                    <h2 className="mt-6 text-3xl font-bold tracking-tight">
                        Sign in to your account
                    </h2>

                    <p className="mt-2 text-sm">
                        Or <Link to="/register" className="text-zinc-200 hover:text-zinc-100">register</Link>
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
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
                        <label htmlFor="password" className="block text-sm mb-2">
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            id="password"
                            autoComplete="current-password"
                            required
                            className="block w-full rounded-md px-3 py-2 bg-transparent border-2 border-zinc-600 focus:border-zinc-500 focus:ring-zinc-500"
                            value={inputs.password}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 rounded bg-zinc-600 border border-transparent text-zinc-600 focus:ring-zinc-500 focus:ring-0 focus:outline-none"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm">Remember me</label>
                        </div>

                        <div className="text-sm">
                            <a href="#" className="text-zinc-200 hover:text-zinc-100">Forgot your password?</a>
                        </div>
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
                            Sign in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login
