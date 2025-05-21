import { useEffect, useState } from "react";
import io from "socket.io-client";
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import axios from "axios";

const socket = io("https://festival-backend-qydq.onrender.com");

export default function DrunkPage() {
  const [orders, setOrders] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const menuDetail = {
    '소세지야채볶음': 2,
    '통삼겹마늘구이': 2,
    '두부제육볶음': 2,
    '골뱅이 소면': 2,
    '양념감자': 1,
    '오뎅탕': 1,
    '비빔납작만두': 1,
    '황도': 1,
    '우동':1
  };

  // ✅ 주문의 술 수치를 계산하는 함수 (공통으로 사용)
  const calculateDrinking = (items) => {
    let total = 0;
    items.forEach((item) => {
      console.log("받은 항목:", item.name, "수량:", item.quantity);
      if (menuDetail[item.name] && item.quantity > 0) {
        total += menuDetail[item.name] * item.quantity;
      }
    });
    return total;
  };

  // ✅ 초기 주문 불러오기
  async function fetchDrunkOrders() {
    try {
      const res = await axios.get("https://festival-backend-qydq.onrender.com/api/drunk-orders");

      const enrichedOrders = res.data
          .filter((order) => order.drinkingDelivered === false) // ✅ 술 전달 안된 것만
          .map((order) => ({
              ...order,
              drinking: calculateDrinking(order.items),
      }));


      setOrders(enrichedOrders);
    } catch (err) {
      console.error("술 주문 조회 실패:", err);
    }
  }
  useEffect(() => {

    fetchDrunkOrders();
    console.log(orders);
  }, []);

  // ✅ 실시간 주문 수신
  useEffect(() => {
    socket.on("order:drunk", (data) => {
        fetchDrunkOrders();
    });

    return () => {
        socket.off("order:drunk");
    };
}, []);

// ✅ 모달 열기
const handleClickDelivered = (id) => {
    setSelectedOrderId(id);
    setModalOpen(true);
};

  // ✅ 술 전달 처리
  const confirmDrinkingDelivered = async () => {
    if (!selectedOrderId) {
      console.warn("선택된 주문 ID가 없습니다.");
      return;
    }

    try {
      await axios.patch(
        `https://festival-backend-qydq.onrender.com/api/drunk-orders/${selectedOrderId}/drinking-delivered`,
        { delivered: true }
      );

      setOrders((prev) => prev.filter((order) => order.id !== selectedOrderId));
    } catch (err) {
      console.error("상태 업데이트 실패:", err);
    } finally {
      setModalOpen(false);
      setSelectedOrderId(null);
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        🍻 외부 손님 주문 리스트
      </Typography>

      {orders.length === 0 ? (
        <Typography color="text.secondary">아직 주문이 없습니다.</Typography>
      ) : (
        orders.map((order, index) => (
          <Card key={index} variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                테이블 {order.tableNumber}번 (주문 시각: {order.timestamp})
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                총 술병 🍺: {order.drinking || 0}
              </Typography>
              <List dense>
                {order.items.map((item, idx) => (
                  <div key={idx}>
                    <ListItem>
                      <ListItemText
                        primary={`${item.name} x ${item.quantity}`}
                        secondary={`존: ${item.zone}`}
                      />
                    </ListItem>
                    {idx !== order.items.length - 1 && <Divider />}
                  </div>
                ))}
              </List>
              <Button
                variant="outlined"
                color="warning"
                onClick={() => handleClickDelivered(order.id)}
                sx={{ mt: 2 }}
              >
                🚚 술 전달 전 (클릭 시 확인)
              </Button>
            </CardContent>
          </Card>
        ))
      )}

      {/* 확인 모달 */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <DialogTitle>술 전달 확인</DialogTitle>
        <DialogContent>
          <Typography>정말로 술 전달 완료 처리하시겠습니까?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>취소</Button>
          <Button
            onClick={confirmDrinkingDelivered}
            color="success"
            variant="contained"
            disabled={!selectedOrderId} // ✅ 방어 로직
          >
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
