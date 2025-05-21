import { useEffect, useState, useRef } from "react";
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

export default function BSectionServerPage() {
  const [orders, setOrders] = useState([]);
  const [confirmData, setConfirmData] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio("/1_1-요기요-가게배달-주문x1.mp3");

    const unlockAudio = () => {
      audioRef.current.play().catch(() => {});
      window.removeEventListener("touchstart", unlockAudio);
      window.removeEventListener("click", unlockAudio);
    };
    
    window.addEventListener("touchstart", unlockAudio);
    window.addEventListener("click", unlockAudio);
  }, []);

  const fetchInitialOrders = async () => {
    try {
      const res = await axios.get("https://festival-backend-qydq.onrender.com/api/kitchen/B");
      setOrders(res.data);
    } catch (err) {
      console.error("초기 주문 데이터 로드 실패:", err);
    }
  };

  const confirmServe = async () => {
    if (!confirmData) return;
    const { timestamp, itemIndex } = confirmData;

    try {
      await axios.patch(
        `https://festival-backend-qydq.onrender.com/api/kitchen/${timestamp}/${itemIndex}/serve`
      );

      setOrders((prev) =>
        prev.filter(
          (item) =>
            !(item.timestamp === timestamp && Number(item.itemIndex) === Number(itemIndex))
        )
      );

      socket.emit("orderDeleted", {
        timestamp,
        itemIndexes: [itemIndex],
      });
      socket.emit("orderServed", { zone: "B", timestamp, itemIndex }); // emit

      setConfirmData(null);
    } catch (err) {
      console.error("서빙 완료 처리 실패:", err);
      alert("서빙 처리에 실패했습니다.");
    }
  };

  useEffect(() => {
    fetchInitialOrders();

    const handleNewOrder = (data) => {
      if (Array.isArray(data)) {
        setOrders((prev) => [...prev, ...data]);
        audioRef.current?.play().catch((err) => {
          console.warn("🔇 오디오 재생 실패:", err);
        });
      }
    };

     // 주문 삭제 수신
    const handleOrderDeleted = ({ timestamp, itemIndexes }) => {
      console.log("🗑️ B구역 수신 삭제:", timestamp, itemIndexes);
      setOrders((prev) =>
        prev.filter(
          (order) =>
            !(
              order.timestamp === timestamp &&
              itemIndexes.includes(order.itemIndex)
            )
        )
      );
    };


    const handleOrderServed = ({ timestamp, itemIndexes }) => {
      console.log("🧹 B구역 서빙 완료 수신:", timestamp, itemIndexes);
      setOrders((prev) =>
        prev.filter(
          (order) =>
            !(
              order.timestamp === timestamp &&
              itemIndexes.includes(order.itemIndex)
            )
        )
      );
    };

    socket.on("order:B", handleNewOrder);
    socket.on("orderServed", handleOrderServed);
    socket.on("orderDeleted", handleOrderDeleted);

    return () => {
      socket.off("order:B", handleNewOrder);
      socket.off("orderServed", handleOrderServed);
      socket.off("orderDeleted", handleOrderDeleted);
    };
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        🍱 B구역 조리 대기 목록
      </Typography>

      {orders.length === 0 ? (
        <Typography color="textSecondary">현재 주문이 없습니다.</Typography>
      ) : (
        orders.map((item) => (
          <Paper
            key={`${item.timestamp}-${item.itemIndex}`}
            elevation={2}
            sx={{ p: 2, mb: 2, borderLeft: "4px solid #4caf50" }}
          >
            <Typography variant="h3" fontWeight={600}>
              {item.name} ({item.quantity}개)
            </Typography>
            <Typography variant="h5" color="error" sx={{ mb: 1 }}>
              테이블 번호: {item.tableNumber}
            </Typography>
            <Button
              variant="contained"
              color="success"
              size="small"
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

      <Dialog open={!!confirmData} onClose={() => setConfirmData(null)}>
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