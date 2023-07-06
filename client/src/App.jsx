import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import Chat from "@/pages/chat/Chat";
import Login from "@/pages/login/Login";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Cookies from "js-cookie";
import SignUp from "./pages/signup/Signup";
import Profile from "./pages/profile/Profile";
import './App.scss'

function App() {
  const checkLogin = (Cookies.get('isLogin') === 'true');

  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile/:id" element={<ProfileWrapper />} />
          <Route path="*" element={checkLogin ? <Navigate replace to="/chat" /> : <Navigate replace to="/login" />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer autoClose={3000} />
    </div>
  );
}

function ProfileWrapper() {
  const { id } = useParams();
  const isLogin = (Cookies.get('isLogin') === 'true');
  if (!isLogin) {
    return <Navigate replace to="/login" />
  }
  else {
    return <Profile id={id} />;
  }
}

export default App;
