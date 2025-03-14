// src/components/admin/AdminDashboard.jsx

import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs} from 'firebase/firestore';
import { Typography, Box } from '@mui/material';

const AdminDashboard = () => {
    const [userCount, setUserCount] = useState(0);
    const [quizCount, setQuizCount] = useState(0);

    useEffect(() => {
        const fetchCounts = async () => {
            const usersSnapshot = await getDocs(collection(db, 'users'));
            setUserCount(usersSnapshot.size);

            const quizzesSnapshot = await getDocs(collection(db, 'quizzes'));
            setQuizCount(quizzesSnapshot.size);
        };

        fetchCounts();
    }, []);

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
            <Typography variant="body1">Total Users: {userCount}</Typography>
            <Typography variant="body1">Total Quizzes: {quizCount}</Typography>
        </Box>
    );
};

export default AdminDashboard;