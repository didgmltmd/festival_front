import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider
} from "@mui/material";
import axios from "axios";

export default function OrderListModal({ open, onClose }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (open) {
      axios.get("https://festival-backend-qydq.onrender.com/api/orders")
        .then((res) => {
          setOrders(res.data);
        })
        .catch((err) => {
          console.error("주문 내역 불러오기 실패:", err);
        });
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>🧾 전체 주문 내역</DialogTitle>
      <DialogContent dividers>
        {orders.length === 0 ? (
          <Typography color="textSecondary">주문 내역이 없습니다.</Typography>
        ) : (
          orders.map((order, idx) => (
            <Box key={idx} sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                테이블 {order.tableNumber}번 - {new Date(order.timestamp).toLocaleString()}
              </Typography>
              {order.items.map((item, i) => (
                <Typography key={i} sx={{ pl: 2 }}>
                  • {item.name} - {item.quantity}개
                </Typography>
              ))}
              <Typography variant="body2" sx={{ pl: 2, mt: 0.5, fontWeight: 500 }}>
                총액: {order.totalPrice.toLocaleString()}원
              </Typography>
              <Divider sx={{ my: 1 }} />
            </Box>
          ))
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">닫기</Button>
      </DialogActions>
    </Dialog>
  );
}
