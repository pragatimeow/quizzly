// --- src/contexts/AuthContext.jsx ---
import React, { createContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup,
    GithubAuthProvider,
} from "firebase/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });
        return unsubscribe;
    },);

    const register = async (email, password, displayName) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password,
            );
            // Update the user's profile with the display name
            await updateProfile(userCredential.user, { displayName });
            return userCredential;
        } catch (error) {
            throw error; // Re-throw the error to be handled by the component
        }
    };

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logout = () => {
        return signOut(auth);
    };

    const googleSignIn = () => {
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider);
    };

    const githubSignIn = async () => {
        try {
            const provider = new GithubAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const credential = GithubAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;

            // Fetch user's email from GitHub API
            const response = await fetch('https://api.github.com/user/emails', {
                headers: {
                    Authorization: `token ${token}`,
                },
            });
            const emails = await response.json();
            const primaryEmail = emails.find(email => email.primary);

            if (primaryEmail) {
                // Update user's profile with the email
                await result.user.updateProfile({ email: primaryEmail.email });
            } else {
                console.error('No primary email found for GitHub user.');
                // Handle the case where no primary email is found, e.g., prompt the user
            }
            return result; // return result after updating the profile
        } catch (error) {
            console.error("GitHub Sign In failed:", error);
            throw error; // Propagate the error
        }
    };
    const value = {
        currentUser,
        register,
        login,
        logout,
        googleSignIn,
        githubSignIn, 
        loading,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};