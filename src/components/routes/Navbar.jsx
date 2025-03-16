import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { AppBar, Toolbar, Typography, Button, IconButton, Avatar, Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import styled from "styled-components";
import Profile from './profile.png';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import HelpOutline from '@mui/icons-material/HelpOutline';
import ExitToApp from '@mui/icons-material/ExitToApp';

const NavbarContainer = styled(AppBar)`
    && {
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        position: fixed;
        top: 0;
        width: 100%;
        background-color: #661EAE;
    }
`;

const Test = styled(Button)`
    && {
        color: white;
    }
    &:hover {
        background-color: white;
        color: #661EAE;
    }
`;

const Navbar = () => {
    const { currentUser, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <NavbarContainer position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <Link to={currentUser ? "/home" : "/"} style={{ textDecoration: 'none', color: 'white' }}>
                        Quizzly
                    </Link>
                </Typography>
                {currentUser && location.pathname !== "/login" ? (
                    <>
                      
                        <Menu
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                            
                        >
                            <MenuItem sx={{ color: 'black' }}>
                                <Avatar src={Profile} sx={{ width: 30, height: 30, marginRight: 1 }}/>
                                <div>
                                    <Typography style={{ fontFamily: "Figtree", fontSize: '15px' }} variant="subtitle2">{currentUser.displayName || 'User'}</Typography>
                                    <Typography style={{ fontFamily: "Figtree", fontSize: '15px'  }} variant="caption">{currentUser.email}</Typography>
                                </div>
                            </MenuItem>
                            <MenuItem onClick={() => { navigate('/settings'); handleClose(); }}>
                                <ListItemIcon>
                                    <SettingsOutlinedIcon />
                                </ListItemIcon>
                                <ListItemText  primary="settings" />
                            </MenuItem>
                            <MenuItem onClick={() => { navigate('/help'); handleClose(); }}>
                                <ListItemIcon>
                                    <HelpOutline />
                                </ListItemIcon>
                                <ListItemText primary="Help" />
                            </MenuItem>
                            <MenuItem onClick={() => { handleLogout(); handleClose(); }}>
                                <ListItemIcon>
                                    <ExitToApp />
                                </ListItemIcon>
                                <ListItemText primary="Logout" />
                            </MenuItem>
                        </Menu>
                        <Test style={{ fontFamily: "Figtree" }} component={Link} to="/quiz" variant="text">
                            Quizzes
                        </Test>
                        <Test style={{ fontFamily: "Figtree" }} component={Link} to="/create-quiz" variant="text">
                            Create Quiz
                        </Test>
                        <Test style={{ fontFamily: "Figtree" }} component={Link} to="/my-quizzes" variant="text">
                            My Quizzes
                        </Test>
                        <IconButton onClick={handleClick} sx={{ color: 'white' }}>
                            <Avatar src={Profile} alt="Profile" sx={{ width: 30, height: 30 }} />
                        </IconButton>
                    </>
                ) : (
                    <>
                        <Test style={{ fontFamily: "Figtree" }}component={Link} to="/login" variant="text">
                            Login
                        </Test>
                        <Test style={{ fontFamily: "Figtree" }} component={Link} to="/register" variant="text">
                            Register
                        </Test>
                    </>
                )}
            </Toolbar>
        </NavbarContainer>
    );
};

export default Navbar;