import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import {
    Container,
    Box,
    TextField,
    Button,
    Typography,
} from "@mui/material";
import styled from "styled-components";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../../assets/quizzly.png';
const ForgotPasswordContainer = styled(Container)`
    && {
        background-color: rgba(255, 255, 255, 0.8);
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        padding: 32px;
        margin-top: 8rem;
        text-align: center;
    }
`;

const Form = styled(Box)`
    && {
        display: flex;
        flex-direction: column;
        gap: 1.5rem; /* Increased gap for better spacing */
    }
`;


const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            await sendPasswordResetEmail(auth, email);
            toast.success("Password reset email sent. Please check your inbox.", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            // Introduce a delay before navigating to the login page
            setTimeout(() => {
                navigate("/login");
            }, 3500); // 3.5 seconds (slightly longer than autoClose)
        } catch (error) {
            console.error("Forgot password failed:", error);
            toast.error("Failed to send password reset email. Please check your email or try again.", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
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
            <ForgotPasswordContainer maxWidth="xs">
            <Box display="flex" justifyContent="left" alignItems="left" marginBottom="1rem">
                            <img src={logo} alt="Quizzly Logo" style={{ width: '30px', height: '30px', marginRight: '8px' }}/>
                            <Typography variant="h5">Quizzly</Typography>
                        </Box>
                <Typography sx={{ fontWeight: 'bold', marginBottom: '1rem', fontSize: '40px', textAlign: 'left' }} variant="h5" gutterBottom>
                    Forgot Password
                </Typography>
                <Form component="form" onSubmit={handleResetPassword}>
                    <Typography variant="body2" sx={{ mb: -1, textAlign: 'left', fontFamily: 'Bebas Neue', fontSize: '25px' }}>
                        Email
                    </Typography>
                    <TextField
                        label=""
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        fullWidth
                        variant="outlined" 
                    />
                    <Button style={{ backgroundColor: 'black', color: 'whitesmoke', fontSize: '15px', fontFamily: 'monospace'}} type="submit" variant="contained" fullWidth>
                        Send Reset Link
                    </Button>
                </Form>
                <ToastContainer />
            </ForgotPasswordContainer>
        </div>
    );
};

export default ForgotPassword;