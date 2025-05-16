import { io } from "socket.io-client";

// 백엔드 WebSocket 서버 주소로 변경 (Render 주소 사용 가능)
const socket = io("https://festival-backend-qydq.onrender.com", {
  transports: ["websocket"],
});

export default socket;