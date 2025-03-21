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

const RegisterContainer = styled(Grid)`
    && {
         min-height: 100vh;
            min-width: 100vw;
            background-image: url(${backgroundImage});
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
        color: #333; // Dark text
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
        background: linear-gradient(135deg, #FFF0F5, #FFFFFF); // Gradient background
        border-radius: 12px;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1); // Soft shadow
        width: 400px;
    }
`;

const Title = styled(Typography)`
    && {
        font-weight: bold;
        margin-bottom: 1rem;
        text-align: left;
        font-size: 40px;
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
        background-color: #F0AD4E; // Orange button
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
        background-color: white; // White social button
        color: #333;
        border: 1px solid #F0AD4E;
        &:hover {
            background-color: #F9F9F9;
        }
    }
`;

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");
    const { register, googleSignIn } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(email, password, displayName);
            navigate("/home");
        } catch (error) {
            console.error("Registration failed:", error);
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
        <RegisterContainer container>
            <ContentContainer item xs={12} md={10} lg={8}>
                <Grid item xs={12} md={6} sx={{ margin: '0 auto' }}>
                    <FormContainer>
                        <Box display="flex" justifyContent="left" alignItems="left" marginBottom="1rem">
                            <img src={logo} alt="Quizzly Logo" style={{ width: '30px', height: '30px', marginRight: '8px' }} />
                            <Typography variant="h5">Quizzly</Typography>
                        </Box>
                        <Title variant="h5">Sign Up</Title>
                        <Form component="form" onSubmit={handleSubmit}>
                            <Typography variant="body2" sx={{ mb: -1, textAlign: 'left', fontFamily: 'Bebas Neue', fontSize: '25px' }}>Full Name</Typography>
                            <TextField label="" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required fullWidth variant="outlined" />
                            <Typography variant="body2" sx={{ mb: -1, textAlign: 'left', fontFamily: 'Bebas Neue', fontSize: '25px' }}>Email</Typography>
                            <TextField label="" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required fullWidth variant="outlined" />
                            <Typography variant="body2" sx={{ mb: -1, textAlign: 'left', fontFamily: 'Bebas Neue', fontSize: '25px' }}>Password</Typography>
                            <TextField label="" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required fullWidth variant="outlined" />
                            <SubmitButton type="submit"  style={{ marginBottom: '1rem', backgroundColor: 'black', color: 'whitesmoke', fontSize: '15px', fontFamily: 'monospace'}}  variant="contained" fullWidth>Register</SubmitButton>
                        </Form>
                        <SocialButton variant="outlined"  style={{ backgroundColor: 'black', color: 'whitesmoke', fontSize: '15px', fontFamily: 'monospace'}} startIcon={<img src="https://img.icons8.com/color/16/null/google-logo.png" alt="Google logo" />} onClick={handleGoogleSignIn} fullWidth>Sign Up with Google</SocialButton>

                        <Typography variant="body2" style={{ marginTop: '1rem', textAlign: 'center' }}>
                            Already Have a Account? <Link component={RouterLink} to="/login" style={{ color: 'black' }}>Login</Link>
                        </Typography>
                    </FormContainer>
                </Grid>
            </ContentContainer>
        </RegisterContainer>
    );
};

export default Register;