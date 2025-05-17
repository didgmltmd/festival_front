import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { AppBar, Toolbar, Button, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import MenuAdd from '../modal/MenuAdd';
import MenuEdit from '../modal/MenuEdit'
import MenuDeleteModal from "../modal/MenuDelete";
import OrderCreateModal from "../modal/OrderCreateModal";
import OrderListModal from "../modal/OrderListModal";
import ASectionOrderModal from "../modal/ASectionOrderModal";
import BSectionOrderModal from "../modal/BSectionOrderModal";
import CSectionOrderModal from "../modal/CSectionOrderModal";

const PageLayout = styled(Box)`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const Section = styled(Box)`
  display: flex;
  flex: 1;
`;

const LeftBody = styled(Box)`
  flex: 2;
  display: flex;
  flex-direction: column;
  background-color: #f3f6f9;
  padding: 1.5rem;
  overflow: hidden;
`;

const ListWrapper = styled(Box)`
  flex: 1;
  overflow-y: auto;
  margin-bottom: 1rem;
`;

const Footer = styled(Box)`
  padding: 0.75rem 1rem;
  background-color: #e8f0fe;
  border-top: 1px solid #ccc;
  font-weight: bold;
  font-size: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RightBody = styled(Box)`
  flex: 1;
  background-color: #fff;
  padding: 1.5rem;
  border-left: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const OrderedList = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.2rem;
  margin-bottom: 0.8rem;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
  transition: background-color 0.2s;

  &:hover {
    background-color: #f9f9f9;
  }
`;

export default function CounterPage() {
  const navigate = useNavigate();
  const [orderedList, setOrderedList] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [isMenuAddModalOpen, setIsMenuAddModalOpen] = useState(false);
  const [isMenuEditModalOpen, setIsMenuEditModalOpen] = useState(false);
  const [isMenuDeleteModalOpen, setIsMenuDeleteModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isOrderListModalOpen, setIsOrderListModalOpen] = useState(false);
  const [isASectionModalOpen, setIsASectionModalOpen] = useState(false);
  const [isBSectionModalOpen, setIsBSectionModalOpen] = useState(false);
  const [isCSectionModalOpen, setIsCSectionModalOpen] = useState(false);

  const fetchOrderedData = () => {
    axios
      .get('https://festival-backend-qydq.onrender.com/api/sales/summary')
      .then((res) => {
        setOrderedList(res.data);
        const total = res.data.reduce((acc, item) => acc + item.totalRevenue, 0);
        setTotalSales(total);
      })
      .catch((err) => console.error('메뉴 데이터 불러오기 실패:', err));
  };

  useEffect(() => {
    fetchOrderedData();
  }, []);

  const postAllOrders = async (orders) => {
    try {
      await Promise.all(
        orders.map((order) =>
          axios.post(
            'https://festival-backend-qydq.onrender.com/api/orders/complete',
            order,
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          )
        )
      );

    } catch (error) {
      console.error('일부 주문 저장 실패:', error);
      alert('주문 저장 중 오류가 발생했습니다.');
    }
  };

  const saveDataToLocal = async () => {
    try {
      const [menuRes, ordersRes] = await Promise.all([
        axios.get('https://festival-backend-qydq.onrender.com/api/menu'),
        axios.get('https://festival-backend-qydq.onrender.com/api/orders'),
      ]);

      localStorage.setItem('menuBackup', JSON.stringify(menuRes.data));
      localStorage.setItem('ordersBackup', JSON.stringify(ordersRes.data));

      alert('데이터가 localStorage에 저장되었습니다.');
    } catch (error) {
      console.error('데이터 저장 실패:', error);
      alert('데이터 저장에 실패했습니다.');
    }
  };
  const addMenuItem = async (data) => {
  try {
    const newMenu = {
      name: data.name,
      price: data.price,
      zone: data.zone,
    };

    const response = await axios.post(
      'https://festival-backend-qydq.onrender.com/api/menu',
      newMenu,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    } catch (error) {
      alert('메뉴 추가중 오류발생생');
    }
  };

  const loadDataFromLocal = async () => {
    try {
      const [menuRes, ordersRes] = await Promise.all([
        axios.get('https://festival-backend-qydq.onrender.com/api/menu'),
        axios.get('https://festival-backend-qydq.onrender.com/api/orders'),
      ]);

      const orders = JSON.parse(localStorage.getItem('ordersBackup'));
      const menu = JSON.parse(localStorage.getItem('menuBackup'));
      let menuLatestData = false;
      let ordersLatestData = false;
      let updateMenuLilst = false;
      let updateOrdersList = false;

      if(menu.length === menuRes.data.length){
        menuLatestData = true;
      }else{
        let dropedMenuData = [];
        menu.map((localData) => {
          let isDataExist = false;
          menuRes.data.map((serverData) => {
            if(serverData.name === localData.name){
              isDataExist = true;
            }
          })

          if(!isDataExist){
            dropedMenuData.push(localData);
          }
        })

        dropedMenuData.map((data) => {
          addMenuItem(data);
          updateMenuLilst = true;
        })
      }

      if(orders.length === ordersRes.data.length){
        ordersLatestData = true;
      }else{
        let dropedOrderData = [];
        orders.map((localData) => {
          let isDataExist = false;
          ordersRes.data.map((serverData) => {
            if(serverData.name === localData.name){
              isDataExist = true;
            }
          })

          if(!isDataExist){
            dropedOrderData.push(localData);
          }
        })
        postAllOrders(dropedOrderData);
        updateOrdersList = true;
      }


      if(menuLatestData && ordersLatestData){
        console.log(menu,menuRes);
        console.log(orders,ordersRes);
        alert("데이터가 최신입니다.");
      }else{
        if(updateMenuLilst || updateOrdersList){
          alert("데이터가 업데이트되었습니다.");
        }
      }

      fetchOrderedData();
    } catch (error) {
      alert("데이터 업데이트 중 오류발생",error);
    }
  };

  return (
    <PageLayout>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            카운터 페이지
          </Typography>
          <Box sx={{ display: "flex", gap: "1rem", ml: "auto" }}>
            <Button variant="outlined" color="inherit" onClick={saveDataToLocal}>로컬로 저장하기</Button>
            <Button variant="outlined" color="inherit" onClick={loadDataFromLocal}>로컬정보 불러오기</Button>
            <Button variant="outlined" color="inherit" onClick={() => setIsOrderListModalOpen(true)}>주문내역 확인</Button>
            <Button variant="outlined" color="inherit" onClick={() => setIsASectionModalOpen(true)}>A구역 주문</Button>
            <Button variant="outlined" color="inherit" onClick={() => setIsBSectionModalOpen(true)}>B구역 주문</Button>
            <Button variant="outlined" color="inherit" onClick={() => setIsCSectionModalOpen(true)}>C구역 주문</Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Section>
        <LeftBody>
          <Typography variant="h6" gutterBottom>
            📊 품목별 판매 내역
          </Typography>

          <ListWrapper>
            {orderedList.map((data, idx) => (
              <OrderedList key={idx}>
                <Box sx={{ flex: 2, fontWeight: 600 }}>{data.name}</Box>
                <Box sx={{ flex: 1, textAlign: "center" }}>{data.totalSold}개</Box>
                <Box sx={{ flex: 1, textAlign: "right", color: "#1976d2", fontWeight: 500 }}>
                  {data.totalRevenue.toLocaleString()}원
                </Box>
              </OrderedList>
            ))}
          </ListWrapper>

          <Footer>
            <span>총 매출</span>
            <span style={{ color: "#d32f2f" }}>{totalSales.toLocaleString()}원</span>
          </Footer>
        </LeftBody>

        <RightBody>
          <Button variant="contained" color="primary" fullWidth onClick={() => setIsOrderModalOpen(true)}>
            주문서 작성
          </Button>
          <Button variant="contained" color="secondary" fullWidth onClick={() => setIsMenuAddModalOpen(true)}>
            메뉴 추가
          </Button>
          <Button variant="outlined" color="warning" fullWidth onClick={() => setIsMenuEditModalOpen(true)}>
            메뉴 수정
          </Button>
          <Button variant="outlined" color="error" fullWidth onClick={() => setIsMenuDeleteModalOpen(true)}>
            메뉴 삭제
          </Button>
        </RightBody>
      </Section>

      <MenuAdd
        open={isMenuAddModalOpen}
        onClose={() => setIsMenuAddModalOpen(false)}
        onAdd={fetchOrderedData}
      />

      <MenuEdit
        open={isMenuEditModalOpen}
        onClose={() => setIsMenuEditModalOpen(false)}
        onUpdate={() => fetchOrderedData()} 
        />

        <MenuDeleteModal
            open={isMenuDeleteModalOpen}
            onClose={() => setIsMenuDeleteModalOpen(false)}
            onUpdate={() => fetchOrderedData()} 
        />

        <OrderCreateModal
            open={isOrderModalOpen}
            onClose={() => setIsOrderModalOpen(false)}
            onOrderComplete={fetchOrderedData}
        />

        <OrderListModal
            open={isOrderListModalOpen}
            onClose={() => setIsOrderListModalOpen(false)}
            onUpdate={() => fetchOrderedData()} 
        />

        <ASectionOrderModal
            open={isASectionModalOpen}
            onClose={() => setIsASectionModalOpen(false)}
        />

        <BSectionOrderModal
            open={isBSectionModalOpen}
            onClose={() => setIsBSectionModalOpen(false)}
        />

        <CSectionOrderModal
            open={isCSectionModalOpen}
            onClose={() => setIsCSectionModalOpen(false)}
        />

    </PageLayout>
  );
}
