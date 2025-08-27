import React from 'react';
import { motion } from 'framer-motion';

interface PauseMenuProps {
  onResume: () => void;
  onRestart: () => void;
  onSettings: () => void;
  onQuit: () => void;
}

const PauseMenu: React.FC<PauseMenuProps> = ({
  onResume,
  onRestart,
  onSettings,
  onQuit
}) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <motion.div
        className="bg-white rounded-2xl p-6 w-full max-w-md text-center shadow-2xl"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <h2 className="text-2xl font-bold mb-6">游戏暂停</h2>
        
        <div className="space-y-3">
          <button
            onClick={onResume}
            className="w-full py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:opacity-90 transition-opacity text-lg font-medium"
          >
            <i class="fa-solid fa-play mr-2"></i> 继续游戏
          </button>
          
          <button
            onClick={onRestart}
            className="w-full py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <i class="fa-solid fa-rotate-right mr-2"></i> 重新开始
          </button>
          
          <button
            onClick={onSettings}
            className="w-full py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <i class="fa-solid fa-cog mr-2"></i> 设置
          </button>
          
          <button
            onClick={onQuit}
            className="w-full py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            <i class="fa-solid fa-sign-out-alt mr-2"></i> 退出游戏
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default PauseMenu;