import axios from "axios";

const saveToLocal = async () => {
    try {
      const [menuRes, ordersRes] = await Promise.all([
        axios.get('https://festival-backend-qydq.onrender.com/api/menu'),
        axios.get('https://festival-backend-qydq.onrender.com/api/orders'),
      ]);

      localStorage.setItem('menuBackup', JSON.stringify(menuRes.data));
      localStorage.setItem('ordersBackup', JSON.stringify(ordersRes.data));


    } catch (error) {
      console.error('데이터 저장 실패:', error);
    }
  };


  export default saveToLocal;