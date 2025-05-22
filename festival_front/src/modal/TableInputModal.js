import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ToggleButton,
  ToggleButtonGroup,
  Button,
  Stack,
  Box
} from "@mui/material";


export default function TableInputModal({ open, onClose, onSubmit }) {
  const [xValue,setXValue] = useState();
  const [yValue,setYValue] = useState();
  const [displayValue,setDisplayValue] = useState();
  const [mode, setMode] = useState("table"); // "table" | "booth" | "outside"


  const tableXPosition = ["A","B","C","D","E","F","G","H","I","J","K","L"];
  const tableYPosition1 = ["1","2","3","4","5","6","7","8","9"];

  const booth = ["여행","보드게임","MZ","실로암","기업분석","러닝","식물"];
  const booth2 = ["연합본부","밴드부","배드민턴","헬스","풋살","영화","OTT"];
  const outTable = {};

  const handleSubmit = () => {
    let parsed = "";

    if (mode === "table") {
      if (!xValue || !yValue) return alert("테이블 위치를 모두 선택해주세요.");
      parsed = `${xValue}-${yValue}`;
    } else {
      if (!displayValue) return alert("값을 입력하거나 선택해주세요.");
      parsed = displayValue;
    }

    onSubmit(parsed);
    setXValue("");
    setYValue("");
    setDisplayValue("");
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
      <Box 
        sx={{
          display:'flex',
          flexDirection:'row',
          justifyContent:"space-between"
        }}
      >
        <DialogTitle>🪑 테이블 번호 입력</DialogTitle>
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={(e, newMode) => {
            if (newMode !== null) {
              setMode(newMode);
              setXValue("");
              setYValue("");
              setDisplayValue("");
            }
          }}
          sx={{
            marginRight:'1rem',
            marginTop:'1rem'
          }}
        >
          <ToggleButton value="table" 
            sx={{
              width: 70,
              height: 48,
              fontWeight: 'bold',
              '&.Mui-selected': {
                backgroundColor: 'primary.dark',
                color: 'white',
              },
              '&.Mui-selected:hover': {
                backgroundColor: '#0d47a1',
              },
            }}
          >테이블</ToggleButton>
          <ToggleButton value="booth"
            sx={{
              width: 70,
              height: 48,
              fontWeight: 'bold',
              '&.Mui-selected': {
                backgroundColor: 'primary.dark',
                color: 'white',
              },
              '&.Mui-selected:hover': {
                backgroundColor: '#0d47a1',
              },
            }}
          >부스</ToggleButton>
          <ToggleButton value="outside"
            sx={{
              width: 100,
              height: 48,
              fontWeight: 'bold',
              '&.Mui-selected': {
                backgroundColor: 'primary.dark', 
                color: 'white',
              },
              '&.Mui-selected:hover': {
                backgroundColor: '#0d47a1', 
              },
            }}
          >외부 테이블</ToggleButton>
        </ToggleButtonGroup>

      </Box>

      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
        }}
      >
        {mode === "table" && (
          <>
            <ToggleButtonGroup value={xValue} exclusive onChange={handleXChange}>
              {tableXPosition.map((item) => (
                <ToggleButton key={item} value={item}
                      sx={{
                  width: 40,
                  height: 48,
                  fontWeight: 'bold',
                  '&.Mui-selected': {
                    backgroundColor: 'primary.dark',
                    color: 'white',
                  },
                  '&.Mui-selected:hover': {
                    backgroundColor: '#0d47a1',
                  },
                }}
                >{item}</ToggleButton>
              ))}
            </ToggleButtonGroup>

            <ToggleButtonGroup value={yValue} exclusive onChange={handleYChange}>
              {tableYPosition1.map((item) => (
                <ToggleButton key={item} value={item}
                  sx={{
                    width: 40,
                    height: 48,
                    fontWeight: 'bold',
                    '&.Mui-selected': {
                      backgroundColor: 'primary.dark',
                      color: 'white',
                    },
                    '&.Mui-selected:hover': {
                      backgroundColor: '#0d47a1',
                    },
                  }}
                >{item}</ToggleButton>
              ))}
            </ToggleButtonGroup>
          </>
        )}

        {mode === "booth" && (
          <>
          <ToggleButtonGroup value={displayValue} exclusive onChange={(e, val) => setDisplayValue(val)}>
            {booth.map((item) => (
              <ToggleButton key={item} value={item}
              sx={{
                width: 78,
                height: 48,
                fontWeight: 'bold',
                '&.Mui-selected': {
                  backgroundColor: 'primary.dark',
                  color: 'white',
                },
                '&.Mui-selected:hover': {
                  backgroundColor: '#0d47a1',
                },
              }}
              >{item}</ToggleButton>
            ))}
          </ToggleButtonGroup>
          <ToggleButtonGroup value={displayValue} exclusive onChange={(e, val) => setDisplayValue(val)}>
            {booth2.map((item) => (
              <ToggleButton key={item} value={item}
              sx={{
                width: 78,
                height: 48,
                fontWeight: 'bold',
                '&.Mui-selected': {
                  backgroundColor: 'primary.dark',
                  color: 'white',
                },
                '&.Mui-selected:hover': {
                  backgroundColor: '#0d47a1',
                },
              }}
              >{item}</ToggleButton>
            ))}
          </ToggleButtonGroup>


          </>

        )}

        {mode === "outside" && (
          <input
            type="text"
            placeholder="외부 테이블 이름 입력"
            value={displayValue || ""}
            onChange={(e) => setDisplayValue(e.target.value)}
            style={{
              padding: "8px",
              fontSize: "16px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              width: "200px"
            }}
          />
        )}
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

