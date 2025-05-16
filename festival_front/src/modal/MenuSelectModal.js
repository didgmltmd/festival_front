import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
} from "@mui/material";

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
