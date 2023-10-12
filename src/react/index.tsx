/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

// items for fast-refresh, these need to go first!
import runtime from 'react-refresh/runtime'
runtime.injectIntoGlobalHook(window);
window.$RefreshReg$ = (type, id) => {};
window.$RefreshSig$ = () => type => type;

import React, { StrictMode, createElement } from 'react'
import { createRoot, hydrateRoot, Root  } from 'react-dom/client'
import App from './App.js'
import { flushSync, hydrate } from 'react-dom'

declare global {
  interface Window {
    hotreload?: () => React.ReactElement;
    reactRoot?: Root;
  }
}

const reactRoot = hydrateRoot(document, <App />)
const socket = new WebSocket(`ws://localhost:3000/hmr`)

socket.addEventListener('message', ({ data }) => {
  console.log('[client] on message:', data)
  runtime.performReactRefresh()
})

// view this documentation:
// https://github.com/facebook/create-react-app/blob/main/packages/react-dev-utils/webpackHotDevClient.js
// also this one:
// https://webpack.github.io/docs/hot-module-replacement.html#check

// almost works but needs to strip the outer <div id="root">...</div>
// hydration may or may not be working.
function replaceAndFlushRoot(data: string) {
  const [documentHead, documentBody] = data.split('<body>')
  const [reactElement, documentTail] = documentBody.split('</body>')

  const root = document.getElementById('body') as HTMLDivElement
  root.innerHTML = reactElement

  flushSync(() => {
    reactRoot.render(<App />);
  })
}

// extension of the method above, still not working with subelements.
function replaceAndFlushRootNext(data: string) {
  const [documentHead, documentBody] = data.split('<body>')
  const [reactBodyRoot, documentTail] = documentBody.split('</body>')
  document.body.innerHTML = reactBodyRoot
  reactRoot.render(<App />);
}