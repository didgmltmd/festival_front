import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Button, Typography, Box } from "@mui/material";

const Container = styled(Box)`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  background-color: #f9f9f9;
`;

const ButtonGroup = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
`;

const ZoneButton = styled(Button)`
  min-width: 180px;
  height: 60px;
  font-size: 1.2rem;
`;

export default function MainPage() {
  const navigate = useNavigate();

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        📦 축제 주문 관리 시스템
      </Typography>
      <ButtonGroup>
        <ZoneButton variant="contained" color="primary" onClick={() => navigate("/counter")}>카운터</ZoneButton>
        <ZoneButton variant="contained" color="secondary" onClick={() => navigate("/kitchen/A")}>A 구역</ZoneButton>
        <ZoneButton variant="contained" color="secondary" onClick={() => navigate("/kitchen/B")}>B 구역</ZoneButton>
        <ZoneButton variant="contained" color="secondary" onClick={() => navigate("/kitchen/C")}>C 구역</ZoneButton>
      </ButtonGroup>
    </Container>
  );
}
