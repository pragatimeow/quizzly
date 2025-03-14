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

const LoginContainer = styled(Container)`
    && {
        background-color: rgba(255, 255, 255, 0.8);
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

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login, googleSignIn } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate("/");
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await googleSignIn();
            navigate("/");
        } catch (error) {
            console.error("Google Sign In failed:", error);
        }
    };

    return (
        <div style={{
            backgroundImage: "url('./components/authPages/R.jfif')",
            backgroundSize: 'cover',
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <LoginContainer maxWidth="xs">
                <Title variant="h5" gutterBottom>
                    Login
                </Title>
                <Form component="form" onSubmit={handleSubmit}>
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
                        Login
                    </SubmitButton>
                    <Typography variant="body2">
                        Don't have an account?{" "}
                        <Link component={RouterLink} to="/register">
                            Register
                        </Link>
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        <Link component={RouterLink} to="/forgot-password">
                            Forgot Password?
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
                        Login with Google
                    </SocialButton>
                </Box>
            </LoginContainer>
        </div>
    );
};

export default Login;