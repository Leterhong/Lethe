import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import GameHome from "@/pages/GameHome";
import MemoryGame from "@/pages/MemoryGame";
import JumpingGame from "@/pages/JumpingGame";
import MathGame from "@/pages/MathGame";

import BrickBreakerGame from "@/pages/BrickBreakerGame";
import Two048Game from "@/pages/Two048Game";
import AuthorPage from "@/pages/AuthorPage";
import AuthorBlogPage from "@/pages/AuthorBlogPage";
import MessageBoardPage from "@/pages/MessageBoardPage";
import QRCodeGenerator from "@/pages/QRCodeGenerator";

import { useState } from "react";
import { AuthContext } from '@/contexts/authContext';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, logout }}
    >
      <Routes>
        <Route path="/" element={<GameHome />} />
        <Route path="/old-home" element={<Home />} />
        <Route path="/game" element={<MemoryGame />} />
          <Route path="/jumping" element={<JumpingGame />} />
          <Route path="/math" element={<MathGame />} />
            <Route path="/brick-breaker" element={<BrickBreakerGame />} />
            <Route path="/2048" element={<Two048Game />} />
            <Route path="/qrcode" element={<QRCodeGenerator />} />

          <Route path="/author" element={<AuthorPage />} />
          <Route path="/author-blog" element={<AuthorBlogPage />} />
          <Route path="/message-board" element={<MessageBoardPage />} />

        <Route path="/other" element={<div className="text-center text-xl">Other Page - Coming Soon</div>} />
      </Routes>
    </AuthContext.Provider>
  );
}