import React, { useState, useEffect, useRef, useContext } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import {
    Typography,
    Button,
    Box,
    Grid,
    IconButton,
    Rating,
    List,
    ListItem,
    ListItemText,
} from "@mui/material";
import music from "../../assets/music.mp3";
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';

import { AuthContext } from "../../contexts/AuthContext";
import { setDoc, } from "firebase/firestore";

const Quiz = () => {
    const { quizId } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [userAnswers, setUserAnswers] = useState({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const audioRef = useRef(null);
    const [isMuted, setIsMuted] = useState(true);
    const [userRating, setUserRating] = useState(0);
    const { currentUser } = useContext(AuthContext);
    const [detailedResults, setDetailedResults] = useState([]);

    const fetchUserRating = async () => {
        if (currentUser) {
            const userRatingDocRef = doc(db, "quizRatings", `${quizId}-${currentUser.uid}`);            const userRatingDocSnap = await getDoc(userRatingDocRef);

            if (userRatingDocSnap.exists()) {
                setUserRating(userRatingDocSnap.data().rating);
            } else {
                setUserRating(0);
            }
        }
    };

    useEffect(() => {
        const fetchQuizData = async () => {
            setIsLoading(true);
            try {
                const quizDocRef = doc(db, "quizzes", quizId);
                const quizDocSnap = await getDoc(quizDocRef);

                if (quizDocSnap.exists()) {
                    const quizData = quizDocSnap.data();
                    setQuiz(quizData);
                    setQuestions(quizData.questions);
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
        fetchUserRating();

        const audioElement = audioRef.current;
        if (audioElement) {
            audioElement.muted = true;
        }

        return () => {
            if (audioElement) {
                audioElement.pause();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [quizId, currentUser]);
    const handleAnswerChange = (questionIndex, answer) => {
        const questionId = questions[questionIndex].question;
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

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const calculateScore = () => {
        let newScore = 0;
        const results = [];
        questions.forEach((question) => {
            const questionId = question.question;
            const isCorrect = userAnswers[questionId] === question.answer;
            if (isCorrect) {
                newScore++;
            }
            results.push({
                question: question.question,
                userAnswer: userAnswers[questionId],
                correctAnswer: question.answer,
                isCorrect: isCorrect,
            });
        });
        setScore(newScore);
        setDetailedResults(results);
    };

    const handleRetake = () => {
        setShowResults(false);
        setScore(0);
        setUserAnswers({});
        setCurrentQuestionIndex(0);
        setUserRating(0);
        fetchUserRating();
        setDetailedResults([]);
    };

    const handleRatingChange = async (event, newValue) => {
        if (currentUser) {
            setUserRating(newValue);
            const userRatingDocRef = doc(db, "quizRatings", `${quizId}-${currentUser.uid}`);            await setDoc(userRatingDocRef, {
                rating: newValue,
                userId: currentUser.uid,
                quizId: quizId,
            }, { merge: true });
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!quiz) {
        return <div>Quiz not found!</div>;
    }

    const handleToggleMute = () => {
        if (audioRef.current) {
            if (isMuted) {
                audioRef.current.muted = false;
                audioRef.current.volume = 1;
                audioRef.current.play().catch(error => console.error("Audio playback failed:", error));
            } else {
                audioRef.current.muted = true;
                audioRef.current.pause();
            }
            setIsMuted(!isMuted);
        }
    };

    const currentQuestion = questions[currentQuestionIndex];
    const optionColors = ["#1e88e5", "#00bcd4", "#ff9800", "#e91e63"];

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'pink',
            color: 'white',
            margin: 0,
            padding: 0,
            overflow: 'hidden'
        }}>
            <audio ref={audioRef} loop src={music} style={{ display: 'none' }} />
            <IconButton
                onClick={handleToggleMute}
                sx={{
                    position: 'absolute',
                    bottom: '20px',
                    right: '20px',
                    backgroundColor: 'black',
                    '&:hover': {
                        backgroundColor: 'black',
                    },
                }}
            >
                {isMuted ? <VolumeOffIcon sx={{ color: 'white' }} /> : <VolumeUpIcon sx={{ color: 'white' }} />}
            </IconButton>
            <Box sx={{
                width: '90%',
                maxWidth: '800px',
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                background: 'linear-gradient(135deg, #6a11cb, #2575fc)'
            }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                    {quiz.title}
                </Typography>
                {!showResults ? (
                    <Box sx={{ maxHeight: '60vh', overflowY: 'auto', overflowX: 'hidden' }}>
                        <Typography variant="h6" gutterBottom>
                            Question {currentQuestionIndex + 1} / {questions.length}
                        </Typography>
                        <Typography variant="h5" gutterBottom sx={{ fontSize: '1.5rem', textAlign: 'center' }}>
                            {currentQuestion.question}
                        </Typography>
                        <Grid container spacing={2} direction="row" alignItems="center">
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                                <Grid container spacing={2} direction="row">
                                    {currentQuestion.options && currentQuestion.options.map((option, index) => (
                                        <Grid item xs={12} sm={6} md={3} key={index}>
                                            <Button
                                                sx={{
                                                    width: '100%',
                                                    padding: '1.5rem',
                                                    marginBottom: '1rem',
                                                    borderRadius: '8px',
                                                    fontSize: '1rem',
                                                    fontWeight: 'bold',
                                                    color: 'white',textTransform: 'none',
                                                    boxShadow: userAnswers[currentQuestion.question] === option ?
                                                        '0 0 8px white' : '0 2px 4px rgba(0, 0, 0.2)',
                                                    transition: 'transform 0.2s ease-in-out',
                                                    backgroundColor: userAnswers[currentQuestion.question] === option ? 'rgba(255, 255, 255, 0.3)' : optionColors[index % optionColors.length],
                                                    '&:hover': {
                                                        transform: 'translateY(-3px)',
                                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                                                    }
                                                }}
                                                onClick={() => handleAnswerChange(currentQuestionIndex, option)}
                                            >
                                                {option}
                                            </Button>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Grid>

                        </Grid>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handlePreviousQuestion}
                                disabled={currentQuestionIndex === 0}
                                sx={{ visibility: currentQuestionIndex === 0 ? 'hidden' : 'visible' }}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleNextQuestion}
                            >
                                {currentQuestionIndex === questions.length - 1
                                    ? "Finish"
                                    : "Next"}
                            </Button>
                        </Box>
                    </Box>
                ) : (
                    <Box sx={{
                        textAlign: "center",
                        padding: '2rem',
                        borderRadius: '12px',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        background: 'linear-gradient(135deg, #6a11cb, #2575fc)',
                        color: 'white',
                    }}>
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                            Quiz Results
                        </Typography>
                        <Box sx={{
                            backgroundColor: 'rgba(0, 0, 0, 0.2)',
                            padding: '1rem 2rem',
                            borderRadius: '8px',
                            display: 'inline-block',
                            marginBottom: '1.5rem',
                        }}>
                            <Typography
                                variant="h4"
                                gutterBottom
                                sx={{
                                    color:
                                        score / questions.length > 0.7
                                            ? "lightgreen"
                                            : score / questions.length > 0.4
                                                ? "orange"
                                                : "red",
                                    fontWeight: 'bold',
                                    fontSize: '2rem',
                                }}
                            >
                                {score} / {questions.length}
                            </Typography>
                        </Box>
                        <Box sx={{ marginBottom: '1rem' }}>
                            <Typography variant="h6" gutterBottom>
                                Rate this quiz:
                            </Typography>
                            <Rating
                                name="quiz-rating"
                                value={userRating}
                                onChange={handleRatingChange}
                            />
                        </Box>
                        <Box sx={{ marginBottom: '1rem' }}>
                            <Typography variant="h6" gutterBottom>
                                Detailed Results:
                            </Typography>
                            <List sx={{ width: '100%', bgcolor: 'rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
                                {detailedResults.map((result, index) => (
                                    <ListItem key={index} sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}>
                                        <ListItemText
                                            primary={result.question}
                                            secondary={`Your Answer: ${result.userAnswer || 'Not answered'} | Correct Answer: ${result.correctAnswer}`}
                                            primaryTypographyProps={{ color: 'white' }}
                                            secondaryTypographyProps={{ color: result.isCorrect ? 'lightgreen' : 'red' }}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                        <Box sx={{ marginTop: '1rem' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleRetake}
                                sx={{
                                    backgroundColor: 'white',
                                    color: '#6a11cb',
                                    padding: '0.8rem 2rem',
                                    borderRadius: '8px',
                                    fontWeight: 'bold',
                                    '&:hover': {
                                        backgroundColor: '#f0f0f0',
                                    },
                                }}
                            >
                                Retake Quiz
                            </Button>
                        </Box>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default Quiz;