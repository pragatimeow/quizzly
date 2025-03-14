import React from "react";
import { Link } from "react-router-dom";
import { Box, Button, Container, Typography } from "@mui/material";
import styled from "styled-components";

import backgroundImage from "./quizzly.svg";

const MainContainer = styled(Container)`
    && {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
            min-height: 100vh;
            background-image: url(${backgroundImage});
            background-size: cover;
            background-position: center;
        text-align: center;
        padding: 4rem 2rem;
        color: #333; // Dark text for readability
    }
`;

const Title = styled(Typography)`
    && {
        font-size: 3.5rem;
        font-weight: 700;
        margin-bottom: 1rem;
        color: #2e3192; // Quizizz blue
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
        background-color: #673ab7; // Quizizz purple
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
            background-color: #f3e5f5; // Light purple hover
        }
    }
`;



const MainPage = () => {
    return (
        <MainContainer maxWidth="xl">
            <Title variant="h1"> Free Quizzes for Developers</Title>
            <Subtitle variant="body1">
                "I had no idea Quizzly could do that." - Almost everybody
            </Subtitle>
            <Typography variant="body2" gutterBottom>
                Create and deliver bell-to-bell resources that meet the needs of every developer.
            </Typography>
            <ButtonContainer>
                <PrimaryButton component={Link} to="/register" variant="contained">
                    Sign up for free
                </PrimaryButton>
                <SecondaryButton component={Link} to="/login" variant="outlined">
                    Login from Here
                </SecondaryButton>
            </ButtonContainer>
        
        </MainContainer>
    );
};

export default MainPage;