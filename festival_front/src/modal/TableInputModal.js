import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

export default function TableInputModal({ open, onClose, onSubmit }) {
  const [tableNumber, setTableNumber] = useState("");

  const handleSubmit = () => {
    const parsed = parseInt(tableNumber);
    if (isNaN(parsed) || parsed < 0) {
      alert("올바른 테이블 번호를 입력해주세요.");
      return;
    }
    onSubmit(parsed);
    setTableNumber("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>🪑 테이블 번호 입력</DialogTitle>
      <DialogContent>
        <TextField
          label="테이블 번호"
          type="number"
          fullWidth
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
          autoFocus
          inputProps={{ min: 0 }}
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>취소</Button>
        <Button variant="contained" onClick={handleSubmit}>
          주문 완료
        </Button>
      </DialogActions>
    </Dialog>
  );
}
