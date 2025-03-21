import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Paper,
  IconButton,
  Divider,
} from '@mui/material';
import { AddCircleOutline, DeleteOutline } from '@mui/icons-material';
import { db, auth } from '../../firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import styled from 'styled-components';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import backgroundImage from "../../assets/main-bg.jpg";

const CreateQuizContainer = styled(Box)`
  min-height: 100vh;
  min-width: 100vw;
  background-image: url(${backgroundImage});
  background-size: cover;
  background-position: center;
  padding: 4rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FormWrapper = styled(Paper)`
  padding: 3rem;
  width: 90%;
  max-width: 900px;
  border-radius: 16px;
`;

const QuestionPaper = styled(Paper)`
  padding: 2.5rem;
  margin-bottom: 2rem;
  border-radius: 12px;
  box-shadow: rgb(38, 57, 77) 0px 20px 30px -10px;
`;

const CreateQuiz = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [questions, setQuestions] = useState([{ question: '', options: ['', '', '', ''], answer: '' }]);
  const [availableCategories, setAvailableCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "categories"));
        const fetchedCategories = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAvailableCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', '', '', ''], answer: '' }]);
  };

  const handleRemoveQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    if (field === 'options') {
      newQuestions[index].options = value;
    } else {
      newQuestions[index][field] = value;
    }
    setQuestions(newQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("User not authenticated");
      }
      await addDoc(collection(db, "quizzes"), {
        title,
        category,
        questions,
        creatorId: user.uid,
        creatorName: user.displayName,
      });
      toast.success('Quiz created successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTitle('');
      setCategory('');
      setQuestions([{ question: '', options: ['', '', '', ''], answer: '' }]);
    } catch (error) {
      console.error('Error creating quiz:', error);
      toast.error('Failed to create quiz. Please try again.', {
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
    <CreateQuizContainer>
      <FormWrapper sx={{
        mb: 3,
        boxShadow: `rgb(85, 91, 255) 0px 0px 0px 3px, rgb(31, 193, 27) 0px 0px 0px 6px, rgb(255, 217, 19) 0px 0px 0px 9px, rgb(255, 156, 85) 0px 0px 0px 12px, rgb(255, 85, 85) 0px 0px 0px 15px`
      }}>
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          style={{ fontFamily: 'Playfair Display', fontWeight: 700, color: '#34495e' }}
        >
          Create a Quiz
        </Typography>
        <TextField
          label="Quiz Title"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 3 }}
          variant="outlined"
        />
        <FormControl fullWidth sx={{ mb: 3, }}>
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            id="category"
            value={category}
            label="Category"
            onChange={(e) => setCategory(e.target.value)}
            variant="outlined"
          >
            {availableCategories.map((cat) => (
              <MenuItem key={cat.id} value={cat.name}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <form onSubmit={handleSubmit}>
          <Box sx={{ maxHeight: '60vh', overflowY: 'auto', overflowX: 'hidden', mb: 2 }}>
            {questions.map((question, index) => (
              <QuestionPaper key={index}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">Question {index + 1}</Typography>
                  <IconButton onClick={() => handleRemoveQuestion(index)}>
                    <DeleteOutline />
                  </IconButton>
                </Box>
                <TextField
                  label={`Question ${index + 1}`}
                  fullWidth
                  value={question.question}
                  onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                  sx={{ mb: 2 }}
                  variant="outlined"
                />
                {question.options.map((option, optionIndex) => (
                  <TextField
                    key={optionIndex}
                    label={`Option ${optionIndex + 1}`}
                    fullWidth
                    value={question.options[optionIndex]}
                    onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                    sx={{ mb: 2 }}
                    variant="outlined"
                  />
                ))}
                <TextField
                  label="Answer"
                  fullWidth
                  value={question.answer}
                  onChange={(e) => handleQuestionChange(index, 'answer', e.target.value)}
                  variant="outlined"
                />
                {index < questions.length - 1 && <Divider sx={{ my: 2 }} />}
              </QuestionPaper>
            ))}
          </Box>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <IconButton onClick={handleAddQuestion} sx={{ mb: 2 }}>
              <AddCircleOutline fontSize="large" />
            </IconButton>
            <Button type="submit" variant="contained" color="primary" size="large">
              Create Quiz
            </Button>
          </Box>
        </form>
      </FormWrapper>
      <ToastContainer />
    </CreateQuizContainer>
  );
};

export default CreateQuiz;