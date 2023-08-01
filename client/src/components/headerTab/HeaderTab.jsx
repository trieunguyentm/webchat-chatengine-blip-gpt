import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import MenuItem from "@mui/material/MenuItem";
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const settings = ["Profile", "Logout"];

function HeaderTab(props) {

    const navigate = useNavigate();

    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleClickHomeIcon = () => {
        navigate("/chat");
    }

    const handleClickUserMenu = (setting) => {
        if (setting === "Logout") {
            // Xử lý lưu trữ trong Cookies
            Cookies.set('isLogin', false);
            Cookies.remove('username');
            Cookies.remove('secret');
            Cookies.remove('linkAvatar');
            Cookies.remove('id');
            navigate("/login");
        }
        else {
            const url = `/${setting.toLowerCase().replace(" ", "_")}/${Cookies.get('id')}`;
            navigate(url);
        }
        handleCloseUserMenu();
    }

    return (
        <AppBar position="static" className="header-tab">
            <Container maxWidth="xl">
                <Toolbar>
                    {/* Icon Home */}
                    <IconButton onClick={handleClickHomeIcon} size="large" className="icon-button">
                        <HomeIcon sx={{ fontSize: '45px' }} />
                    </IconButton>
                    {/* Tạo Box, bao gồm Icon Avatar và các MenuItem hiển thị khi người dùng click vào */}
                    <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
                        <IconButton onClick={handleOpenUserMenu} sx={{ marginLeft: 'auto' }} className="icon-button">
                            <Avatar alt={`${props.user.toUpperCase()}`} src={`${props.linkAvatar}`} />
                        </IconButton>
                        <Menu
                            sx={{ mt: "45px" }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {settings.map((setting, index) => (
                                <MenuItem key={index} onClick={() => handleClickUserMenu(setting)}>
                                    <Typography
                                        textAlign="center"
                                    >
                                        {setting}
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar >
    );
}
export default HeaderTab;
