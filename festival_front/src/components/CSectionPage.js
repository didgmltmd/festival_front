import { useEffect, useState, useRef } from "react";
import {
  Typography,
  Box,
  Paper,
  Button,
  Grid,
} from "@mui/material";
import axios from "axios";
import socket from "../socket";

export default function CSectionPage() {
  const [orders, setOrders] = useState([]);
  const [confirmData, setConfirmData] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio("/sounds/notificationC.MP3");

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
      const res = await axios.get("https://festival-backend-qydq.onrender.com/api/kitchen/C");
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
      socket.emit("orderServed", { zone: "C", timestamp, itemIndex });

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
        setOrders((prev) => [ ...data,...prev]);
        audioRef.current?.play().catch((err) => {
          console.warn("🔇 오디오 재생 실패:", err);
        });
      }
    };

    const handleOrderDeleted = ({ timestamp, itemIndexes }) => {
      console.log("🗑️ C구역 수신 삭제:", timestamp, itemIndexes);
      setOrders((prev) =>
        prev.filter(
          (order) =>
            !(order.timestamp === timestamp && itemIndexes.includes(order.itemIndex))
        )
      );
    };

    const handleOrderServed = ({ timestamp, itemIndexes }) => {
      console.log("🧹 C구역 서빙 완료 수신:", timestamp, itemIndexes);
      setOrders((prev) =>
        prev.filter(
          (order) =>
            !(order.timestamp === timestamp && itemIndexes.includes(order.itemIndex))
        )
      );
    };

    socket.on("order:C", handleNewOrder);
    socket.on("orderServed", handleOrderServed);
    socket.on("orderDeleted", handleOrderDeleted);

    return () => {
      socket.off("order:C", handleNewOrder);
      socket.off("orderServed", handleOrderServed);
      socket.off("orderDeleted", handleOrderDeleted);
    };
  }, []);

  return (
  <Box p={3} sx={{ width: "100%" }}>
    <Typography variant="h4" fontWeight={700} gutterBottom>
      🍱 C구역 조리 대기 목록
    </Typography>

    {orders.length === 0 ? (
      <Typography color="textSecondary">현재 주문이 없습니다.</Typography>
    ) : (
      <Grid container spacing={1.5} sx={{ width: "100%", mt: 2 }}>
        {orders.map((item) => (
          <Grid item xs={12} sm={6} md={3} key={`${item.timestamp}-${item.itemIndex}`}>
            <Paper
                elevation={4}
                sx={{
                  width: "100%",
                  minWidth: 400,
                  height: "100%",
                  minHeight: 280,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  p: 3,
                  borderLeft: "6px solid #4caf50",
                  boxSizing: "border-box",
                }}
              >
              <Typography variant="h3" fontWeight={700} gutterBottom>
                {item.name} ({item.quantity}개)
              </Typography>
              <Typography variant="h4" color="error">
                테이블 번호: {item.tableNumber}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    )}
  </Box>
);

}
