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

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate("/profile");
        } catch (error) {
            console.error("Login failed:", error);
            // TODO: Display error message to the user
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
            <Container
                maxWidth="xs"
                sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white background
                    borderRadius: "8px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    p: 4,
                    mt: 8,
                    textAlign: "center",
                }}
            >
                <Typography variant="h5" gutterBottom>
                    Login
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                    }}
                >
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
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                    >
                        Login
                    </Button>
                    <Typography variant="body2">
                        Don't have an account?{" "}
                        <Link component={RouterLink} to="/register">
                            Register
                        </Link>
                    </Typography>
                </Box>
            </Container>
        </div>
    );
};

export default Login;