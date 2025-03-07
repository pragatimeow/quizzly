import React, { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import styled from "styled-components";

const Nav = styled.nav`
    background-color: #343a40;
    padding: 10px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const NavTitle = styled(Link)`
    color: white;
    text-decoration: none;
    font-weight: bold;
    font-size: 1.2rem;
`;

const NavLinks = styled.div`
    display: flex;
    align-items: center;
`;

const NavLink = styled(Link)`
    color: white;
    text-decoration: none;
    margin-left: 20px;
    &:hover {
        text-decoration: underline;
    }
`;

const LogoutButton = styled.button`
    background: none;
    border: none;
    color: white;
    margin-left: 20px;
    cursor: pointer;
    &:hover {
        text-decoration: underline;
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

    const adminEmails = ["spycatmeow24@gmail.com"];
    const isAdmin = currentUser && adminEmails.includes(currentUser.email);

    return (
        <Nav>
            <NavTitle to={currentUser ? "/profile" : "/"}>Quizzly</NavTitle>
            <NavLinks>
                {currentUser && location.pathname !== "/login" ? (
                    <>
                        <NavLink to="/profile">Profile</NavLink>
                        <NavLink to="/quizFeatures">Quizzes</NavLink>
                        {isAdmin && <NavLink to="/admin">Admin Panel</NavLink>}
                        <LogoutButton onClick={handleLogout}>
                            Logout
                        </LogoutButton>
                    </>
                ) : (
                    <>
                        <NavLink to="/login">Login</NavLink>
                        <NavLink to="/register">Register</NavLink>
                    </>
                )}
            </NavLinks>
        </Nav>
    );
};

export default Navbar;