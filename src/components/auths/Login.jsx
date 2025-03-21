import React, { useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
    Box,
    TextField,
    Button,
    Typography,
    Link,
    Grid,
    Paper,
    
} from "@mui/material";
import styled from "styled-components";
import logo from '../../assets/quizzly.png';
import backgroundImage from "../../assets/main-bg.jpg"; // Option from current branch

const LoginContainer = styled(Grid)`
    && {
    
          min-height: 100vh;
            min-width: 100vw;
            background-image: url(${backgroundImage});
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
        color: #333;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 40px;
    }
`;

const ContentContainer = styled(Grid)`
    && {
        display: flex;
        align-items: center;
    }
`;

const FormContainer = styled(Paper)`
    && {
        padding: 40px;
        background: linear-gradient(135deg, #FFF0F5, #FFFFFF);
        border-radius: 12px;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        width: 400px;
    }
`;

const Title = styled(Typography)`
    && {
        font-weight: bold;
        margin-bottom: 1rem;
        font-size: 40px;
        text-align: left;
    }
`;

const Form = styled(Box)`
    && {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }
`;

const SubmitButton = styled(Button)`
    && {
        background-color: #F0AD4E;
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        padding: 12px 24px;
        &:hover {
            background-color: #EEA236;
        }
    }
`;

const SocialButton = styled(Button)`
    && {
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        padding: 12px 24px;
        justify-content: center;
        background-color: white;
        color: #333;
        border: 1px solid #F0AD4E;
        &:hover {
            background-color: #F9F9F9;
        }
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
            navigate("/home");
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await googleSignIn();
            navigate("/home");
        } catch (error) {
            console.error("Google Sign In failed:", error);
        }
    };

    return (
        <LoginContainer container>
            <ContentContainer item xs={12} md={10} lg={8}>
                <Grid item xs={12} md={6} sx={{ margin: '0 auto' }}>
                    <FormContainer>
                    <Box display="flex" justifyContent="left" alignItems="left" marginBottom="1rem">
                            <img src={logo} alt="Quizzly Logo" style={{ width: '30px', height: '30px', marginRight: '8px' }}/>
                            <Typography variant="h5">Quizzly</Typography>
                        </Box>
                        <Title variant="h5">Sign in</Title>
                        <Form component="form" onSubmit={handleSubmit}>
                            <Typography variant="body2" sx={{ mb: -1, textAlign: 'left', fontFamily: 'Bebas Neue', fontSize: '25px' }}>Email</Typography>
                            <TextField label="" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required fullWidth variant="outlined" />
                            <Typography variant="body2" sx={{ mb: -1, textAlign: 'left', fontFamily: 'Bebas Neue', fontSize: '25px' }}>Password</Typography>
                            <TextField label="" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required fullWidth variant="outlined" />
                            <SubmitButton type="submit" style={{ backgroundColor: 'black', color: 'whitesmoke', fontSize: '15px', fontFamily: 'monospace'}} variant="contained" fullWidth>Sign in</SubmitButton>
                        </Form>
                        <Typography variant="body2" style={{ marginTop: '1rem', marginBottom: '1rem',textAlign: 'center', }}>
                            <Link component={RouterLink} to="/forgot-password" style={{ color: 'black', fontSize: '20px' }}>Forgot Password?</Link>
                        </Typography>
                        <SocialButton variant="outlined" style={{ backgroundColor: 'black', color: 'whitesmoke', fontSize: '15px', fontFamily: 'monospace'}} startIcon={<img src="https://img.icons8.com/color/16/null/google-logo.png" alt="Google logo" />} onClick={handleGoogleSignIn} fullWidth>Sign in with Google</SocialButton>
                        <Typography variant="body2" style={{ marginTop: '1rem', textAlign: 'center' }}>
                            Don't have an account? <Link component={RouterLink} to="/register" style={{ color: 'black', fontSize: '15px', }}>Register</Link>
                        </Typography>
                    </FormContainer>
                </Grid>
            </ContentContainer>
        </LoginContainer>
    );
};

export default Login;