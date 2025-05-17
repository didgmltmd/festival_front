import React from "react"
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography
} from "@mui/material"
import axios from "axios";


export default function ResetModal({open, onClose,onUpdate}) {
    const getData = async () => {
    try {
      const ordersRes = await axios.get('https://festival-backend-qydq.onrender.com/api/orders')

      localStorage.setItem("ordersBackup", JSON.stringify([]));

        console.log(ordersRes);

        ordersRes.data.map((item) => {
            axios
            .delete(
            `https://festival-backend-qydq.onrender.com/api/orders/${encodeURIComponent(item.timestamp)}`
            )
            .then(() => {
                onUpdate();     
            })
            .catch((err) => {
            });
        })

    } catch (error) {
      console.error('데이터 초기화화 실패:', error);
    }
  };




    const resetData = () => {
        getData();
        onClose();
    }
    

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>❗ 삭제 확인</DialogTitle>
            <DialogContent>
                <Typography>
                정말로 데이터를 삭제하시겠습니까?
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>취소</Button>
                <Button onClick={resetData} color="error" variant="contained">
                삭제
                </Button>
            </DialogActions>
        </Dialog>
  );

}