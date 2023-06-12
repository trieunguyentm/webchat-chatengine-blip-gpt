import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, InputAdornment, TextField, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import PasswordIcon from '@mui/icons-material/Password';
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export default function LayoutAccount() {
    const navigate = useNavigate();
    // Thông tin của user
    const [email, setEmail] = useState("");
    const [userName, setUserName] = useState("");
    // Tạo form xác nhận mật khẩu 
    const [openForm, setOpenForm] = useState(false);
    // Mật khẩu mới
    const [newPassword, setNewPassword] = useState("");
    // openDialog
    const [openDialog, setOpenDialog] = useState(false);
    const [openDialogDeleteAccount, setOpenDialogDeleteAccount] = useState(false);
    // Lấy data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const id = Cookies.get('id')
                const response = await axios.get(`https://api.chatengine.io/users/${id}/`, {
                    headers: {
                        'PRIVATE-KEY': import.meta.env.VITE_PROJECT_KEY,
                    },
                });
                // console.log(response);
                setEmail(response.data.email)
                setUserName(response.data.username)
            } catch (error) {
                toast.error("An error occurred while connecting to the server")
            }
        };
        fetchData();
    }, [])

    const handleClickChangePassword = () => {
        setOpenForm(true);
    }

    const handleClickCancel = () => {
        setNewPassword("");
        setOpenForm(false);
    }

    const handleClickSave = () => {
        if (newPassword === "") {
            toast.info("You haven't entered a new password");
            return;
        }
        handleOpenDialog();
    }

    const handleClickDeleteAccount = () => {
        handleOpenDialogDeleteAccount();
    }

    const handleOpenDialog = () => {
        setOpenDialog(true);
    }

    const handleOpenDialogDeleteAccount = () => {
        setOpenDialogDeleteAccount(true);
    }

    const handleCloseDialog = async (choice) => {
        setOpenDialog(false);
        if (choice === "Yes") {
            try {
                const url = `https://api.chatengine.io/users/${Cookies.get('id')}/`
                const data = {
                    secret: newPassword
                }
                const headers = {
                    'PRIVATE-KEY': import.meta.env.VITE_PROJECT_KEY,
                }
                const response = await axios.patch(url, data, { headers })
                // Xử lý sau thành công
                if (response.data.is_authenticated) {
                    Cookies.set("secret", newPassword);
                    toast.success("Change password successfully")
                    setOpenForm(false);
                    setNewPassword("");
                }
            } catch (error) {
                toast.error("An error occurred while connecting to the server")
            }
        }
    }

    const handleCloseDialogDeleteAccount = async (choice) => {
        setOpenDialogDeleteAccount(false);
        if (choice === "Yes") {
            try {
                const url = `https://api.chatengine.io/users/${Cookies.get('id')}/`
                const headers = {
                    'PRIVATE-KEY': import.meta.env.VITE_PROJECT_KEY,
                }
                const response = await axios.delete(url, { headers })
                if (response.data.is_authenticated) {
                    toast.success("Delete account successfully");
                    Cookies.remove('id');
                    Cookies.remove('username');
                    Cookies.remove('secret');
                    Cookies.remove('linkAvatar');
                    Cookies.set('isLogin', false);
                    navigate('/login');
                }
            } catch (error) {
                toast.error("An error occurred while connecting to the server")
            }
        }
    }

    return (
        <Grid container>
            <Grid item xs={8} sx={{ borderRight: "2px solid grey" }}>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                    {/* Tiêu đề */}
                    <Typography variant="h5" gutterBottom>
                        <strong>Account Information</strong>
                    </Typography>
                    {/* Nội dung */}
                    <Grid container spacing={2} sx={{ paddingTop: '20px' }}>
                        {/* Email */}
                        <Grid container sx={{ paddingTop: '20px' }}>
                            <Grid item sx={{ paddingRight: '20px', paddingLeft: '15px' }} xs={2}>
                                <Typography><strong>Email</strong></Typography>
                            </Grid>
                            <Grid item sx={{ paddingRight: '20px' }} xs={5}>
                                <TextField
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <EmailIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                    variant="standard"
                                    disabled
                                    value={email}
                                    sx={{ width: "100%" }}
                                />
                            </Grid>
                        </Grid>
                        {/* User name */}
                        <Grid container sx={{ paddingTop: '20px' }}>
                            <Grid item sx={{ paddingRight: '20px', paddingLeft: '15px' }} xs={2}>
                                <Typography><strong>User name</strong></Typography>
                            </Grid>
                            <Grid item sx={{ paddingRight: '20px' }} xs={5}>
                                <TextField
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <BadgeIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                    variant="standard"
                                    disabled
                                    value={userName}
                                    sx={{ width: "100%" }}
                                />
                            </Grid>
                        </Grid>
                        {/* Change password button */}
                        {
                            !openForm && (
                                <Grid
                                    container
                                    sx={{ paddingLeft: '20px', paddingTop: '20px' }}
                                >
                                    <Button
                                        className="icon-button"
                                        variant="contained"
                                        onClick={(event) => handleClickChangePassword(event)}
                                        title="Click to change password"
                                    >
                                        Change password
                                    </Button>
                                </Grid>
                            )
                        }
                        {
                            // Hiển thị form nhập mật khẩu mới
                            openForm && (
                                <>
                                    <Grid container sx={{ paddingTop: '20px' }}>
                                        <Grid item sx={{ paddingRight: '20px', paddingLeft: '15px' }} xs={2}>
                                            <Typography><strong>New password</strong></Typography>
                                        </Grid>
                                        <Grid item sx={{ paddingRight: '20px' }} xs={3}>
                                            <TextField
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <PasswordIcon />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                type="password"
                                                variant="standard"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                sx={{ width: "100%" }}
                                            />
                                        </Grid>
                                        <Grid container sx={{ paddingTop: '20px', paddingLeft: '20px' }}>
                                            <Grid item>
                                                <Button
                                                    className="icon-button"
                                                    variant="contained"
                                                    onClick={handleClickSave}
                                                    title="Click to save"
                                                    sx={{ marginRight: '20px' }}
                                                >
                                                    Save
                                                </Button>
                                            </Grid>
                                            <Grid item>
                                                <Button
                                                    className="icon-button"
                                                    variant="contained"
                                                    onClick={handleClickCancel}
                                                    title="Click to cancel"
                                                >
                                                    Cancel
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </>
                            )
                        }
                    </Grid>
                    <Dialog open={openDialog} onClose={() => handleCloseDialog("")} disableEscapeKeyDown={true}>
                        <DialogTitle>Confirm</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Confirm change password
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => handleCloseDialog("Yes")} className="icon-button">Yes</Button>
                            <Button onClick={() => handleCloseDialog("No")} className="icon-button">No</Button>
                        </DialogActions>
                    </Dialog>
                </Box>
            </Grid>
            <Grid item xs={4}>
                <Box sx={{ display: "flex", flexDirection: "column", paddingLeft: '10px' }}>
                    {/* Delete Account */}
                    <Typography variant="h5" gutterBottom>
                        <strong>Delete Account</strong>
                    </Typography>
                    <Box sx={{ paddingTop: '20px' }}>
                        <p>After deleting the account, it will not be possible to recover it.</p>
                    </Box>
                    <Box sx={{ paddingTop: '20px' }}>
                        <Button
                            className="icon-button"
                            variant="contained"
                            onClick={handleClickDeleteAccount}
                            title="Click to delete account"
                            sx={{ backgroundColor: "red" }}
                        >
                            Delete Account
                        </Button>
                    </Box>
                    <Dialog open={openDialogDeleteAccount} onClose={() => handleCloseDialogDeleteAccount("")} disableEscapeKeyDown={true}>
                        <DialogTitle>Confirm</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Confirm delete account, After deleting the account, it will not be possible to recover it
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => handleCloseDialogDeleteAccount("Yes")} className="icon-button">Yes</Button>
                            <Button onClick={() => handleCloseDialogDeleteAccount("No")} className="icon-button">No</Button>
                        </DialogActions>
                    </Dialog>
                </Box>
            </Grid>
        </Grid>

    )
}