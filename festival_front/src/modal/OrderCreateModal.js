import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import MenuSelectModal from "./MenuSelectModal";
import TableInputModal from "./TableInputModal";
import saveToLocal from '../function/saveToLocal';

export default function OrderCreateModal({ open, onClose, onOrderComplete }) {
  const [menuList, setMenuList] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [tableNumber, setTableNumber] = useState(null);
  const [outsider,setOutsider] = useState(false);
  const menuDetail = {
    '소세지야채볶음':2,
    '통삼겹마늘간장볶음':2,
    '두부제육볶음':2,
    '골뱅이 소면':2,
    '오뎅탕':1,
    '비빔납작만두':1,
    '황도':1,
    '양념감자':0
  }
  

  const fetchMenu = async () => {
    try {
      const res = await axios.get("https://festival-backend-qydq.onrender.com/api/menu");
      setMenuList(res.data);
    } catch (err) {
      console.error("메뉴 불러오기 실패:", err);
    }
  };

  useEffect(() => {
    if (open) {
      fetchMenu();
      setCart([]);
      setTableNumber(null);
    }
  }, [open]);

  const handleAddToCart = (item, quantity) => {
    let isExist = false;
    const updatedCart = cart.map((data) => {
      if (data.name === item.name) {
        isExist = true;
        return {
          ...data,
          quantity: data.quantity + quantity,
          total: data.total + quantity * item.price,
        };
      }
      return data;
    });

    if (!isExist) {
      const total = item.price * quantity;
      const cartItem = {
        ...item,
        quantity,
        total,
        served: false,
      };
      setCart([...cart, cartItem]);
    } else {
      setCart(updatedCart);
    }

    setSelectedMenu(null);
  };

  const handleRemoveItem = (index) => {
    const updated = [...cart];
    updated.splice(index, 1);
    setCart(updated);
  };

  const handleOutsider = () => {
    setOutsider(!outsider);
  }

  const handleOrderSubmit = () => {
    const updatedCart = outsider
      ? cart.map((item) => {
          if (menuDetail[item.name]) {
            const surcharge = menuDetail[item.name] === 2 ? 4000 : menuDetail[item.name] === 1 ? 2000 : 0;
            return {
              ...item,
              price: item.price + surcharge,
              total: item.total + surcharge,
            };
          }
          return item;
        })
      : cart;

    const totalPrice = updatedCart.reduce((acc, item) => acc + item.total, 0);

    const orderData = {
      tableNumber,
      items: updatedCart,
      totalPrice,
      timestamp: new Date().toISOString(),
      served: false,
      outsider: outsider,
    };

    // ✅ 주문 저장 요청
    axios
      .post("https://festival-backend-qydq.onrender.com/api/orders/complete", orderData)
      .then(() => {
        onOrderComplete();
        setIsSummaryOpen(false);
        saveToLocal();
        onClose();
      })
      .catch((err) => {
        console.error("주문 저장 실패:", err);
        alert("주문 저장에 실패했습니다.");
      });

    // ✅ 외부 손님일 경우 추가 저장
    if (outsider) {
      let drinking = 0;
      updatedCart.forEach((item) => {
        if (menuDetail[item.name]) {
          drinking += menuDetail[item.name] * item.quantity;
        }
      });

      const drunkOrderData = {
        tableNumber,
        items: updatedCart.map(({ name, quantity, zone }) => ({ name, quantity, zone })),
        timestamp: new Date().toISOString(),
        drinking,
      };

      axios
        .post("https://festival-backend-qydq.onrender.com/api/drunk-orders", drunkOrderData)
        .then((res) => {
          console.log("외부 손님 술 주문 저장 성공:", res.data);
        })
        .catch((err) => {
          console.error("외부 손님 술 주문 저장 실패:", err);
        });
    }

};



  return (
    <>
     <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>📝 주문서 작성</DialogTitle>
      <DialogContent sx={{ display: "flex", gap: 2 }}>
        {/* 장바구니 - 고정 영역 */}
        <Box sx={{ flex: 1, backgroundColor: "#f5f5f5", p: 2 }}>
          <Typography variant="h6" gutterBottom>
            🛒 장바구니
          </Typography>
          <List>
            {cart.map((item, idx) => (
              <ListItem key={idx} divider>
                <ListItemText
                  primary={`${item.name} (${item.quantity}개)`}
                  secondary={`${item.total.toLocaleString()}원`}
                />
                <IconButton onClick={() => handleRemoveItem(idx)}>
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
          <Box sx={{ textAlign: "right", mt: 2 }}>
            <Typography variant="subtitle1">
              총액: {cart.reduce((acc, item) => acc + item.total, 0).toLocaleString()}원
            </Typography>
            <Button
              variant="contained"
              color="primary"
              disabled={cart.length === 0}
              onClick={() => setIsTableModalOpen(true)}
              sx={{ mt: 1 }}
            >
              주문 완료
            </Button>
          </Box>
        </Box>

        {/* 메뉴 - 스크롤 영역 */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: "#fff",
            p: 2,
            maxHeight: "60vh",
            overflowY: "auto",
          }}
        >
          <Typography variant="h6" gutterBottom>
            📋 메뉴
          </Typography>
          <List>
            {menuList.map((item, idx) => (
              <React.Fragment key={idx}>
                <ListItem button onClick={() => setSelectedMenu(item)}>
                  <ListItemText
                    primary={`${item.name} (${item.zone})`}
                    secondary={`${item.price.toLocaleString()}원`}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>닫기</Button>
      </DialogActions>
    </Dialog>


      {selectedMenu && (
        <MenuSelectModal
          menu={selectedMenu}
          onClose={() => setSelectedMenu(null)}
          onConfirm={handleAddToCart}
        />
      )}

      {isTableModalOpen && (
        <TableInputModal
          open={isTableModalOpen}
          onClose={() => setIsTableModalOpen(false)}
          onSubmit={(num) => {
            if (num < 1 || num > 100) {
              alert("테이블 번호는 1~100 사이여야 합니다.");
              return;
            }
            setTableNumber(num);
            setIsTableModalOpen(false);
            setIsSummaryOpen(true);
          }}
        />
      )}

      <Dialog open={isSummaryOpen} onClose={() => setIsSummaryOpen(false)}>
        <DialogTitle>🧾 주문 확인</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1">테이블 번호: {tableNumber}</Typography>
          <List>
            {cart.map((item, idx) => (
              <ListItem key={idx}>
                <ListItemText
                  primary={`${item.name} (${item.quantity}개)`}
                  secondary={`${item.total.toLocaleString()}원`}
                />
              </ListItem>
            ))}
          </List>
          <Typography sx={{ mt: 2 }}>
            총액: {cart.reduce((acc, item) => acc + item.total, 0).toLocaleString()}원
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
          variant="contained"
          sx={{
            backgroundColor: outsider ? 'red' : 'primary',
            }}
           onClick={handleOutsider} >
            {outsider ? '외부인' : '재학생'}
          </Button>
          <Button onClick={handleOrderSubmit} variant="contained" color="primary">
            주문 확정
          </Button>
          <Button onClick={() => setIsSummaryOpen(false)}>취소</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
