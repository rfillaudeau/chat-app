import React from "react"
import RoomFormModal from "../components/RoomFormModal"

function Main() {
    const rooms = [...(new Array(5)).keys()].map((room, index) => (
        <a key={index} href="#" className="block flex items-center rounded-2xl hover:bg-zinc-700 px-4 py-3">
            <img
                src="https://picsum.photos/id/13/200/200"
                alt="..."
                className="mr-4 h-10 w-10 rounded-xl"
            />
            <div className="grow min-w-0">
                <div className="font-bold text-sm truncate">Room title is very long omg this is so long</div>
                <div className="flex text-xs text-zinc-400 space-x-2">
                    <div className="truncate grow">Last message is very long, so so long, oh my god</div>
                    <div className="shrink-0">5 min. ago</div>
                </div>
            </div>
        </a>
    ))

    const messages = [...(new Array(3)).keys()].map((message, index) => (
        <div key={index} className="flex px-0 py-3 space-x-4">
            <img
                src="https://picsum.photos/id/13/200/200"
                alt="..."
                className="h-8 w-8 rounded-xl"
            />
            <div className="grow space-y-2 min-w-0">
                <div className="space-x-2 flex items-center">
                    <div className="text-sm font-bold text-gray-200 truncate">Username</div>
                    <div className="shrink-0 text-xs text-gray-400">5 minutes ago</div>
                </div>
                <div className="inline-block rounded-2xl rounded-tl-sm bg-zinc-800 px-4 py-2 text-sm">
                    Happy new year! 👍
                </div>
                <div className="inline-block rounded-2xl rounded-tl-sm bg-zinc-800 px-4 py-2 text-sm">
                    Having same issue right now, Laravel 8, Inertia, Breeze & Tailwind: when I set outline-none on a element, it is ignored. Everything else seems to work properly.
                </div>
            </div>
        </div>
    ))

    return (
        <div className="flex h-screen text-zinc-300">
            <div className="flex w-1/4 flex-col px-6 py-4 space-y-4 bg-zinc-800">
                <div className="flex flex-col space-y-4 p-4 bg-zinc-900 rounded-2xl">
                    <a href="#" className="block flex items-center space-x-4">
                        <img
                            src="https://picsum.photos/id/13/200/200"
                            alt="..."
                            className="h-10 w-10 rounded-xl"
                        />

                        <div className="grow min-w-0">
                            <div className="text-md font-bold truncate">
                                rfillaudeau
                            </div>
                            <div className="text-xs truncate">
                                rfillaudeau@test.com
                            </div>
                        </div>

                        <div className="text-sm">
                            <i className="bi bi-caret-down-fill"></i>
                        </div>
                    </a>

                    <div className="flex space-x-2">
                        <button type="button" className="grow text-center rounded-md bg-zinc-600 px-2 py-2 text-xs hover:bg-zinc-500">
                            <i className="bi bi-gear"></i> Settings
                        </button>

                        <button type="button" className="text-center rounded-md bg-zinc-600 px-2 py-2 text-xs hover:bg-zinc-500">
                            <i className="bi bi-escape"></i> Logout
                        </button>
                    </div>
                </div>

                <div className="flex items-center">
                    <div className="grow text-lg font-bold">Rooms</div>

                    {/*<button type="button" className="text-center rounded-md bg-zinc-600 px-2 py-2 text-xs hover:bg-zinc-500">*/}
                    {/*    New room*/}
                    {/*</button>*/}
                    <RoomFormModal/>
                </div>

                <input
                    type="text"
                    className="rounded-2xl bg-zinc-700 px-3 py-2 text-sm text-zinc-400 border-transparent focus:border-transparent focus:ring-0 placeholder:text-zinc-500"
                    placeholder="Search a room..."
                />

                <div className="flex-grow overflow-auto space-y-2 scrollbar-thin scrollbar-thumb-zinc-500 scrollbar-track-zinc-700">
                    {rooms}
                </div>
            </div>

            <div className="flex w-3/4 flex-col px-6 py-4 bg-zinc-900">
                <div className="flex items-center rounded-t-2xl mb-4">
                    <div className="flex-grow text-lg font-bold">
                        My Awesome room
                    </div>
                    <button type="button" className="text-center rounded-md bg-transparent px-4 py-2 text-sm font-medium">
                        <i className="bi bi-three-dots" />
                    </button>
                </div>

                <div className="mb-4 grow overflow-auto scrollbar-thin scrollbar-thumb-zinc-500 scrollbar-track-zinc-700">
                    {messages}
                </div>

                <form className="flex items-center bg-zinc-800 px-4 py-2 rounded-2xl space-x-4">
                    <input
                        type="text"
                        className="grow text-sm px-0 py-2 bg-transparent border-transparent focus:border-transparent focus:ring-0 placeholder:text-zinc-500"
                        placeholder="Write a message..."
                    />

                    <button type="submit" className="text-center rounded-md bg-zinc-600 px-4 py-2 text-sm hover:bg-zinc-500">
                        <i className="bi bi-send-fill" />
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Main
