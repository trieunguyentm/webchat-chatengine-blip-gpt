import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Paper } from '@mui/material';
import React, { useState } from 'react'
import PersonIcon from '@mui/icons-material/Person';
import KeyIcon from '@mui/icons-material/Key';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BadgeIcon from '@mui/icons-material/Badge';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import EmailIcon from '@mui/icons-material/Email';
// import FaceIcon from '@mui/icons-material/Face';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function SignUp() {
    // Các thông tin liên quan đến đăng ký
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [gmail, setGmail] = useState("");
    // const [linkAvatar, setLinkAvatar] = useState("");

    const navigate = useNavigate();
    const [openDialog, setOpenDialog] = useState(false);


    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = async (choice) => {
        setOpenDialog(false);
        if (choice === "Yes") {
            const url = `${import.meta.env.VITE_BASE_URL}/auth/signup`;
            const data = {
                username: username,
                secret: password,
                email: gmail,
                first_name: firstname,
                last_name: lastname,
            }
            try {
                const response = await axios.post(url, data);
                if (response.data.message === "This username is taken.") {
                    toast.info("This username is taken.")
                }
                else {
                    toast.success("Account registration successful");
                    navigate("/login");
                }
                // console.log(response);
            } catch (error) {
                toast.error("An error occurred while connecting to the server");
            }
        }
    }

    const handleClickSignUp = async () => {
        if (username === "" || password === "" || confirmPassword === "" || firstname === "" || lastname === "" || gmail === "") {
            toast.info("Please fill in all the registration information");
            return;
        }
        if (username) {
            let pattern = /^[a-z0-9_]+$/;
            if (!pattern.test(username)) {
                toast.info("The username can only contain lowercase letters, digits, and underscores.", { autoClose: 5000 });
                return;
            }
        }
        if (password !== confirmPassword) {
            toast.info("The confirmation password is incorrect");
            return;
        }
        if (gmail) {
            let pattern = /^[a-zA-Z0-9._]+@gmail.com$/;
            if (!pattern.test(gmail)) {
                toast.info("Gmail must be in the format of @gmail.com");
                return;
            }
        }
        handleOpenDialog();
    };

    // const handleAvatarChange = (e) => {
    //     const file = e.target.files[0];
    //     const reader = new FileReader();
    //     reader.readAsDataURL(file);
    //     reader.onloadend = () => {
    //         setLinkAvatar(reader.result);
    //     }
    // };

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
                        <Paper className="paper-login" elevation={20} sx={{ padding: 4, margin: 4 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: 1 }}>
                                <h1 style={{ color: 'green' }}> SIGN UP </h1>
                            </Box>
                            <form>
                                <Grid
                                    container
                                    spacing={2}
                                    direction="column"
                                >
                                    {/* User name */}
                                    <Grid item style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <label htmlFor="username" ><PersonIcon style={{ fontSize: '40px', color: 'green' }} /></label>
                                        <input
                                            required
                                            id="username"
                                            type="text"
                                            name="username"
                                            value={username}
                                            onChange={(e) => setUserName(e.target.value)}
                                            placeholder="Enter your username"
                                            style={{ borderWidth: "0px 0px 3px 0px", borderColor: "green", fontWeight: "bold", backgroundColor: "transparent", width: '60%' }}
                                            onFocus={(e) => e.target.style.outline = "none"}
                                            title="Enter your username"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleClickSignUp();
                                                }
                                            }}
                                        />
                                    </Grid>
                                    {/* Password */}
                                    <Grid item style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <label htmlFor="password" ><KeyIcon style={{ fontSize: '40px', color: 'green' }} /></label>
                                        <input
                                            required
                                            id="password"
                                            type="password"
                                            name="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter your password"
                                            style={{ borderWidth: "0px 0px 3px 0px", borderColor: "green", fontWeight: "bold", backgroundColor: "transparent", width: '60%' }}
                                            onFocus={(e) => e.target.style.outline = "none"}
                                            title="Enter your password"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleClickSignUp();
                                                }
                                            }}
                                        />
                                    </Grid>
                                    {/* Confirm password */}
                                    <Grid item style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <label htmlFor="confirm_password" ><KeyIcon style={{ fontSize: '40px', color: 'green' }} /></label>
                                        <input
                                            required
                                            id="confirm_password"
                                            type="password"
                                            name="confirm_password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Enter confirm password"
                                            style={{ borderWidth: "0px 0px 3px 0px", borderColor: "green", fontWeight: "bold", backgroundColor: "transparent", width: '60%' }}
                                            onFocus={(e) => e.target.style.outline = "none"}
                                            title="Enter confirm password"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleClickSignUp();
                                                }
                                            }}
                                        />
                                    </Grid>
                                    {/* First name */}
                                    <Grid item style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <label htmlFor="firstname" ><BadgeIcon style={{ fontSize: '40px', color: 'green' }} /></label>
                                        <input
                                            required
                                            id="firstname"
                                            type="text"
                                            name="firstname"
                                            value={firstname}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            placeholder="Enter your first name"
                                            style={{ borderWidth: "0px 0px 3px 0px", borderColor: "green", fontWeight: "bold", backgroundColor: "transparent", width: '60%' }}
                                            onFocus={(e) => e.target.style.outline = "none"}
                                            title="Enter your first name"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleClickSignUp();
                                                }
                                            }}
                                        />
                                    </Grid>
                                    {/* Last name */}
                                    <Grid item style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <label htmlFor="lastname" ><DriveFileRenameOutlineIcon style={{ fontSize: '40px', color: 'green' }} /></label>
                                        <input
                                            required
                                            id="lastname"
                                            type="text"
                                            name="lastname"
                                            value={lastname}
                                            onChange={(e) => setLastName(e.target.value)}
                                            placeholder="Enter your last name"
                                            style={{ borderWidth: "0px 0px 3px 0px", borderColor: "green", fontWeight: "bold", backgroundColor: "transparent", width: '60%' }}
                                            onFocus={(e) => e.target.style.outline = "none"}
                                            title="Enter your last name"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleClickSignUp();
                                                }
                                            }}
                                        />
                                    </Grid>
                                    {/* Gmail */}
                                    <Grid item style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <label htmlFor="gmail" ><EmailIcon style={{ fontSize: '40px', color: 'green' }} /></label>
                                        <input
                                            required
                                            id="gmail"
                                            type="email"
                                            name="gmail"
                                            value={gmail}
                                            onChange={(e) => setGmail(e.target.value)}
                                            placeholder="Enter your gmail"
                                            style={{ borderWidth: "0px 0px 3px 0px", borderColor: "green", fontWeight: "bold", backgroundColor: "transparent", width: '60%' }}
                                            onFocus={(e) => e.target.style.outline = "none"}
                                            title="Enter your gmail"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleClickSignUp();
                                                }
                                            }}
                                        />
                                    </Grid>
                                    {/* Avatar */}
                                    {/* <Grid item style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <label htmlFor="avatar" ><FaceIcon style={{ fontSize: '40px', color: 'green' }} /></label>
                                        <input
                                            required
                                            id="avatar"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                            style={{ borderWidth: "0px 0px 3px 0px", borderColor: "green", backgroundColor: "transparent", width: '60%' }}
                                        />
                                    </Grid> */}
                                    {/* Button */}
                                    <Grid item style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <Button
                                            variant="contained"
                                            endIcon={<ArrowForwardIcon />}
                                            onClick={handleClickSignUp}
                                            title="Click to sign in"
                                            style={{ backgroundColor: "green" }}
                                        >
                                            Sign Up
                                        </Button>
                                    </Grid>

                                    <Grid item>
                                        <Link
                                            to="/login"
                                            style={{
                                                display: 'flex', textAlign: 'center',
                                                justifyContent: 'center',
                                                color: 'green',
                                                fontSize: '15px',
                                            }}
                                            title="Click to log in">
                                            <span className="link-text">If you already have an account, log in here</span>
                                        </Link>
                                    </Grid>

                                </Grid>
                            </form>
                        </Paper>
                    </Grid>
                    <Dialog open={openDialog} onClose={() => handleCloseDialog("")} disableEscapeKeyDown={true}>
                        <DialogTitle>Confirm</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Confirm account registration
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => handleCloseDialog("Yes")} className="icon-button">Yes</Button>
                            <Button onClick={() => handleCloseDialog("No")} className="icon-button">No</Button>
                        </DialogActions>
                    </Dialog>
                </Container>
            </div>
        )
    }
}