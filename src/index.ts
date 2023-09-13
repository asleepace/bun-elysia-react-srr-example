import { Elysia } from "elysia";
import { staticPlugin } from '@elysiajs/static'
import { renderToReadableStream } from 'react-dom/server'
import { createElement } from "react";
import App from './react/App'

// bundle client side react-code each time the server starts
await Bun.build({
  entrypoints: ['./src/react/index.tsx'],
  outdir: './public',
});

const app = new Elysia()
  .use(staticPlugin())
  .get('/', async () => {

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
  .listen(3000)