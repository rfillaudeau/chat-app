import React, {useEffect, useState} from "react"
import {Link} from "react-router-dom"
import {useAuth} from "../../../contexts/AuthContext.jsx"
import {CanceledError} from "axios"

function RoomCard({room, isSelected, onSelect}) {
    const {api} = useAuth()
    const [lastMessage, setLastMessage] = useState(null)

    useEffect(() => {
        let controller = new AbortController()

        api.get(`/rooms/${room.id}/messages/last`, {
            signal: controller.signal
        }).then(response => {
            if (response.status === 204) {
                return
            }

            setLastMessage(response.data)
        }).catch(error => {
            if (error instanceof CanceledError) {
                return
            }

            console.error(error)
        })

        return () => controller.abort()
    }, [])

    function handleSelect() {
        if (onSelect instanceof Function) {
            onSelect(room)
        }
    }

    return (
        <Link
            to={`/room/${room.id}`}
            className={`block rounded-2xl hover:bg-zinc-700 min-w-0 px-4 py-3${isSelected ? " bg-zinc-700" : ""}`}
            onClick={handleSelect}
        >
            <div className="font-bold text-sm truncate">{room.name}</div>
            <div className="flex text-xs text-zinc-400 space-x-2">
                <div className="truncate grow">
                    {lastMessage !== null ? lastMessage.text : "No message"}
                </div>
                <div className="shrink-0">5 min. ago</div>
            </div>
        </Link>
    )
}

export default RoomCard
