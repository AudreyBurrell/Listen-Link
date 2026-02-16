import { useEffect } from "react";
import { io } from "socket.io-client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import CreateAccount from "./pages/CreateAccount";
import JoinCreateRoom from "./pages/JoinCreateRoom";

function App() {
  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element ={<Login />}/>
        <Route path="/create-account" element={<CreateAccount />}/>
        <Route path="/join" element={<JoinCreateRoom />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

