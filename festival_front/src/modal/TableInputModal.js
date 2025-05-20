import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ToggleButton,
  ToggleButtonGroup,
  Button,
  Stack
} from "@mui/material";


export default function TableInputModal({ open, onClose, onSubmit }) {
  const [xValue,setXValue] = useState();
  const [yValue,setYValue] = useState();

  const tableXPosition = ["A","B","C","D","E","F","G"];
  const tableYPosition1 = ["1","2","3","4","5","6","7","8"];
  const tableYPosition2 = ["9","10","11","12"];

  const handleSubmit = () => {
    const parsed = xValue + "-" + yValue;

    onSubmit(parsed);
    setXValue("");
    setYValue("");
    onClose();
  };

  const handleXChange = (event, newValue) => {
    setXValue(newValue);
  };

  const handleYChange = (event, newValue) => {
    setYValue(newValue);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>🪑 테이블 번호 입력</DialogTitle>
      <DialogContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',  // 수평 중앙 정렬
            justifyContent: 'center', // 수직 중앙 정렬 (필요시)
            gap: 2,
        }}>
        <ToggleButtonGroup
            value={xValue}
            exclusive
            onChange={handleXChange}
            aria-label="X table position"
          >
            {tableXPosition.map((item) => (
              <ToggleButton key={item} value={item} aria-label={item} color="primary"
                  sx={{
                      width: 48,
                      height: 48,
                      fontWeight: 'bold',
                      '&.Mui-selected': {
                        backgroundColor: 'primary.main',
                        color: 'white',
                      },
                      '&.Mui-selected:hover': {
                        backgroundColor: 'primary.dark',
                      },
                  }}>
                {item}
              </ToggleButton>
            ))}
        </ToggleButtonGroup>
        
        <Stack spacing={1} direction="column">
          <ToggleButtonGroup
            value={yValue}
            exclusive
            onChange={handleYChange}
            aria-label="X table position - row 1"
          >
            {tableYPosition1.map((item) => (
              <ToggleButton
                key={item}
                value={item}
                aria-label={item}
                color="primary"
                sx={{
                  width: 48,
                  height: 48,
                  fontWeight: 'bold',
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                  },
                  '&.Mui-selected:hover': {
                    backgroundColor: 'primary.dark',
                  },
                }}
              >
                {item}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          <ToggleButtonGroup
            value={yValue}
            exclusive
            onChange={handleYChange}
            aria-label="X table position - row 2"
          >
            {tableYPosition2.map((item) => (
              <ToggleButton
                key={item}
                value={item}
                aria-label={item}
                color="primary"
                sx={{
                  width: 48,
                  height: 48,
                  fontWeight: 'bold',
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                  },
                  '&.Mui-selected:hover': {
                    backgroundColor: 'primary.dark',
                  },
                }}
              >
                {item}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Stack>


      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>취소</Button>
        <Button variant="contained" onClick={handleSubmit}>
          주문 완료
        </Button>
      </DialogActions>
    </Dialog>
  );
}

