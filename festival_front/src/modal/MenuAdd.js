import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from "@mui/material";
import axios from "axios";
import saveToLocal from '../function/saveToLocal';

const zones = ["A", "B", "C", "Counter"];

export default function AddMenuModal({ open, onClose, onAdd }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [zone, setZone] = useState("A");

  const handleSubmit = async () => {
    if (!name || !price || !zone) return alert("모든 항목을 입력해주세요");

    const newItem = {
      name,
      price: parseInt(price),
      zone,
    };

    try {
      await axios.post("https://festival-backend-qydq.onrender.com/api/menu", newItem);

      saveToLocal();
      onAdd();
      onClose();
    } catch (err) {
      console.error("메뉴 추가 실패:", err);
      alert("메뉴 추가에 실패했습니다.");
    }
  };

  const handleClose = () => {
    setName("");
    setPrice("");
    setZone("A");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>🍱 메뉴 추가</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="메뉴 이름"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="가격"
          type="number"
          fullWidth
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <TextField
          margin="dense"
          select
          label="조리 구역"
          fullWidth
          value={zone}
          onChange={(e) => setZone(e.target.value)}
        >
          {zones.map((z) => (
            <MenuItem key={z} value={z}>
              {z} 구역
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>취소</Button>
        <Button variant="contained" onClick={handleSubmit}>추가</Button>
      </DialogActions>
    </Dialog>
  );
}
