// --- src/App.jsx ---
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/auths/Login';
import ForgotPassword from './components/auths/Forgotpassword';
import MainPage from './components/mainpage';
import Register from './components/auths/Register';
import Profile from './components/profile/Profile';
import QuizList from './components/quiz/QuizList';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/routes/PrivateRoute';
import Navbar from './components/routes/Navbar';
import { createGlobalStyle } from 'styled-components';
import { AuthContext } from './contexts/AuthContext';
import CreateQuiz from './components/quiz/CreateQuiz'; 
import Quiz from './components/quiz/Quiz';
import MyQuizzes from './components/quiz/MyQuizzes';
import QuizDetails from './components/quiz/QuizDetails';
import EditQuiz from './components/quiz/EditQuizzes';
import Help from './components/routes/Help'; 
import LoggedIn from './components/page';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: sans-serif;
  }
`;

const adminEmails = ['spycatmeow24@gmail.com'];

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
          <Route path="/settings" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/quiz" element={<PrivateRoute><QuizList /></PrivateRoute>} />
          <Route path="/create-quiz" element={<PrivateRoute><CreateQuiz /></PrivateRoute>} />
          <Route path="/" element={<MainPage />} /> 
          <Route path="/quiz/:quizId" element={<PrivateRoute><Quiz /></PrivateRoute>} />
          <Route path="/my-quizzes" element={<PrivateRoute><MyQuizzes /></PrivateRoute>} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/quiz-details/:quizId" element={<PrivateRoute><QuizDetails /></PrivateRoute>} />
          <Route path="/help" element={<Help />} />
          <Route path="/home" element={<LoggedIn />} />
          <Route
                        path="/edit-quiz/:quizId"
                        element={
                            <PrivateRoute>
                                <EditQuiz />
                            </PrivateRoute>
                        }
                    />
          </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;