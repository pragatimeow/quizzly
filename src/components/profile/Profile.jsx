import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
    Avatar,
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Paper,
    Divider,
} from "@mui/material";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import styled from "styled-components";

const ProfileContainer = styled(Container)`
    && {
        background-color: #f5f5f5;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        padding: 2rem;
        margin-top: 4rem;
    }
`;


const StyledButton = styled(Button)`
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

const Profile = () => {
    const { currentUser, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [displayName, setDisplayName] = useState(currentUser?.displayName || "");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (currentUser) {
                    const userDocRef = doc(db, "users", currentUser.uid);
                    const userDocSnap = await getDoc(userDocRef);

                    if (userDocSnap.exists()) {
                        setDescription(userDocSnap.data().description || "");
                    }
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [currentUser]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
            setErrorMessage("Logout failed. Please try again.");
        }
    };

    const handleEditProfile = () => {
        setIsEditing(true);
    };

    const handleProfileUpdate = async () => {
        try {
            await updateProfile(currentUser, {
                displayName: displayName,
            });

            const userDocRef = doc(db, "users", currentUser.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                await updateDoc(userDocRef, {
                    description: description,
                });
            } else {
                await setDoc(userDocRef, {
                    description: description,
                });
            }

            setIsEditing(false);
        } catch (error) {
            console.error("Profile update failed:", error);
            setErrorMessage("Profile update failed. Please try again.");
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (errorMessage) {
        return <div>{errorMessage}</div>;
    }

    return (
        <ProfileContainer maxWidth="sm" sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ p: 4, bgcolor: "background.paper" }}>
                <Box sx={{ mb: 4, textAlign: "center" }}>
                    {isEditing ? (
                        <TextField
                            label="Display Name"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            fullWidth
                            sx={{ mt: 2 }}
                        />
                    ) : (
                        <>
                            <Avatar
                                alt="User Avatar"
                                src={"https://wallpaperaccess.com/full/2384073.jpg"}
                                sx={{ width: 80, height: 80, mb: 1 }}
                            />
                            <Typography variant="h5" component="div">
                                {displayName || "User"}
                            </Typography>
                        </>
                    )}
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ mb: 4 }}>
                    <Typography variant="body1" gutterBottom>
                        Email: {currentUser.email}
                    </Typography>
                    {isEditing ? (
                        <TextField
                            label="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            multiline
                            rows={4}
                            fullWidth
                        />
                    ) : (
                        <Typography variant="body2">{description}</Typography>
                    )}
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {isEditing ? (
                        <StyledButton variant="contained" onClick={handleProfileUpdate}>
                            Save Changes
                        </StyledButton>
                    ) : (
                        <Button variant="outlined" onClick={handleEditProfile}>
                            Edit Profile
                        </Button>
                    )}
                    <Button variant="contained" color="error" onClick={handleLogout}>
                        Logout
                    </Button>
                </Box>
            </Paper>
        </ProfileContainer>
    );
};

export default Profile;