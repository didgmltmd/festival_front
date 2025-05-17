import axios from "axios";

const saveToLocal = async () => {
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


  export default saveToLocal;