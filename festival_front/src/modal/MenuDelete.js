import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
} from "@mui/material";
import axios from "axios";

export default function MenuDeleteModal({ open, onClose, onUpdate }) {
  const [menuList, setMenuList] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(null);

  // 메뉴 불러오기
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
      setSelectedMenu(null); // 초기화
    }
  }, [open]);

  // 삭제 요청
  const handleDelete = async () => {
    if (!selectedMenu) return;
    try {
      await axios.delete(`https://festival-backend-qydq.onrender.com/api/menu/${selectedMenu.index}`);
      onUpdate(); // 외부 새로고침
      onClose();
    } catch (err) {
      console.error("삭제 실패:", err);
      alert("삭제에 실패했습니다.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth={selectedMenu ? "xs" : "sm"}>
      <DialogTitle>{selectedMenu ? "삭제 확인" : "삭제할 메뉴 선택"}</DialogTitle>
      <DialogContent>
        {selectedMenu ? (
          <Typography>
            <strong>{selectedMenu.name}</strong> 메뉴를 삭제하시겠습니까?
          </Typography>
        ) : (
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
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>닫기</Button>
        {selectedMenu && (
          <Button color="error" variant="contained" onClick={handleDelete}>
            삭제
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
