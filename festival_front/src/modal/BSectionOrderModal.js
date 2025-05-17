import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Paper
} from "@mui/material";
import axios from "axios";

export default function BSectionOrderModal({ open, onClose }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (open) {
      axios.get("https://festival-backend-qydq.onrender.com/api/kitchen/B")
        .then((res) => setOrders(res.data))
        .catch((err) => {
          console.error("B구역 주문 내역 불러오기 실패:", err);
        });
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>🍱 B구역 주문 내역</DialogTitle>
      <DialogContent dividers>
        {orders.length === 0 ? (
          <Typography color="textSecondary">현재 B구역에 주문이 없습니다.</Typography>
        ) : (
          orders.map((item, idx) => (
            <Paper key={idx} sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                {item.name} ({item.quantity}개)
              </Typography>
              <Typography variant="body2" color="textSecondary">
                테이블 번호: {item.tableNumber}
              </Typography>
            </Paper>
          ))
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">닫기</Button>
      </DialogActions>
    </Dialog>
  );
}
