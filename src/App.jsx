// --- src/App.jsx ---
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/authPages/Login';
import ForgotPassword from './components/authPages/Forgotpassword';
import MainPage from './components/mainpage';
import Register from './components/authPages/Register';
import Profile from './components/profilePages/Profile';
import QuizList from './components/quizFeatures/QuizList';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/commonComponents/PrivateRoute';
import Navbar from './components/commonComponents/Navbar';
import { createGlobalStyle } from 'styled-components';
import { AuthContext } from './contexts/AuthContext';
import CreateQuiz from './components/CreateQuiz'; // Import CreateQuiz
import Quiz from './components/quizFeatures/Quiz';
import MyQuizzes from './components/MyQuizzes';
import QuizDetails from './components/QuizDetails';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: sans-serif;
  }
`;

const adminEmails = ['spycatmeow24@gmail.com']; // Authorized admin emails

function App() {
  const { currentUser } = useContext(AuthContext);

  const isAdmin = currentUser && adminEmails.includes(currentUser.email);

  return (
    <AuthProvider>
      <Router>
        <GlobalStyle />
        <Navbar isAdmin = {isAdmin} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/quizFeatures" element={<PrivateRoute><QuizList /></PrivateRoute>} />
          <Route path="/create-quiz" element={<PrivateRoute><CreateQuiz /></PrivateRoute>} />
          <Route path="/" element={<MainPage />} /> 
          <Route path="/quiz/:quizId" element={<PrivateRoute><Quiz /></PrivateRoute>} />
          <Route path="/my-quizzes" element={<PrivateRoute><MyQuizzes /></PrivateRoute>} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/quiz-details/:quizId" element={<PrivateRoute><QuizDetails /></PrivateRoute>} />
          </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;