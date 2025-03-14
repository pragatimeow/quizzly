// src/components/admin/AdminPanel.jsx

import React from "react";
import AdminDashboard from "./AdminDashboard"; // Import the AdminDashboard component
import styled from "styled-components";
import { Container } from "@mui/material";

const PanelContainer = styled(Container)`
  && {
    background-color: #f5f5f5;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 2rem;
  }
`;

const AdminPanel = () => {
  return (
    <PanelContainer maxWidth="md" sx={{ mt: 4 }}>
      <AdminDashboard /> {/* Render the AdminDashboard component */}
    </PanelContainer>
  );
};

export default AdminPanel;