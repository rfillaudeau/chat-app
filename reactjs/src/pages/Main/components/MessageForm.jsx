import React, {useEffect, useRef} from "react"
import axios from "axios"

function MessageForm({currentRoomId, onMessageSent}) {
    const submitButtonRef = useRef(null)
    const newMessageInputRef = useRef(null)

    useEffect(() => {
        if (newMessageInputRef.current === null) {
            return
        }

        newMessageInputRef.current.value = ""
    }, [currentRoomId])

    function handleSendMessage(event) {
        event.preventDefault()

        const text = newMessageInputRef.current.value
        if (text.length === 0) {
            return
        }

        submitButtonRef.current.disabled = true

        axios.post(`/api/rooms/${currentRoomId}/messages`, {text}, {
            baseURL: "http://localhost:8080"
        }).then(response => {
            if (onMessageSent instanceof Function) {
                onMessageSent(response.data)
            }
        }).catch(error => {
            console.error(error)
        }).finally(() => {
            newMessageInputRef.current.value = ""

            submitButtonRef.current.disabled = false
        })
    }

    return (
        <form
            className="flex items-center bg-zinc-800 px-4 py-2 rounded-2xl space-x-4"
            onSubmit={handleSendMessage}
        >
            <input
                type="text"
                className="grow text-sm px-0 py-2 bg-transparent border-transparent focus:border-transparent focus:ring-0 placeholder:text-zinc-500"
                placeholder="Write a message..."
                ref={newMessageInputRef}
            />

            <button
                type="submit"
                className="text-center rounded-md bg-zinc-600 px-4 py-2 text-sm hover:bg-zinc-500"
                ref={submitButtonRef}
            >
                <i className="bi bi-send-fill"/>
            </button>
        </form>
    )
}

export default MessageForm
