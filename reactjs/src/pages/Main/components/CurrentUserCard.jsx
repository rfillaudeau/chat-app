import React from "react"
import {useUser} from "../../../contexts/UserContext.jsx"

function CurrentUserCard() {
    const {currentUser} = useUser()

    if (currentUser === null) {
        return
    }

    return (
        <div className="flex flex-col space-y-4 p-4 bg-zinc-900 rounded-2xl">
            <a href="#" className="block flex items-center space-x-4">
                <img
                    src="https://picsum.photos/id/13/200/200"
                    alt="..."
                    className="h-10 w-10 rounded-xl"
                />

                <div className="grow min-w-0">
                    <div className="text-md font-bold truncate">
                        {currentUser.username}
                    </div>
                    <div className="text-xs truncate">
                        {currentUser.email}
                    </div>
                </div>
            </a>

            <div className="flex space-x-2">
                <button
                    type="button"
                    className="grow text-center rounded-md bg-zinc-600 px-2 py-2 text-xs hover:bg-zinc-500"
                >
                    <i className="bi bi-gear"></i> Settings
                </button>

                <a
                    href="/logout"
                    className="block text-center rounded-md bg-zinc-600 px-2 py-2 text-xs hover:bg-zinc-500"
                >
                    <i className="bi bi-escape"></i> Logout
                </a>
            </div>
        </div>
    )
}

export default CurrentUserCard
