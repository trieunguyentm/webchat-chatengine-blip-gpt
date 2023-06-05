import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Chat from "@/components/chat/Chat";
import Login from "@/components/login/Login";

function App() {
  const [user, setUser] = useState(null);
  const [secret, setSecret] = useState(null);
  const isAuth = Boolean(user) && Boolean(secret);

  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/chat" element={<Chat />} />
          {/* <Route
            path="/"
            element={
              isAuth ? (
                <Navigate to="/chat" />
              ) : (
                <Login setUser={setUser} setSecret={setSecret} />
              )
            }
          />
          <Route
            path="/chat"
            element={
              isAuth ? (
                <Chat user={user} secret={secret} />
              ) : (
                <Navigate to="/" />
              )
            }
          /> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
