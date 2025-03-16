import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';
import styled from 'styled-components';

const StyledContainer = styled(Container)`
  && {
    padding: 2rem;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const StyledPaper = styled(Paper)`
  && {
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 600px;
  }
`;

const Help = () => {
  return (
    <StyledContainer maxWidth="md">
      <StyledPaper>
        <Typography variant="h4" align="center" gutterBottom>
          Help & Support
        </Typography>
        <Typography variant="body1" paragraph>
          If you need any assistance or have questions, please feel free to contact us.
        </Typography>
        <Box display="flex" flexDirection="column" alignItems="center" mt={3}>
          <Typography variant="h6">Contact Us:</Typography>
          <Typography variant="body1">Email: spycatmeow@outlook.com</Typography>
        </Box>
      </StyledPaper>
    </StyledContainer>
  );
};

export default Help;