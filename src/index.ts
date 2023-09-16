import { Elysia } from "elysia";
import { staticPlugin } from '@elysiajs/static'
import { renderToReadableStream } from 'react-dom/server'
import { createElement } from "react";
import { cors } from '@elysiajs/cors'
import App from './react/App'
import { write } from "console";

// bundle client side react-code each time the server starts
await Bun.build({
  entrypoints: ['./src/react/index.tsx'],
  outdir: './public',
});

const app = new Elysia()
  .use(staticPlugin())
  .use(cors())
  .get('/hello', () => {
    return 'Hello World'
  })
  .get('/events', context => {
    console.log('[server] events called:', context)

    return new Response('data: Hello World\n\n', {
      headers: {
        'Content-Type': 'text/event-stream',
      }
    })

  })
  .get('/', async () => {

    console.log('this is a test!')

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