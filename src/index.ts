import { Elysia, ws } from "elysia";
import { staticPlugin } from '@elysiajs/static'
import { renderToReadableStream } from 'react-dom/server'
import { createElement } from "react";
import { cors } from '@elysiajs/cors'
import App from './react/App'

const app = new Elysia()
  .use(staticPlugin())
  .use(cors())
  .use(ws())
  .state('build', new Date())
  .ws('/hmr', {
    open(socket) {
      console.log('[server] websocket open:', socket.data)
      socket.subscribe('build')
    },
    close(ws, code, message) {
      console.log('[server] websocket close:', code, message)
    },
    message(ws, message) {
      console.log('[server] websocket message:', message)
      ws.send('hello from server')
    },
  })    
  .get('/hello', () => {
    return 'Hello World'
  })
  .get('/events', context => {
    return new Response('data: Hello World\n\n', {
      headers: {
        'Content-Type': 'text/event-stream',
      }
    })
  })
  .get('/', async () => {
    // home route
    console.log('[server] bundling react called...')

    // bundle client side react-code each time the server starts
    await Bun.build({
      entrypoints: ['./src/react/index.tsx'],
      outdir: './public',
    });

    // create our react App component
    const app = createElement(App)

    // render the app component to a readable stream
    const stream = await renderToReadableStream(app, {
      bootstrapScripts: ['/public/index.js']
    })

    // output the stream as the response
    return new Response(stream, {
      headers: { 'Content-Type': 'text/html' }
    })
  })
  .listen(3000, (server) => {
    console.log('[server] listen callback called...')
    console.log('[server] ', server)
    server.publish('build', new Date().toISOString())
  })


console.log(`[server] listening on http://${app.server?.hostname}:${app.server?.port}`)