import React, {useEffect} from "react"

function useMercure(topic, onMessage) {
    useEffect(() => {
        if (topic === null || !(onMessage instanceof Function)) {
            return
        }

        const hub = new URL(import.meta.env.VITE_MERCURE_PUBLIC_URL)
        hub.searchParams.append("topic", topic)

        // Subscribe to updates
        const eventSource = new EventSource(hub)
        eventSource.onmessage = event => {
            onMessage(JSON.parse(event.data))
        }

        return () => eventSource.close()
    }, [topic])
}

export default useMercure
