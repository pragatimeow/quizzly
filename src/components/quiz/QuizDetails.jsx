import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Container, Typography, List, ListItem, ListItemText, Box, Card, CardContent } from '@mui/material';

const QuizDetails = () => {
    const { quizId } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchQuizDetails = async () => {
            setIsLoading(true);
            try {
                const quizDocRef = doc(db, 'quizzes', quizId);
                const quizDocSnap = await getDoc(quizDocRef);

                if (quizDocSnap.exists()) {
                    setQuiz(quizDocSnap.data());
                } else {
                    console.log('Quiz not found!');
                }
            } catch (error) {
                console.error('Error fetching quiz details:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuizDetails();
    }, [quizId]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!quiz) {
        return <div>Quiz not found!</div>;
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Card>
                <CardContent>
                    <Typography variant="h4" gutterBottom>{quiz.title}</Typography>
                    <Typography variant="subtitle1" gutterBottom>Category: {quiz.category}</Typography>
                    <Typography variant="subtitle1" gutterBottom>Created By: {quiz.creatorName}</Typography>
                    <Typography variant="h6" gutterBottom>Questions:</Typography>
                    <List>
                        {quiz.questions.map((question, index) => (
                            <ListItem key={index} alignItems="flex-start">
                                <ListItemText
                                    primary={`${index + 1}. ${question.question}`}
                                    secondary={
                                        <Box>
                                            <Typography component="span" variant="body2" color="text.primary">
                                                Options: {question.options.join(', ')}
                                            </Typography>
                                            <br />
                                            <Typography component="span" variant="body2" color="text.secondary">
                                                Answer: {question.answer}
                                            </Typography>
                                        </Box>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                </CardContent>
            </Card>
        </Container>
    );
};

export default QuizDetails;