import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import {
    Container,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    List,
    ListItem,
    ListItemText,
    RadioGroup,
    FormControlLabel,
    Radio,
    Button,
    Typography,
} from "@mui/material";
import styled from "styled-components";

const QuizListContainer = styled(Container)`
    && {
        background-color: #f5f5f5;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        padding: 2rem;
    }
`;

const Title = styled(Typography)`
    && {
        font-weight: bold;
        margin-bottom: 1rem;
        text-align: center;
    }
`;

const QuestionList = styled(List)`
    && {
        background-color: white;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        margin-bottom: 1rem;
    }
`;

const QuestionItem = styled(ListItem)`
    && {
        &:not(:last-child) {
            border-bottom: 1px solid #eee;
        }
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

const QuizList = () => {
    const [questions, setQuestions] = useState();
    const [selectedCategory, setSelectedCategory] = useState("javascript");
    const [isLoading, setIsLoading] = useState(true);
    const [userAnswers, setUserAnswers] = useState({});
    const [showScore, setShowScore] = useState(false);
    const [score, setScore] = useState(0);

    useEffect(() => {
        const fetchQuestions = async () => {
            setIsLoading(true);
            try {
                const questionsRef = collection(db, "questions");
                const q = query(
                    questionsRef,
                    where("category", "==", selectedCategory),
                );
                const querySnapshot = await getDocs(q);
                const fetchedQuestions = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setQuestions(fetchedQuestions);
            } catch (error) {
                console.error("Error fetching questions:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuestions();
    }, [selectedCategory]);

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
        setShowScore(false);
        setScore(0);
        setUserAnswers({});
    };

    const handleAnswerChange = (questionId, answer) => {
        setUserAnswers({ ...userAnswers, [questionId]: answer });
    };

    const handleSubmit = () => {
        let newScore = 0;
        questions.forEach((question) => {
            if (userAnswers[question.id] === question.correctAnswer) {
                newScore++;
            }
        });
        setScore(newScore);
        setShowScore(true);
    };

    const handleRetake = () => {
        setShowScore(false);
        setScore(0);
        setUserAnswers({});
    };

    return (
        <QuizListContainer maxWidth="sm" sx={{ mt: 4 }}>
            <Title variant="h4" gutterBottom>
                Quiz Questions ({selectedCategory})
            </Title>
            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="category-select-label">Category</InputLabel>
                <Select
                    labelId="category-select-label"
                    id="category-select"
                    value={selectedCategory}
                    label="Category"
                    onChange={handleCategoryChange}
                >
                    <MenuItem value="javascript">JavaScript</MenuItem>
                    <MenuItem value="python">Python</MenuItem>
                </Select>
            </FormControl>

            {isLoading ? (
                <Typography variant="body1">Loading questions...</Typography>
            ) : (
                <>
                    {!showScore && (
                        <QuestionList>
                            {questions.map((question, index) => (
                                <QuestionItem key={question.id} sx={{ mb: 2, display: "block" }}>
                                    <ListItemText
                                        primary={`${index + 1}. ${question.text}`}
                                        sx={{ fontWeight: "bold" }}
                                    />
                                    <FormControl>
                                        <RadioGroup
                                            aria-labelledby={`question-${question.id}-label`}
                                            name={`question-${question.id}`}
                                            onChange={(e) =>
                                                handleAnswerChange(
                                                    question.id,
                                                    e.target.value,
                                                )
                                            }
                                        >
                                            {question.options.map((option, optionIndex) => (
                                                <FormControlLabel
                                                    key={optionIndex}
                                                    value={option}
                                                    control={<Radio />}
                                                    label={option}
                                                    disabled={showScore}
                                                />
                                            ))}
                                        </RadioGroup>
                                    </FormControl>
                                </QuestionItem>
                            ))}
                        </QuestionList>
                    )}
                    {!showScore && (
                        <StyledButton
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                        >
                            Submit
                        </StyledButton>
                    )}
                    {showScore && (
                        <Typography
                            variant="h6"
                            gutterBottom
                            sx={{
                                color:
                                    score / questions.length > 0.7
                                        ? "green"
                                        : score / questions.length > 0.4
                                            ? "orange"
                                            : "red",
                            }}
                        >
                            You scored {score} out of {questions.length}
                        </Typography>
                    )}
                    {showScore && (
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={handleRetake}
                        >
                            Retake Quiz
                        </Button>
                    )}
                </>
            )}
        </QuizListContainer>
    );
};

export default QuizList;