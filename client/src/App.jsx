import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[#090909]">
      <Header />
      <main className="flex-1 pt-14">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/receive" element={<HomePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
