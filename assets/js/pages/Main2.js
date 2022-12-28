import React from "react"

function Main2() {
    const rooms = [...(new Array(5)).keys()].map((room, index) => (
        <div key={index} className="flex items-center bg-gray-700 rounded-2xl px-4 py-3">
            <img
                src="https://picsum.photos/id/13/200/200"
                alt="..."
                className="rounded-full w-10 h-10 mr-4"
            />
            <div className="flex-grow">
                <div className="text-md font-bold text-gray-200">Room title</div>
                <div className="text-xs text-gray-400">Last message - Time ago</div>
            </div>
        </div>
    ))

    const messages = [...(new Array(3)).keys()].map((message, index) => (
        <div key={index} className="flex px-4 py-3 space-x-4">
            <img
                src="https://picsum.photos/id/13/200/200"
                alt="..."
                className="rounded-full w-8 h-8"
            />
            <div className="grow space-y-2">
                <div className="space-x-2">
                    <span className="text-sm font-bold text-gray-200">Username</span>
                    <span className="text-xs text-gray-400">5 minutes ago</span>
                </div>
                <div className="text-sm bg-gray-800 text-gray-200 p-4 rounded-2xl rounded-tl-sm">
                    Happy new year! 👍
                </div>
            </div>
        </div>
    ))

    return (
        <div className="flex h-screen bg-gray-800">
            <div className="w-1/4 p-4 space-y-3 flex flex-col">
                <div className="flex space-x-4">
                    <img
                        src="https://picsum.photos/id/13/200/200"
                        alt="..."
                        className="rounded-full w-10 h-10"
                    />
                    <div className="grow">
                        <div className="text-sm font-bold">
                            Username
                        </div>
                        <div className="flex items-center justify-end space-x-2">
                            <div className="bg-gray-100 p-2 rounded-full w-10 h-10 text-center">
                                <i className="bi bi-gear" />
                            </div>
                            <div className="bg-gray-100 p-2 rounded-full w-10 h-10 text-center">
                                <i className="bi bi-escape" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center">
                    <div className="flex-grow text-lg font-bold">Rooms</div>
                    <div className="text-sm">New room</div>
                </div>

                <div className="text-sm px-3 py-2 bg-gray-100 text-gray-400 rounded-2xl">
                    Search a room...
                </div>

                <div className="flex-grow overflow-auto space-y-2">
                    {rooms}
                </div>
            </div>

            <div className="w-3/4 flex flex-col p-4">
                <div className="flex items-center p-4 rounded-t-2xl bg-gray-900 text-gray-200">
                    <div className="flex-grow text-lg font-bold">
                        My Awesome room
                    </div>
                    <div className="text-sm">Actions</div>
                </div>

                <div className="grow overflow-auto bg-gray-700 rounded-b-2xl mb-4">
                    {messages}
                </div>

                <div className="flex items-center space-x-4 p-4 bg-gray-900 rounded-2xl">
                    <input
                        type="text"
                        name="email"
                        id="email"
                        required
                        autoComplete="off"
                        placeholder="New message..."
                        className="block grow rounded-md border-none shadow-none px-3 py-2 focus:border-none sm:text-sm bg-gray-900"
                    />

                    <button type="submit" className="group relative flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        <i className="bi bi-send" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Main2
