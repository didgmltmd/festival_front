import { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import axios from "axios";
import socket from "../socket";

export default function ASectionPage() {
  const [orders, setOrders] = useState([]);
  const [confirmData, setConfirmData] = useState(null); // { timestamp, itemIndex, name }

  const fetchInitialOrders = async () => {
    try {
      const res = await axios.get("https://festival-backend-qydq.onrender.com/api/kitchen/A");
      setOrders(res.data);
    } catch (err) {
      console.error("초기 주문 데이터 로드 실패:", err);
    }
  };

  // ✅ 서빙 완료 API 호출
  const confirmServe = async () => {
    if (!confirmData) return;

    const { timestamp, itemIndex } = confirmData;
    try {
      await axios.patch(
        `https://festival-backend-qydq.onrender.com/api/kitchen/${timestamp}/${itemIndex}/serve`
      );

      // UI에서 제거
      setOrders((prev) =>
        prev.filter((item) => !(item.timestamp === timestamp && item.itemIndex === itemIndex))
      );
      setConfirmData(null); 
    } catch (err) {
      console.error("서빙 완료 처리 실패:", err);
      alert("서빙 처리에 실패했습니다.");
    }
  };

  useEffect(() => {
    fetchInitialOrders();

    socket.on("order:A", (data) => {
      console.log("수신된 주문:", data);
      if (Array.isArray(data)) {
        setOrders((prev) => [...prev, ...data]);
      } else {
        console.warn("잘못된 데이터 형식:", data);
      }
    });

    return () => {
      socket.off("order:A");
    };
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        🍱 A구역 주문 목록
      </Typography>

      {orders.length === 0 ? (
        <Typography color="textSecondary">현재 주문이 없습니다.</Typography>
      ) : (
        orders.map((item) => (
          <Paper
            key={`${item.timestamp}-${item.itemIndex}`}
            elevation={2}
            sx={{ p: 2, mb: 2 }}
          >
            <Typography variant="subtitle1" fontWeight={600}>
              {item.name} ({item.quantity}개)
            </Typography>
            <Typography variant="body2" color="textSecondary">
              테이블 번호: {item.tableNumber}
            </Typography>
            <Button
              variant="contained"
              color="success"
              size="small"
              sx={{ mt: 1 }}
              onClick={() =>
                setConfirmData({
                  timestamp: item.timestamp,
                  itemIndex: item.itemIndex,
                  name: item.name,
                })
              }
            >
              조리 및 서빙 완료
            </Button>
          </Paper>
        ))
      )}

      {/* ✅ 확인 모달 */}
      <Dialog
        open={Boolean(confirmData)}
        onClose={() => setConfirmData(null)}
      >
        <DialogTitle>서빙 완료 확인</DialogTitle>
        <DialogContent>
          정말로 <strong>{confirmData?.name}</strong> 항목을 완료 처리하시겠습니까?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmData(null)}>취소</Button>
          <Button onClick={confirmServe} variant="contained" color="primary">
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
