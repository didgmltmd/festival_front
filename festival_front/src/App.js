import './App.css';
import MainPage from './components/MainPage';
import ASectionPage from './components/ASectionPage';
import BSectionPage from './components/BSectionPage';
import CSectionPage from './components/CSectionPage';
import CounterPage from './components/CounterPage';
import { Routes, Route  } from 'react-router-dom';
import ASectionServerPage from './components/ASectionServerPage';
import BSectionServerPage from './components/BSectionServerPage';
import CSectionServerPage from './components/CSectionServerPage';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/kitchen/A" element={<ASectionPage />} />
        <Route path="/kitchen/B" element={<BSectionPage />} />
        <Route path="/kitchen/C" element={<CSectionPage />} />
        <Route path="/counter" element={<CounterPage />} />
        <Route path="/kitchen/AServer" element={<ASectionServerPage />} />
        <Route path="/kitchen/BServer" element={<BSectionServerPage />} />
        <Route path="/kitchen/CServer" element={<CSectionServerPage />} />
      </Routes>
    </>
  );
}

export default App;
