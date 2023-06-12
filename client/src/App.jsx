import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, } from "react-router-dom";
import Chat from "@/components/chat/Chat";
import Login from "@/components/login/Login";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Cookies from "js-cookie";

function App() {
  const [user, setUser] = useState("");
  const [secret, setSecret] = useState("");
  const checkLogin = (Cookies.get('isLogin') === 'true');

  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/chat" element={<Chat user={user} secret={secret} />} />
          <Route path="/login" element={<Login setUser={setUser} setSecret={setSecret} />} />
          <Route path="*" element={checkLogin ? <Navigate replace to="/chat" /> : <Navigate replace to="/login" />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer autoClose={3000} />
    </div>
  );
}

export default App;
