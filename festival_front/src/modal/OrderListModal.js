import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  IconButton,
  DialogContentText,
} from "@mui/material";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import saveToLocal from '../function/saveToLocal';
import socket from "../socket";

export default function OrderListModal({ open, onClose, onUpdate }) {
  const [orders, setOrders] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null); // 삭제할 주문

  const fetchOrders = () => {
    axios
      .get("https://festival-backend-qydq.onrender.com/api/orders")
      .then((res) => setOrders(res.data))
      .catch((err) => console.error("주문 내역 불러오기 실패:", err));
  };

  useEffect(() => {
    if (open) fetchOrders();
  }, [open]);

  const handleDelete = () => {
  if (!deleteTarget) return;

  const { timestamp } = deleteTarget;

  axios
    .delete(
      `https://festival-backend-qydq.onrender.com/api/orders/${encodeURIComponent(timestamp)}`
    )
    .then(() => {
      setDeleteTarget(null);
      fetchOrders();  // 주문 리스트 다시 불러오기
      onUpdate();     // 다른 곳에 반영 필요할 경우
    })
    .catch((err) => {
      console.log(timestamp);
      console.error("주문 삭제 실패:", err);
      alert("주문 삭제에 실패했습니다.");
    });

    saveToLocal();
};


  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>🧾 전체 주문 내역</DialogTitle>
        <DialogContent dividers>
          {orders.length === 0 ? (
            <Typography color="textSecondary">
              주문 내역이 없습니다.
            </Typography>
          ) : (
            orders.map((order, idx) => (
              <Box key={idx} sx={{ mb: 2, position: "relative" }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  테이블 {order.tableNumber}번 -{" "}
                  {new Date(order.timestamp).toLocaleString()}
                </Typography>
                {order.items.map((item, i) => (
                  <Typography key={i} sx={{ pl: 2 }}>
                    • {item.name} - {item.quantity}개
                  </Typography>
                ))}
                <Typography
                  variant="body2"
                  sx={{ pl: 2, mt: 0.5, fontWeight: 500 }}
                >
                  총액: {order.totalPrice.toLocaleString()}원
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => setDeleteTarget(order)}
                  sx={{ position: "absolute", right: 8, top: 8 }}
                >
                  <DeleteIcon fontSize="small" color="error" />
                </IconButton>
                <Divider sx={{ my: 1 }} />
              </Box>
            ))
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="outlined">
            닫기
          </Button>
        </DialogActions>
      </Dialog>

      {/* 삭제 확인용 모달 */}
      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
      >
        <DialogTitle>❗ 주문 삭제 확인</DialogTitle>
        <DialogContent>
          <DialogContentText>
            테이블 {deleteTarget?.tableNumber}번 주문을 삭제하시겠습니까?
          </DialogContentText>
          <Box sx={{ mt: 2 }}>
            {deleteTarget?.items.map((item, i) => (
              <Typography key={i}>
                • {item.name} - {item.quantity}개
              </Typography>
            ))}
            <Typography sx={{ mt: 1, fontWeight: 500 }}>
              총액: {deleteTarget?.totalPrice?.toLocaleString()}원
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>취소</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            삭제
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
