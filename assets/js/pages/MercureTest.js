import React, { useState, useEffect } from "react"

function MercureTest() {
    const [messages, setMessages] = useState([])

    useEffect(() => {
        const hub = new URL(document.mercureLink)

        hub.searchParams.append("topic", "rooms/1")

        // Subscribe to updates
        const eventSource = new EventSource(hub)
        eventSource.onmessage = event => {
            console.log(event)

            const message = JSON.parse(event.data)

            console.log(message)

            setMessages(prevMessages => [...prevMessages, message])
        }

        return () => {
            eventSource.close()
        }
    }, [])

    const messageElements = messages.map((message, index) => (
        <div className="d-flex px-3 pb-3" key={index}>
            <div className="me-3">
                <img src="https://picsum.photos/id/230/200" className="rounded avatar-sm" alt="..." />
            </div>
            <div className="flex-fill">
                <div className="d-flex align-items-baseline mb-2">
                    <div className="fw-bold me-3">{message.user.username}</div>
                    <div className="text-muted small">{message.createdAt}</div>
                </div>
                <p className="mb-0">{message.text}</p>
            </div>
        </div>
    ))

    return (
        <div>
            {messageElements}
        </div>
    )
}

export default MercureTest
