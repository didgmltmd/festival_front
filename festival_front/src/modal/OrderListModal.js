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
  ToggleButton,
  ToggleButtonGroup
} from "@mui/material";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import saveToLocal from '../function/saveToLocal';
import TableInputModal from "./TableInputModal";
import socket from "../socket";

export default function OrderListModal({ open, onClose, onUpdate }) {
  const [orders, setOrders] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null); 
  const [searchTable, setSearchTable] = useState("");
  const [searchTime, setSearchTime] = useState(""); 
  const [tableInputModalOpen, setTableInputModalOpen] = useState(false);




  const filterOrders = () => {
    return orders.filter((order) => {
      const orderDate = new Date(order.timestamp);

      const matchTable =
        searchTable === "" || order.tableNumber.toString().includes(searchTable);

      const matchTime =
        searchTime === "" ||
        (() => {
          const orderTime = new Date(order.timestamp).getTime();

          const [hh, mm] = searchTime.split(":").map(Number);
          const now = new Date();

          const searchDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            hh,
            mm,
            0
          );

          const searchTimeMs = searchDate.getTime();


          const isSameDate =
            orderDate.getFullYear() === searchDate.getFullYear() &&
            orderDate.getMonth() === searchDate.getMonth() &&
            orderDate.getDate() === searchDate.getDate();

          const isWithinRange = Math.abs(orderTime - searchTimeMs) <= 3 * 60 * 1000;



          return isSameDate && isWithinRange;
        })();

      return matchTable && matchTime;
    });
  };







  const handleClose = () => {
    setSearchTable("");
    setSearchTime("");
    onClose();
  }



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
      fetchOrders();  
      saveToLocal();
      onUpdate();     
    })
    .catch((err) => {
      console.log(timestamp);
      console.error("주문 삭제 실패:", err);
      alert("주문 삭제에 실패했습니다.");
    });


};


  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <Box
          sx={{
            display:'flex',
            flexDirection:'row',
            justifyContent:'space-between'
          }}
        >
          <DialogTitle>🧾 전체 주문 내역</DialogTitle>
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, px: 3, pt: 2 }}>
            {searchTable && (
              <Typography sx={{ px: 3, pt: 1, fontSize: 14, color: "gray" }}>
                🔍 현재 테이블 검색: {searchTable}
              </Typography>
            )}
            <Button
              variant="outlined"
              onClick={() => setTableInputModalOpen(true)}
              sx={{ height: "40px" }}
            >
              테이블 검색
            </Button>

            <input
              type="time"
              value={searchTime}
              onChange={(e) => setSearchTime(e.target.value)}
              style={{ padding: "6px", borderRadius: 4, border: "1px solid #ccc" }}
            />
          </Box>


        </Box>
        <DialogContent dividers>
          {orders.length === 0 ? (
            <Typography color="textSecondary">
              주문 내역이 없습니다.
            </Typography>
          ) : (
            filterOrders().map((order, idx) => (
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
          <Button onClick={handleClose} variant="outlined">
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
      <TableInputModal
        open={tableInputModalOpen}
        onClose={() => setTableInputModalOpen(false)}
        onSubmit={(parsedTable) => {
          setSearchTable(parsedTable);
          setTableInputModalOpen(false);
        }}
      />

    </>
  );
}
