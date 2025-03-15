import React, { useState, useEffect, useCallback } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import {
    Container,
    Typography,
    Grid,
    List,
    ListItem,
    ListItemText,
} from "@mui/material";
import { Link } from "react-router-dom";
import styled from "styled-components";

const QuizListContainer = styled(Container)`
    && {
        padding: 2rem;
        min-height: 100vh;
    }
`;

const CategorySection = styled.div`
    background-color: white;
    padding: 2rem;
    margin-bottom: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }
`;

const CategoryTitle = styled(Typography)`
    && {
        font-weight: 700;
        margin-bottom: 1.5rem;
        color: #333;
        letter-spacing: 0.5px;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
    }
`;

const QuizItem = styled(ListItem)`
    && {
        transition: background-color 0.3s ease;
        border-radius: 8px;
        padding: 1rem;
        margin-bottom: 0.5rem;

        &:hover {
            background-color: #f0f0f0;
        }
    }
`;

const QuizList = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [availableCategories, setAvailableCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchQuizzes = useCallback(async () => {
        setIsLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, "quizzes"));
            const fetchedQuizzes = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setQuizzes(fetchedQuizzes);

            const categoryQuerySnapshot = await getDocs(collection(db, "categories"));
            const fetchedCategories = categoryQuerySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setAvailableCategories(fetchedCategories);

        } catch (error) {
            console.error("Error fetching quizzes:", error);
        } finally {
            setIsLoading(false);
        }
    }, [setQuizzes, setAvailableCategories]);

    useEffect(() => {
        fetchQuizzes();
    }, [fetchQuizzes]);

    return (
        <QuizListContainer maxWidth="lg" sx={{ mt: 4 }}>
            <Typography
                variant="h4"
                align="center"
                gutterBottom
                style={{
                    fontFamily: 'Montserrat',
                    fontWeight: 600,
                    color: '#2c3e50',
                    backgroundColor: 'transparent',
                }}
            >
                Quizzes
            </Typography>

            {isLoading ? (
                <Typography variant="body1">Loading quizzes...</Typography>
            ) : (
                <Grid container spacing={3}>
                    {availableCategories.map((cat) => (
                        <Grid item xs={12} sm={6} md={4} key={cat.id}>
                            <CategorySection>
                                <CategoryTitle variant="h6" component="div">
                                    {cat.name}
                                </CategoryTitle>
                                <List>
                                    {quizzes
                                        .filter((quiz) => quiz.category === cat.name)
                                        .map((quiz, index) => (
                                            <QuizItem key={quiz.id} component={Link} to={`/quiz/${quiz.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                <ListItemText primary={`${index + 1}. ${quiz.title} - By ${quiz.creatorName}`} />
                                            </QuizItem>
                                        )).length > 0 ? (
                                            quizzes
                                                .filter((quiz) => quiz.category === cat.name)
                                                .map((quiz, index) => (
                                                    <QuizItem key={quiz.id} component={Link} to={`/quiz/${quiz.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                        <ListItemText primary={`${index + 1}. ${quiz.title} - By ${quiz.creatorName}`} />
                                                    </QuizItem>
                                                ))
                                        ) : (
                                            <ListItem>
                                                <ListItemText primary="No quizzes available" />
                                            </ListItem>
                                        )}
                                </List>
                            </CategorySection>
                        </Grid>
                    ))}
                </Grid>
            )}
        </QuizListContainer>
    );
};

export default QuizList;