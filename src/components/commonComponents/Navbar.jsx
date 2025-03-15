import React, { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import styled from "styled-components";

const NavbarContainer = styled(AppBar)`
    && {
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        position:fixed;
        top:0;
        width:100%;
        background-color:#661EAE;
    }

`;

const Test = styled(Button)`
    &&{
        color:white;
    }
    &:hover{
        background-color:white;
        color:#661EAE;
    }
`

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
                    <Test component={Link} to="/profile" variant="text">
                        Profile
                    </Test>
                    <Test component={Link} to="/quizFeatures" variant="text">
                        Quizzes
                    </Test>
                    <Test  component={Link} to="/create-quiz" variant="text">
                        Create Quiz
                    </Test>
                    <Test component={Link} to="/my-quizzes" variant="text">
                        My Quizzes
                    </Test>
                    <Test onClick={handleLogout}>
                        Logout
                    </Test>
                </>
                ) : (
                <>
                    <Test component={Link} to="/login" variant="text">
                        Login
                    </Test>
                    <Test component={Link} to="/register" variant="text">
                        Register
                    </Test>
                </>
                
                )}
            </Toolbar>
        </NavbarContainer>
    );
};

export default Navbar;