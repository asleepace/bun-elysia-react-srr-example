import React, { useState } from "react";
import { useHotModuleReloading } from './hooks/useHotModuleReloading';
import '../assets/styles.css'

export default function App() {
  const [count, setCount] = useState(0);
  // useHotModuleReloading() // only use in development
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <title>Bun, Elysia & React</title>
        <meta name="description" content="Bun, Elysia & React" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="./public/assets/styles.css"></link>
      </head>
      <body>
        <div id="root">
          <h1>Counter {count}</h1>
          <button onClick={() => setCount(count + 1)}>Increment</button>
        </div>
      </body>
    </html>
  );
}