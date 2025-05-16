import './App.css';
import MainPage from './components/MainPage';
import ASectionPage from './components/ASectionPage';
import BSectionPage from './components/BSectionPage';
import CSectionPage from './components/CSectionPage';
import CounterPage from './components/CounterPage';
import { Routes, Route  } from 'react-router-dom';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/kitchen/A" element={<ASectionPage />} />
        <Route path="/kitchen/B" element={<BSectionPage />} />
        <Route path="/kitchen/C" element={<CSectionPage />} />
        <Route path="/counter" element={<CounterPage />} />
      </Routes>
    </>
  );
}

export default App;
