import React from "react"
import {Link} from "react-router-dom"

function Register() {
    return (
        <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <i className="bi bi-chat-dots mx-auto text-6xl block text-center text-indigo-600" />

                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                        Create a new account
                    </h2>

                    <p className="mt-2 text-center text-sm text-gray-600">
                        Or <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">sign in</Link>
                    </p>
                </div>

                <form className="mt-8 space-y-6" action="#" method="POST">
                    <input type="hidden" name="remember" value="true" />
                    <div className="">
                        <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-700">
                            Email address
                        </label>

                        <input
                            type="email"
                            name="email"
                            id="email"
                            autoComplete="email"
                            required
                            className="block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div className="">
                        <label htmlFor="username" className="block text-sm font-medium mb-2 text-gray-700">
                            Username
                        </label>

                        <input
                            type="text"
                            name="username"
                            id="username"
                            autoComplete="username"
                            required
                            className="block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div className="">
                        <label htmlFor="password" className="block text-sm font-medium mb-2 text-gray-700">
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            id="password"
                            required
                            className="block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div className="">
                        <label htmlFor="password" className="block text-sm font-medium mb-2 text-gray-700">
                            Confirm password
                        </label>

                        <input
                            type="password"
                            name="passwordConfirmation"
                            id="passwordConfirmation"
                            required
                            className="block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <button type="submit" className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                            Create account
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Register
