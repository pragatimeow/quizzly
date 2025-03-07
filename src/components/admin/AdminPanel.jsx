import React, { useState, useEffect } from "react";
import {
    Container,
    Typography,
    TextField,
    Select,
    MenuItem,
    Button,
    List,
    ListItem,
    ListItemText,
    FormControl,
    InputLabel,
    Box,
} from "@mui/material";
import { db } from "../../firebase";
import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
} from "firebase/firestore";
import styled from "styled-components";

const PanelContainer = styled(Container)`
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

const Form = styled(Box)`
    && {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 2rem;
    }
`;

const StyledButton = styled(Button)`
    && {
        background-color: #f0ad4e; // Quizizz orange color
        color: white;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        &:hover {
            background-color: #eea236; // Slightly darker orange on hover
        }
    }
`;

const QuestionList = styled(List)`
    && {
        background-color: white;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
`;

const QuestionItem = styled(ListItem)`
    && {
        &:not(:last-child) {
            border-bottom: 1px solid #eee;
        }
    }
`;

const AdminPanel = () => {
    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState({
        text: "",
        options: ["", "", "", ""],
        correctAnswer: "",
        category: "javascript",
    });
    const [editQuestionId, setEditQuestionId] = useState(null);

    const fetchQuestions = async () => {
        const querySnapshot = await getDocs(collection(db, "questions"));
        setQuestions(
            querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }))
        );
    };

    useEffect(() => {
        fetchQuestions();
    },);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith("option")) {
            const optionIndex = parseInt(name.slice(6));
            const newOptions = [...newQuestion.options];
            newOptions[optionIndex] = value;
            setNewQuestion({ ...newQuestion, options: newOptions });
        } else {
            setNewQuestion({ ...newQuestion, [name]: value });
        }
    };

    const addQuestion = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, "questions"), newQuestion);
            setNewQuestion({
                text: "",
                options: ["", "", "", ""],
                correctAnswer: "",
                category: "javascript",
            });
            fetchQuestions();
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    };

    const startEditQuestion = (question) => {
        setEditQuestionId(question.id);
        setNewQuestion({ ...question });
    };

    const updateQuestion = async (e) => {
        e.preventDefault();
        try {
            const questionDoc = doc(db, "questions", editQuestionId);
            await updateDoc(questionDoc, newQuestion);
            setEditQuestionId(null);
            setNewQuestion({
                text: "",
                options: ["", "", "", ""],
                correctAnswer: "",
                category: "javascript",
            });
            fetchQuestions();
        } catch (error) {
            console.error("Error updating document: ", error);
        }
    };

    const deleteQuestion = async (id) => {
        try {
            await deleteDoc(doc(db, "questions", id));
            fetchQuestions();
        } catch (error) {
            console.error("Error deleting document: ", error);
        }
    };

    return (
        <PanelContainer maxWidth="md" sx={{ mt: 4 }}>
            <Title variant="h4" gutterBottom>
                Admin Panel - Quiz Questions
            </Title>
            <Form
                component="form"
                onSubmit={editQuestionId ? updateQuestion : addQuestion}
            >
                <TextField
                    label="Question Text"
                    name="text"
                    value={newQuestion.text}
                    onChange={handleInputChange}
                    required
                    multiline
                    fullWidth
                />
                {newQuestion.options.map((option, index) => (
                    <TextField
                        key={index}
                        label={`Option ${index + 1}`}
                        name={`option${index}`}
                        value={option}
                        onChange={handleInputChange}
                        required
                        fullWidth
                    />
                ))}
                <FormControl fullWidth>
                    <InputLabel id="correct-answer-label">
                        Correct Answer
                    </InputLabel>
                    <Select
                        labelId="correct-answer-label"
                        name="correctAnswer"
                        value={newQuestion.correctAnswer}
                        label="Correct Answer"
                        onChange={handleInputChange}
                        required
                    >
                        {newQuestion.options.map((option, index) => (
                            <MenuItem key={index} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth>
                    <InputLabel id="category-label">Category</InputLabel>
                    <Select
                        labelId="category-label"
                        name="category"
                        value={newQuestion.category}
                        label="Category"
                        onChange={handleInputChange}
                        required
                    >
                        <MenuItem value="javascript">JavaScript</MenuItem>
                        <MenuItem value="python">Python</MenuItem>
                    </Select>
                </FormControl>
                <StyledButton type="submit" variant="contained" color="primary">
                    {editQuestionId ? "Update Question" : "Add Question"}
                </StyledButton>
                {editQuestionId && (
                    <Button variant="outlined" onClick={() => setEditQuestionId(null)}>
                        Cancel Edit
                    </Button>
                )}
            </Form>
            <QuestionList>
                {questions.map((question) => (
                    <QuestionItem key={question.id} sx={{ mb: 2 }}>
                        <ListItemText
                            primary={question.text}
                            secondary={`Correct Answer: ${question.correctAnswer}, Category: ${question.category}`}
                        />
                        <Box>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => startEditQuestion(question)}
                                sx={{ mr: 2 }}
                            >
                                Edit
                            </Button>
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={() => deleteQuestion(question.id)}
                            >
                                Delete
                            </Button>
                        </Box>
                    </QuestionItem>
                ))}
            </QuestionList>
        </PanelContainer>
    );
};

export default AdminPanel;