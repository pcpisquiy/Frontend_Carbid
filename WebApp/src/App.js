import './App.css';
import Header from './components/Header';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Publish from './pages/Publish';
import RequireAuth from './routes/RequireAuth';
import Home from './pages/Home.jsx';
import AuctionDetail from './pages/AuctionDetail';

export default function App(){
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/publicar" element={
            <RequireAuth>
              <Publish />
            </RequireAuth>
          }
        />
         <Route path="/subasta/:id" element={<AuctionDetail />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
