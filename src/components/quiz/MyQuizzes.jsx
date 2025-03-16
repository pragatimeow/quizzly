import React, { useState, useEffect, useContext, useCallback } from 'react';
import { db } from '../../firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { AuthContext } from '../../contexts/AuthContext';
import { Container, Grid, Card, CardMedia, CardContent, Typography, IconButton, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { Delete, Edit } from '@mui/icons-material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components'; 

const StyledContainer = styled(Container)`
    && {
        padding-top: 5rem;


    }
`;

const MyQuizzes = () => {
    const [myQuizzes, setMyQuizzes] = useState([]);
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const fetchMyQuizzes = useCallback(async () => {
        if (currentUser) {
            const quizzesRef = collection(db, "quizzes");
            const q = query(quizzesRef, where("creatorId", "==", currentUser.uid));
            const querySnapshot = await getDocs(q);
            const quizzes = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMyQuizzes(quizzes);
        }
    }, [currentUser]);

    useEffect(() => {
        fetchMyQuizzes();
    }, [fetchMyQuizzes]);

    const handleDeleteQuiz = async (quizId) => {
        try {
            await deleteDoc(doc(db, "quizzes", quizId));
            fetchMyQuizzes();
            navigate('/my-quizzes');
            toast.success('Quiz deleted successfully!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } catch (error) {
            console.error("Error deleting quiz:", error);
            toast.error('Failed to delete quiz. Please try again.', {
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
        <StyledContainer maxWidth="md"> 
            <Typography variant="h4" align="center" gutterBottom>
                My Quizzes
            </Typography>
            {myQuizzes.length > 0 ? (
                <Grid container spacing={3}>
                    {myQuizzes.map(quiz => (
                        <Grid item xs={12} sm={6} md={4} key={quiz.id}>
                            <Card>
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={'https://quizizz.com/media/resource/gs/quizizz-media/quizzes/ecddb5de-3ec1-48d3-a42f-14c9af23d4e4'}
                                    alt={quiz.title}
                                />
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                        <Box>
                                            <Typography variant="subtitle1" component="div">
                                                <Link to={`/quiz-details/${quiz.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                    {quiz.title}
                                                </Link>
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Category: {quiz.category}
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <IconButton
                                                aria-label="edit"
                                                onClick={() => navigate(`/edit-quiz/${quiz.id}`)}
                                            >
                                                <Edit />
                                            </IconButton>
                                            <IconButton
                                                edge="end"
                                                aria-label="delete"
                                                onClick={() => handleDeleteQuiz(quiz.id)}
                                            >
                                                <Delete />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Typography variant="body1" align="center">You haven't created any quizzes yet.</Typography>
                )}
            <ToastContainer />
        </StyledContainer>
    );
};

export default MyQuizzes;