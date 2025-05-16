import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Divider
} from "@mui/material";
import axios from "axios";

const zones = ["A", "B", "C"];

export default function EditMenuModal({ open, onClose, onUpdate }) {
  const [menuList, setMenuList] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [edited, setEdited] = useState({ name: "", price: "", zone: "A" });

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

  const handleSelect = (menu) => {
    setSelectedMenu(menu);
    setEdited({ name: menu.name, price: menu.price, zone: menu.zone });
  };

  const handleSave = async () => {
    if (!selectedMenu) return;
    try {
      await axios.put(`https://festival-backend-qydq.onrender.com/api/menu/${selectedMenu.index}`, {
        name: edited.name,
        price: parseInt(edited.price),
        zone: edited.zone,
      });
      onUpdate();
      onClose();
    } catch (err) {
      console.error("수정 실패:", err);
      alert("수정에 실패했습니다.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth={selectedMenu ? "xs" : "sm"}>
      <DialogTitle>{selectedMenu ? "메뉴 수정" : "수정할 메뉴 선택"}</DialogTitle>
      <DialogContent>
        {selectedMenu ? (
          <>
            <TextField
              margin="dense"
              label="메뉴 이름"
              fullWidth
              value={edited.name}
              onChange={(e) => setEdited({ ...edited, name: e.target.value })}
            />
            <TextField
              margin="dense"
              label="가격"
              type="number"
              fullWidth
              value={edited.price}
              onChange={(e) => setEdited({ ...edited, price: e.target.value })}
            />
            <TextField
              margin="dense"
              select
              label="조리 구역"
              fullWidth
              value={edited.zone}
              onChange={(e) => setEdited({ ...edited, zone: e.target.value })}
            >
              {zones.map((z) => (
                <MenuItem key={z} value={z}>{z} 구역</MenuItem>
              ))}
            </TextField>
          </>
        ) : (
          <List>
            {menuList.map((menu, idx) => (
              <React.Fragment key={idx}>
                <ListItem button onClick={() => handleSelect(menu)}>
                  <ListItemText
                    primary={`${menu.name} (${menu.zone})`}
                    secondary={`${menu.price.toLocaleString()}원`}
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
          <Button variant="contained" onClick={handleSave}>
            저장
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
