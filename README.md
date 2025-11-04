# 🎪 **Festival Order Management Frontend**

> 실시간으로 축제 주문, 조리, 서빙 현황을 한눈에 확인할 수 있는 프론트엔드 시스템입니다.
> A/B/C 구역별 주문 현황과 카운터 대시보드를 분리해 운영 효율을 극대화하고, WebSocket으로 실시간 상태를 동기화합니다.

🌐 배포 주소: https://didgmltmd.github.io/festival_front/
🖥️ 백엔드 레포: https://github.com/didgmltmd/festival_backend
---

## **프로젝트 개요**

| 항목            | 내용                                                    |
| :------------ | :---------------------------------------------------- |
| **프로젝트명**     | Festival Order Management Frontend                    |
| **목적**        | 축제 부스의 실시간 주문 및 조리 현황 관리                              |
| **핵심 기술**     | React 19, Vite, Zustand, Socket.IO, TailwindCSS / MUI |
| **백엔드 통신 방식** | RESTful API + WebSocket                               |
| **주요 역할**     | 실시간 주문 모니터링, 구역별 조리 현황 표시, 카운터 픽업 관리                  |

---

## **주요 기능**

**실시간 주문 동기화** — Socket.IO로 모든 단말의 주문 상태를 즉시 반영
**구역별 대시보드** — A/B/C 구역별 조리/완료 상태를 한눈에 파악
**카운터 관리 화면** — 픽업 완료/호출 처리 및 품목별 매출 실시간 통계
**지연 알림 및 색상 강조** — 조리 지연 주문 시 시각적 강조
**오프라인 안정성** — 네트워크 끊김 시 로컬 큐 임시 저장 (옵션)

---

## **기술 스택**

```
Frontend: React (19) + TypeScript + Vite
UI: MUI / TailwindCSS + Radix UI
State Management: Zustand / React Query
Socket: socket.io-client
Chart: Recharts (매출/시간대 통계)
```

---

## **폴더 구조 예시**

```
festival_front/
├── src/
│   ├── app/                 # 페이지 라우팅 및 진입점
│   ├── components/          # 공용 UI 컴포넌트 (Card, Modal, Chart 등)
│   ├── features/            # 도메인 단위 (orders, kitchen, counter, stats)
│   │   ├── orders/
│   │   ├── kitchen/
│   │   ├── counter/
│   │   └── stats/
│   ├── hooks/               # 커스텀 훅 (useSocket, useOrders 등)
│   ├── store/               # Zustand 스토어 (ordersStore, uiStore 등)
│   ├── lib/                 # API 클라이언트, 유틸 함수, 상수 정의
│   ├── types/               # 전역 타입 정의 (Order, Item, Zone 등)
│   ├── assets/              # 이미지/폰트 등 정적 리소스
│   └── main.tsx
├── public/
├── index.html
└── vite.config.ts
```

---


---

## **주요 페이지 구성**

| 경로                              | 설명                     |
| :------------------------------ | :--------------------- |
| `/`                             | 운영 대시보드 (요약 카드, 실시간 큐) |
| `/orders`                       | 전체 주문 목록 (필터/정렬 지원)    |
| `/zone/a`, `/zone/b`, `/zone/c` | 구역별 조리 현황 보드           |
| `/counter`                      | 카운터용 픽업 관리 페이지         |
| `/stats`                        | 품목별/시간대별 통계 시각화        |

---

## **API 예시**

### REST

```http
GET    /api/orders?status=pending
POST   /api/orders/:id/start
POST   /api/orders/:id/done
POST   /api/orders/:id/serve
```

### WebSocket

```js
// 클라이언트 → 서버
socket.emit('order:start', { orderId })
socket.emit('order:done', { orderId })
socket.emit('order:serve', { orderId })

// 서버 → 클라이언트
socket.on('order:placed', (order) => {...})
socket.on('order:updated', (order) => {...})
socket.on('order:served', ({ orderId }) => {...})
```

---




> Made with ❤️ by Yang Heeseung & Festival Dev Team
