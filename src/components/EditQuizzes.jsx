import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import {
    TextField,
    Button,
    Box,
    Typography,
    Paper,
    IconButton,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Container,
} from '@mui/material';
import { AddCircleOutline, DeleteOutline } from '@mui/icons-material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';

const StyledContainer = styled(Container)`
    && {
        padding: 2rem;
        background: linear-gradient(135deg, #f0f8ff, #e6f7ff);
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: flex-start;
    }
`;

const StyledPaper = styled(Paper)`
    && {
        padding: 2rem;
        margin-bottom: 2rem;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        width: 95%; /* Ensure it takes full width of its parent */
    }
`;
const StyledForm = styled(Box)`
    && {
        width: 100%;
        max-width: 800px;
    }
`;

const ActionButtons = styled(Box)`
    && {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 2rem;
    }
`;

const EditQuiz = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const docRef = doc(db, 'quizzes', quizId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setQuiz({ id: docSnap.id, ...docSnap.data() });
                } else {
                    toast.error('Quiz not found.');
                    navigate('/my-quizzes');
                }
            } catch (error) {
                toast.error('Failed to fetch quiz.');
                navigate('/my-quizzes');
            } finally {
                setLoading(false);
            }
        };
        fetchQuiz();
    }, [quizId, navigate]);

    const handleInputChange = (e) => {
        if (e.target.name === 'category') {
            setQuiz({ ...quiz, category: e.target.value });
        } else {
            setQuiz({ ...quiz, [e.target.name]: e.target.value });
        }
    };

    const handleQuestionChange = (index, field, value) => {
        const newQuestions = [...quiz.questions];
        if (field === 'options') {
            newQuestions[index].options = value;
        } else {
            newQuestions[index][field] = value;
        }
        setQuiz({ ...quiz, questions: newQuestions });
    };

    const handleOptionChange = (questionIndex, optionIndex, value) => {
        const newQuestions = [...quiz.questions];
        newQuestions[questionIndex].options[optionIndex] = value;
        setQuiz({ ...quiz, questions: newQuestions });
    };

    const handleAddQuestion = () => {
        setQuiz({ ...quiz, questions: [...quiz.questions, { question: '', options: ['', '', '', ''], answer: '' }] });
    };

    const handleRemoveQuestion = (index) => {
        const newQuestions = quiz.questions.filter((_, i) => i !== index);
        setQuiz({ ...quiz, questions: newQuestions });
    };

    const handleUpdateQuiz = async () => {
        try {
            const quizRef = doc(db, 'quizzes', quizId);
            await updateDoc(quizRef, {
                title: quiz.title,
                category: quiz.category,
                questions: quiz.questions,
            });
            toast.success('Quiz updated successfully!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setTimeout(() => {
                navigate('/my-quizzes');
            }, 3500); 
        } catch (error) {
            toast.error('Failed to update quiz.');
        }
    };


    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    if (!quiz) {
        return null;
    }

    return (
        <StyledContainer maxWidth="md">
            <StyledForm>
                <Typography variant="h4" gutterBottom>
                    Edit Quiz
                </Typography>
                <TextField label="Title" name="title" value={quiz.title} onChange={handleInputChange} fullWidth sx={{ mb: 2 }} />
                <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel id="category-label">Category</InputLabel>
                    <Select labelId="category-label" id="category" name="category" value={quiz.category} label="Category" onChange={handleInputChange}>
                        <MenuItem value={'Math'}>Math</MenuItem>
                        <MenuItem value={'Science'}>Science</MenuItem>
                        <MenuItem value={'History'}>History</MenuItem>
                        <MenuItem value={'Geography'}>Geography</MenuItem>
                        <MenuItem value={'General Knowledge'}>General Knowledge</MenuItem>
                        <MenuItem value={'Technology'}>Technology</MenuItem>
                        <MenuItem value={'Entertainment'}>Entertainment</MenuItem>
                    </Select>
                </FormControl>
                {quiz.questions.map((question, index) => (
                    <StyledPaper key={index}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6">Question {index + 1}</Typography>
                            <IconButton onClick={() => handleRemoveQuestion(index)}>
                                <DeleteOutline />
                            </IconButton>
                        </Box>
                        <TextField label={`Question ${index + 1}`} fullWidth value={question.question} onChange={(e) => handleQuestionChange(index, 'question', e.target.value)} sx={{ mb: 2 }} />
                        {question.options.map((option, optionIndex) => (
                            <TextField
                                key={optionIndex}
                                label={`Option ${optionIndex + 1}`}
                                fullWidth
                                value={question.options[optionIndex]}
                                onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                                sx={{ mb: 2 }}
                            />
                        ))}
                        <TextField label="Answer" fullWidth value={question.answer} onChange={(e) => handleQuestionChange(index, 'answer', e.target.value)} />
                    </StyledPaper>
                ))}
                <ActionButtons>
                    <IconButton onClick={handleAddQuestion}>
                        <AddCircleOutline fontSize="large" />
                    </IconButton>
                    <Button variant="contained" color="primary" onClick={handleUpdateQuiz}>
                        Update Quiz
                    </Button>
                </ActionButtons>
                <ToastContainer />
            </StyledForm>
        </StyledContainer>
    );
};

export default EditQuiz;