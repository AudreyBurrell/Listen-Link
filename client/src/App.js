import { useEffect } from "react";
import { io } from "socket.io-client";

function App() {
  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div>
      <h1>Live Caption App</h1>
    </div>
  );
}

export default App;

