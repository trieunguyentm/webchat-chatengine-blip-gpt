import { useState } from "react";
import { Box, Button, Container, Grid, Paper } from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import KeyIcon from '@mui/icons-material/Key';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

export default function Login(props) {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const handleClickSignIn = async () => {
    const url = `${import.meta.env.VITE_BASE_URL}/auth/login`
    const data = {
      username: userName,
      secret: password,
    };
    //Send API
    try {
      const response = await axios.post(url, data);
      // Thông tin đăng nhập không chính xác
      if (response.data.detail) {
        toast.error("The login information is incorrect");
        return;
      }
      // Thông tin chính xác
      else {
        toast.success("Login successful");
        props.setUser(userName);
        props.setSecret(password);
        Cookies.set("isLogin", true);
        navigate("/chat");
        return;
      }
    } catch (error) {
      toast.error("An error occurred while connecting to the server");
    }

  }

  const checkLogin = (Cookies.get('isLogin') === 'true');
  if (checkLogin) {
    return <Navigate replace to="/chat" />
  }
  else {
    return (
      <div>
        <Container fixed maxWidth="sm">
          <Grid
            container
            spacing={3}
            direction="column"
            justifyContent="center"
            style={{ minHeight: "100vh" }}
          >
            <Paper elevation={20} sx={{ padding: 4, margin: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: 1 }}>
                <h1 style={{ color: 'green' }}> SIGN IN </h1>
              </Box>
              <form>
                <Grid
                  container
                  spacing={2}
                  direction="column"
                >
                  <Grid item style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <label htmlFor="username" ><PersonIcon style={{ fontSize: '40px', color: 'green' }} /></label>
                    <input
                      id="username"
                      type="text"
                      name="username"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Enter your username"
                      style={{ borderWidth: "0px 0px 3px 0px", borderColor: "green", fontWeight: "bold" }}
                      onFocus={(e) => e.target.style.outline = "none"}
                      title="Enter your username"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleClickSignIn();
                        }
                      }}
                    />
                  </Grid>

                  <Grid item style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <label htmlFor="password" ><KeyIcon style={{ fontSize: '40px', color: 'green' }} /></label>
                    <input
                      id="password"
                      type="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      style={{ borderWidth: "0px 0px 3px 0px", borderColor: "green", fontWeight: "bold" }}
                      onFocus={(e) => e.target.style.outline = "none"}
                      title="Enter your password"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleClickSignIn();
                        }
                      }}
                    />
                  </Grid>

                  <Grid item style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Button
                      variant="contained"
                      endIcon={<ArrowForwardIcon />}
                      onClick={handleClickSignIn}
                      title="Click to sign in"
                      style={{ backgroundColor: "green" }}
                    >
                      Sign In
                    </Button>
                  </Grid>

                  <Grid item>
                    <Link
                      to="/signup"
                      style={{
                        textDecoration: 'none',
                        display: 'flex', textAlign: 'center',
                        justifyContent: 'center',
                        color: 'dodgerblue',
                        fontSize: '15px',
                      }}
                      title="Click to sign up">
                      <span className="link-text">Sign up for an account here</span>
                    </Link>
                  </Grid>

                </Grid>
              </form>
            </Paper>
          </Grid>
        </Container>
      </div>
    )
  }
}


