import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box
} from "@mui/material";
import styled from "styled-components";

export default function MenuSelectModal({ menu, onClose, onConfirm }) {
  const [quantity, setQuantity] = useState(1);

  const handleConfirm = () => {
    if (quantity <= 0) {
      alert("수량은 1개 이상이어야 합니다.");
      return;
    }


    
    onConfirm(menu, quantity);
    onClose();
  };

  const handlePlus = () => {
    setQuantity(quantity + 1);
  }
  const handleMinus = () => {
    setQuantity(quantity -1);
  }

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>🧾 수량 입력</DialogTitle>
      <DialogContent>
        <Typography gutterBottom>
          <strong>{menu.name}</strong> ({menu.zone}) - {menu.price.toLocaleString()}원
        </Typography>
        <TextField
          label="수량"
          type="number"
          fullWidth
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
          inputProps={{ min: 1 }}
          sx={{ mt: 2 }}
        />
        <ButtonContainer>
          <Minusutton
            variant="contained"
            color="error"
            onClick={handleMinus}
            >-</Minusutton>
          <PlusButton 
            variant="contained"
            color="primary"
            onClick={handlePlus}
          >+</PlusButton>
        </ButtonContainer>
       </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>취소</Button>
        <Button onClick={handleConfirm} variant="contained">
          추가
        </Button>
      </DialogActions>
    </Dialog>
  );
}


const PlusButton = styled(Button)`
  display:flex;
  flex:1
`

const Minusutton = styled(Button)`
  display:flex;
  flex:1;
`

const ButtonContainer = styled(Box)`
  display:flex;
  flex-direction:row;
  margin-top:1rem;
`