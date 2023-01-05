import React from "react"
import {Link} from "react-router-dom"

function RoomCard({room, isSelected}) {
    return (
        <Link
            to={`/room/${room.id}`}
            className={`block flex items-center rounded-2xl hover:bg-zinc-700 px-4 py-3${isSelected ? " bg-zinc-700" : ""}`}
        >
            <img
                src="https://picsum.photos/id/13/200/200"
                alt="..."
                className="mr-4 h-10 w-10 rounded-xl"
            />
            <div className="grow min-w-0">
                <div className="font-bold text-sm truncate">{room.name}</div>
                <div className="flex text-xs text-zinc-400 space-x-2">
                    <div className="truncate grow">
                        {room.lastMessage !== null ? room.lastMessage.text : "No message"}
                    </div>
                    <div className="shrink-0">5 min. ago</div>
                </div>
            </div>
        </Link>
    )
}

export default RoomCard
