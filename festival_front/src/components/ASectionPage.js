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

export default function ASectionPage() {
  const [orders, setOrders] = useState([]);
  const [confirmData, setConfirmData] = useState(null);
  const audioRef = useRef(null);

  // 초기 알림음 unlock 설정 (iOS 대응)
  useEffect(() => {
    audioRef.current = new Audio("/sounds/notification.mp3");

    const unlockAudio = () => {
      audioRef.current.play().catch(() => {});
      window.removeEventListener("touchstart", unlockAudio);
      window.removeEventListener("click", unlockAudio);
    };

    window.addEventListener("touchstart", unlockAudio);
    window.addEventListener("click", unlockAudio);
  }, []);

  // 초기 주문 불러오기
  const fetchInitialOrders = async () => {
    try {
      const res = await axios.get(
        "https://festival-backend-qydq.onrender.com/api/kitchen/A"
      );
      setOrders(res.data);
    } catch (err) {
      console.error("초기 주문 데이터 로드 실패:", err);
    }
  };

  // 서빙 완료 처리
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
            !(item.timestamp === timestamp && item.itemIndex === itemIndex)
        )
      );
      setConfirmData(null);
    } catch (err) {
      console.error("서빙 완료 처리 실패:", err);
      alert("서빙 처리에 실패했습니다.");
    }
  };

  // 소켓 수신 및 알림음 재생
  useEffect(() => {
    fetchInitialOrders();

    const handleNewOrder = (data) => {
      console.log("📡 A구역 수신 주문:", data);
      if (Array.isArray(data)) {
        setOrders((prev) => [...prev, ...data]);

        // 알림음 재생
        audioRef.current?.play().catch((err) => {
          console.warn("🔇 오디오 재생 실패:", err);
        });
      }
    };

    socket.on("order:A", handleNewOrder);
    return () => socket.off("order:A", handleNewOrder);
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        🍱 A구역 조리 대기 목록
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
            <Typography variant="subtitle1" fontWeight={600}>
              {item.name} ({item.quantity}개)
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
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

      {/* 서빙 확인 모달 */}
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
