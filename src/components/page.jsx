import React, { useContext, } from "react";
import { Link } from "react-router-dom";
import {
    Box,
    Button,
    Container,
    Typography,

} from "@mui/material";
import styled from "styled-components";
import { AuthContext } from "../contexts/AuthContext";
import backgroundImage from "../assets/main-bg.jpg";

const MainContainer = styled(Container)`
    && {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        min-width: 100vw;
        background-image: url(${backgroundImage});
        background-size: cover;
        background-position: center;
        text-align: center;
        padding: 4rem 2rem;
        color: #333;
    }
`;

const Title = styled(Typography)`
    && {
        font-size: 3.5rem;
        font-weight: 700;
        margin-bottom: 1rem;
        color: #ffffff;
        line-height: 1.2;
    }
`;

const Subtitle = styled(Typography)`
    && {
        font-size: 1.2rem;
        margin-bottom: 2rem;
        color: #555;
    }
`;

const Last = styled(Typography)`
    && {
        font-size: 2rem;
    }
`;

const ButtonContainer = styled(Box)`
    && {
        display: flex;
        gap: 1rem;
        margin-top: 2rem;
    }
`;

const StyledButton = styled(Button)`
    && {
        padding: 1rem 2.5rem;
        font-size: 1rem;
        font-weight: 600;
        border-radius: 2rem;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        transition: transform 0.2s ease-in-out;
        &:hover {
            transform: translateY(-3px);
        }
    }
`;

const PrimaryButton = styled(StyledButton)`
    && {
        background-color: #673ab7;
        color: white;
        &:hover {
            background-color: #512da8;
        }
    }
`;

const SecondaryButton = styled(StyledButton)`
    && {
        background-color: transparent;
        border: 2px solid #673ab7;
        color: #673ab7;
        &:hover {
            background-color: #f3e5f5;
        }
    }
`;

const LoggedIn = () => {
    const { currentUser } = useContext(AuthContext);

    return (
        <MainContainer maxWidth="xl">
            <Title variant="h1">Welcome Back, {currentUser?.displayName || "Developer"}!</Title>
            <Subtitle variant="body1">
                <span style={{ fontSize: "3rem", fontWeight: "bolder" }}>"Ready to create some quizzes?"</span> <br /> <span>~Quizzly</span>
            </Subtitle>
            <hr style={{ width: "50%" }} />
            <Last variant="body2" gutterBottom>
                Create and deliver bell-to-bell resources <br /> that meet the needs of every developer.
            </Last>
            <ButtonContainer>
                <PrimaryButton component={Link} to="/create-quiz" variant="contained">
                    Create a Quiz
                </PrimaryButton>
                <SecondaryButton component={Link} to="/quiz" variant="outlined">
                    Check Out Quizzes
                </SecondaryButton>
            </ButtonContainer>
        </MainContainer>
    );
};

export default LoggedIn;