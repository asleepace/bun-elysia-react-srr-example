import { useEffect, useState } from "react"

export function useEventStream(url: string) {

  const [messages, setMessages] = useState<MessageEvent<string>[]>([])

  useEffect(() => {
    const eventSource = new EventSource(url, {
      withCredentials: true
    })

    console.log(eventSource)

    eventSource.onopen = (event) => {
      console.log('[client] onopen:', event)
      eventSource.onmessage = (event) => {
        console.log('[client] onmessage:', event)
        setMessages([...messages, event])
      }
      eventSource.onerror = (event) => {
        console.log('[client] onerror:', event)
      }
    }

  }, [])

  return messages
}