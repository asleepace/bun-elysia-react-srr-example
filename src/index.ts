import { Elysia, ws } from "elysia";
import { staticPlugin } from '@elysiajs/static'
import { renderToReadableStream, renderToString } from 'react-dom/server'
import { createElement } from "react";
import { cors } from '@elysiajs/cors'
import App from './react/App'

// bundle client side react-code each time the server starts
await Bun.build({
  entrypoints: ['./src/react/index.tsx'],
  outdir: './public',
  naming: {
    asset: '[name].[ext]',
  }
});


const app = new Elysia()
  .use(staticPlugin())
  .use(cors())
  .use(ws())
  // websockets are used for hot module reloading, whenever a client
  // connects they will subscribe to the 'hmr' channel and the server
  // will send a message to all clients when the server has reloaded
  .ws('/hmr', {
    open(socket) {
      console.log('[server] client connected')
      socket.subscribe('hot-reload') // hot module reloading
    },
  })
  .get('/', async () => {

    // create our react App component
    const app = createElement(App)

    // render the app component to a readable stream
    const stream = await renderToReadableStream(app, {
      bootstrapScripts: ['/public/index.js']
    })

    // output the stream as the response
    return new Response(stream, {
      headers: { 
        'Content-Type': 'text/html',
        'Cache-Control': 'no-cache, must-revalidate'
      }
    })
  })
  .listen(3000, (server) => {
    // each time the server refreshes (i.e. hot reloads) this will be
    // called and publish a websocket message to all clients to reload
    const reactApp = createElement(App)
    const html = renderToString(reactApp)
    server.publish('hot-reload', html)
  })


console.log(`[server] listening on http://${app.server?.hostname}:${app.server?.port}`)