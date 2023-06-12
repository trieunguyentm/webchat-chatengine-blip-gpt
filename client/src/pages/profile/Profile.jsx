import React from "react";
import { Box, Paper, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import Cookies from "js-cookie";
import { Navigate, useParams } from "react-router-dom";
import HeaderTab from "@/components/headerTab/HeaderTab";
import LayoutProfile from "./LayoutProfile";
import LayoutAccount from "./LayoutAccount";

export default function Profile(props) {
    const user = Cookies.get('username');
    const linkAvatar = Cookies.get('linkAvatar');
    const [value, setValue] = React.useState('1');

    const obj = useParams();
    const idProfile = obj.id;

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const isLogin = (Cookies.get('isLogin') === 'true');

    if (!isLogin) {
        return <Navigate replace to="/login" />
    }
    else {
        return (
            <>
                <div>
                    <HeaderTab linkAvatar={linkAvatar} user={user} />
                </div>
                <div style={{ paddingLeft: "20px", paddingRight: "20px", paddingTop: '20px' }}>
                    <Paper sx={{ paddingLeft: "20px", paddingRight: "20px" }}>
                        <Box sx={{ typography: "body1", backgroundColor: "white" }}>
                            <TabContext value={value}>
                                <Box sx={{ borderBottom: 1 }}>
                                    <TabList onChange={handleChange}>
                                        <Tab label="Profile" className="icon-button" value="1" />
                                        <Tab label="Account" className="icon-button" value="2" style={{ display: `${idProfile === Cookies.get('id') ? "" : "none"}` }} />
                                    </TabList>
                                </Box>
                                <TabPanel value="1">
                                    <LayoutProfile id={props.id} />
                                </TabPanel>
                                <TabPanel value="2">
                                    <LayoutAccount id={props.id} />
                                </TabPanel>
                            </TabContext>
                        </Box>
                    </Paper>
                </div>
            </>
        );
    }
}