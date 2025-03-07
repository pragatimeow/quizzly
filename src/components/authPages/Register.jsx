import React, { useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
    Container,
    Box,
    TextField,
    Button,
    Typography,
    Link,
} from "@mui/material";
import styled from "styled-components";

const RegisterContainer = styled(Container)`
    && {
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        padding: 32px;
        margin-top: 8rem;
        text-align: center;
    }
`;

const Title = styled(Typography)`
    && {
        font-weight: bold;
        margin-bottom: 1rem;
    }
`;

const Form = styled(Box)`
    && {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
`;

const SubmitButton = styled(Button)`
    && {
        background-color: #f0ad4e;
        color: white;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        &:hover {
            background-color: #eea236;
        }
    }
`;

const SocialButton = styled(Button)`
    && {
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
`;

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");
    const { register, googleSignIn } = useContext(AuthContext); // Import googleSignIn
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(email, password, displayName);
            navigate("/profile");
        } catch (error) {
            console.error("Registration failed:", error);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await googleSignIn();
            navigate("/profile");
        } catch (error) {
            console.error("Google Sign In failed:", error);
        }
    };

    return (
        <RegisterContainer maxWidth="xs">
            <Title variant="h5" gutterBottom>
                Register
            </Title>
            <Form component="form" onSubmit={handleSubmit}>
                <TextField
                    label="Display Name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                    fullWidth
                />
                <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    fullWidth
                />
                <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    fullWidth
                />
                <SubmitButton type="submit" variant="contained" fullWidth>
                    Register
                </SubmitButton>
                <Typography variant="body2">
                        Already Have a Account?{" "}
                        <Link component={RouterLink} to="/login">
                            Login
                        </Link>
                    </Typography>
            </Form>
            <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1 }}>
                <SocialButton
                    variant="outlined"
                    startIcon={<img src="https://img.icons8.com/color/16/null/google-logo.png" alt="Google logo" />}
                    onClick={handleGoogleSignIn}
                    fullWidth
                >
                    Register with Google
                </SocialButton>
            </Box>
        </RegisterContainer>
    );
};

export default Register;