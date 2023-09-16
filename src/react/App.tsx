// src/react/App.tsx
import React, { useState } from "react";
import { useEventStream } from './hooks/useEventStream';

export default function App() {
  const [count, setCount] = useState(0);
  const messages = useEventStream('http://localhost:3000/events');
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <title>Bun, Elysia & React</title>
        <meta name="description" content="Bun, Elysia & React" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <h1>Counter {count}</h1>
        <button onClick={() => setCount(count + 1)}>Increment</button>
        <ul>
          {messages.map((message, index) => (
            <li key={index}>{message.data}</li>
          ))}
        </ul>
      </body>
    </html>
  );
}