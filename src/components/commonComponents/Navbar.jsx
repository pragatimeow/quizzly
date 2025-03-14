import React, { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import styled from "styled-components";

const NavbarContainer = styled(AppBar)`
    && {
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
`;

const Navbar = () => {
    const { currentUser, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <NavbarContainer position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <Link to={currentUser ? "/profile" : "/"} style={{ textDecoration: 'none', color: 'white' }}>
                        Quizzly
                    </Link>
                </Typography>
                {currentUser && location.pathname !== "/login" ? (
                    <>
                        <Button color="inherit" component={Link} to="/profile">
                            Profile
                        </Button>
                        <Button color="inherit" component={Link} to="/quizFeatures">
                            Quizzes
                        </Button>
                        <Button color="inherit" component={Link} to="/create-quiz">
                            Create Quiz
                        </Button>
                        <Button color="inherit" component={Link} to="/my-quizzes">
                            My Quizzes
                        </Button>
                        <Button color="inherit" onClick={handleLogout}>
                            Logout
                        </Button>
                    </>
                ) : (
                    <>
                        <Button color="inherit" component={Link} to="/login">
                            Login
                        </Button>
                        <Button color="inherit" component={Link} to="/register">
                            Register
                        </Button>
                    </>
                )}
            </Toolbar>
        </NavbarContainer>
    );
};

export default Navbar;