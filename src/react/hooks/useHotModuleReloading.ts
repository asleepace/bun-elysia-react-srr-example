import { useEffect } from 'react'

const HOT_RELOADING_URL = 'ws://localhost:3000/hmr'

// This hook opens a websocket connection to the server and will reload
// the page when the server sends a message.
export function useHotModuleReloading() {
  useEffect(() => {
    const socket = new WebSocket(HOT_RELOADING_URL)
    socket.onopen = (event) => {
      console.log('[client] onopen:', event)
      socket.onmessage = (event) => {
        console.log('[client] hot reloading!')
        window.location.reload()
      }
    }
    return () => {
      console.log('[client] useHotModuleReloading unmounting...')
      socket.close()
    }
  }, [])
}