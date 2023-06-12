import React, { useEffect, useState } from "react";
import { Box, Button, Grid, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import PersonIcon from '@mui/icons-material/Person';
import CreateIcon from '@mui/icons-material/Create';
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

export default function LayoutProfile(props) {

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");

    const [openChangeEmail, setOpenChangeEmail] = useState(false);
    const [openChangeFirstName, setOpenChangeFirstName] = useState(false);
    const [openChangeLastName, setOpenChangeLastName] = useState(false);

    const [canSave, setCanSave] = useState(false);

    const obj = useParams();
    const idProfile = obj.id;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://api.chatengine.io/users/${idProfile}/`, {
                    headers: {
                        'PRIVATE-KEY': import.meta.env.VITE_PROJECT_KEY,
                    },
                });
                setEmail(response.data.email)
                setUsername(response.data.username)
                setFirstName(response.data.first_name)
                setLastName(response.data.last_name)
            } catch (error) {
                toast.error("An error occurred while connecting to the server")
            }
        };

        fetchData();
    }, [idProfile])

    const handleClickChangeEmail = () => {
        if (!openChangeEmail) setCanSave(true);
        setOpenChangeEmail(!openChangeEmail);
    }

    const handleClickChangeFirstName = () => {
        if (!openChangeFirstName) setCanSave(true);
        setOpenChangeFirstName(!openChangeFirstName);
    }

    const handleClickChangeLastName = () => {
        if (!openChangeLastName) setCanSave(true);
        setOpenChangeLastName(!openChangeLastName)
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
            {/* Tiêu đề */}
            <Typography variant="h5" gutterBottom>
                <strong>Personal Information</strong>
            </Typography>
            {/* Nội dung */}
            <Grid container spacing={2} sx={{ paddingTop: '20px' }}>
                {/* Email */}
                <Grid container sx={{ paddingTop: '20px' }}>
                    <Grid item sx={{ paddingRight: '20px', paddingLeft: '15px' }} xs={1}>
                        <Typography><strong>Email</strong></Typography>
                    </Grid>
                    <Grid item sx={{ paddingRight: '20px' }} xs={3}>
                        <TextField
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailIcon />
                                    </InputAdornment>
                                ),
                            }}
                            variant="standard"
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={openChangeEmail ? false : true}
                            value={email}
                            sx={{ width: "100%" }}
                        />
                    </Grid>
                    <Grid item sx={{ paddingRight: '20px' }} xs={1} style={{ display: `${idProfile === Cookies.get('id') ? '' : 'none'}` }}>
                        <IconButton onClick={handleClickChangeEmail} className="icon-button">
                            {openChangeEmail ? <CreateIcon style={{ color: 'dodgerblue' }} /> : <CreateIcon />}
                        </IconButton>
                    </Grid>
                </Grid>
                {/* User name */}
                <Grid container sx={{ paddingTop: '20px' }}>
                    <Grid item sx={{ paddingRight: '20px', paddingLeft: '15px' }} xs={1}>
                        <Typography><strong>User name</strong></Typography>
                    </Grid>
                    <Grid item sx={{ paddingRight: '20px' }} xs={3}>
                        <TextField
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <BadgeIcon />
                                    </InputAdornment>
                                ),
                            }}
                            variant="standard"
                            onChange={(e) => setUsername(e.target.value)}
                            disabled
                            value={username}
                            sx={{ width: "100%" }}
                        />
                    </Grid>
                    {/* First name */}
                    <Grid container sx={{ paddingTop: '20px' }}>
                        <Grid item sx={{ paddingRight: '20px', paddingLeft: '15px' }} xs={1}>
                            <Typography><strong>First name</strong></Typography>
                        </Grid>
                        <Grid item sx={{ paddingRight: '20px' }} xs={3}>
                            <TextField
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                variant="standard"
                                onChange={(e) => setFirstName(e.target.value)}
                                disabled={openChangeFirstName ? false : true}
                                value={firstname}
                                sx={{ width: "100%" }}
                            />
                        </Grid>
                        <Grid item sx={{ paddingRight: '20px' }} xs={1} style={{ display: `${idProfile === Cookies.get('id') ? '' : 'none'}` }}>
                            <IconButton onClick={handleClickChangeFirstName} className="icon-button">
                                {openChangeFirstName ? <CreateIcon style={{ color: 'dodgerblue' }} /> : <CreateIcon />}
                            </IconButton>
                        </Grid>
                    </Grid>
                    {/* Last name */}
                    <Grid container sx={{ paddingTop: '20px' }}>
                        <Grid item sx={{ paddingRight: '20px', paddingLeft: '15px' }} xs={1}>
                            <Typography><strong>Last name</strong></Typography>
                        </Grid>
                        <Grid item sx={{ paddingRight: '20px' }} xs={3}>
                            <TextField
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                variant="standard"
                                onChange={(e) => setLastName(e.target.value)}
                                disabled={openChangeLastName ? false : true}
                                value={lastname}
                                sx={{ width: "100%" }}
                            />
                        </Grid>
                        <Grid item sx={{ paddingRight: '20px' }} xs={1} style={{ display: `${idProfile === Cookies.get('id') ? '' : 'none'}` }}>
                            <IconButton onClick={handleClickChangeLastName} className="icon-button">
                                {openChangeLastName ? <CreateIcon style={{ color: 'dodgerblue' }} /> : <CreateIcon />}
                            </IconButton>
                        </Grid>
                    </Grid>
                    {/* Save Button */}
                    <Grid container sx={{ paddingLeft: '20px', paddingTop: '20px' }}>
                        <Button
                            className="icon-button"
                            variant="contained"
                            // onClick={(event) => handleClickSave(event)}
                            title="Click to save"
                            disabled={canSave === true ? false : true}
                        >
                            Save
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
}
