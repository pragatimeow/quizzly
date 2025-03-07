import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
import {
    doc,
    getDoc,
    collection,
    query,
    where,
    getDocs,
} from "firebase/firestore";
import {
    Container,
    Typography,
    List,
    ListItem,
    ListItemText,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio,
    Button,
    Box,
} from "@mui/material";
import styled from "styled-components";

const QuizContainer = styled(Container)`
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

const Quiz = () => {
    const { quizId } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [questions, setQuestions] = useState();
    const [userAnswers, setUserAnswers] = useState({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchQuizData = async () => {
            setIsLoading(true);
            try {
                const quizDocRef = doc(db, "quizzes", quizId);
                const quizDocSnap = await getDoc(quizDocRef);

                if (quizDocSnap.exists()) {
                    const quizData = quizDocSnap.data();
                    setQuiz(quizData);

                    const questionsRef = collection(db, "questions");
                    const q = query(
                        questionsRef,
                        where("quizId", "==", quizId),
                    );
                    const querySnapshot = await getDocs(q);
                    const fetchedQuestions = querySnapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    setQuestions(fetchedQuestions);
                } else {
                    console.log("Quiz not found!");
                }
            } catch (error) {
                console.error("Error fetching quiz data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuizData();
    }, [quizId]);

    const handleAnswerChange = (questionId, answer) => {
        setUserAnswers({ ...userAnswers, [questionId]: answer });
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            calculateScore();
            setShowResults(true);
        }
    };

    const calculateScore = () => {
        let newScore = 0;
        questions.forEach((question) => {
            if (userAnswers[question.id] === question.correctAnswer) {
                newScore++;
            }
        });
        setScore(newScore);
    };

    const handleRetake = () => {
        setShowResults(false);
        setScore(0);
        setUserAnswers({});
        setCurrentQuestionIndex(0);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!quiz) {
        return <div>Quiz not found!</div>;
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <QuizContainer maxWidth="sm" sx={{ mt: 4 }}>
            <Title variant="h4" gutterBottom>
                {quiz.title}
            </Title>
            {!showResults ? (
                <>
                    <Typography variant="h6" gutterBottom>
                        Question {currentQuestionIndex + 1} / {questions.length}
                    </Typography>
                    <QuestionList>
                        <QuestionItem>
                            <ListItemText
                                primary={`${currentQuestionIndex + 1}. ${currentQuestion.text}`}
                                sx={{ fontWeight: "bold" }}
                            />
                            <FormControl>
                                <RadioGroup
                                    aria-labelledby={`question-${currentQuestion.id}-label`}
                                    name={`question-${currentQuestion.id}`}
                                    onChange={(e) =>
                                        handleAnswerChange(
                                            currentQuestion.id,
                                            e.target.value,
                                        )
                                    }
                                >
                                    {currentQuestion.options.map((option, index) => (
                                        <FormControlLabel
                                            key={index}
                                            value={option}
                                            control={<Radio />}
                                            label={option}
                                            disabled={showResults}
                                        />
                                    ))}
                                </RadioGroup>
                            </FormControl>
                        </QuestionItem>
                    </QuestionList>
                    <StyledButton
                        variant="contained"
                        color="primary"
                        onClick={handleNextQuestion}
                        sx={{ mt: 2 }}
                    >
                        {currentQuestionIndex === questions.length - 1
                            ? "Finish"
                            : "Next"}
                    </StyledButton>
                </>
            ) : (
                <Box sx={{ textAlign: "center" }}>
                    <Typography variant="h5" gutterBottom>
                        Quiz Results
                    </Typography>
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
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleRetake}
                    >
                        Retake Quiz
                    </Button>
                </Box>
            )}
        </QuizContainer>
    );
};

export default Quiz;