import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GameOverModalProps {
  gameState: 'won' | 'lost';
  score: number;
  attempts: number;
  timeElapsed: number;
  onRestart: () => void;
  onSettings: () => void;
  onShare: () => void;
}

// 格式化时间
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const GameOverModal: React.FC<GameOverModalProps> = ({
  gameState,
  score,
  attempts,
  timeElapsed,
  onRestart,
  onSettings,
  onShare
}) => {
  // 根据游戏结果设置不同的内容
  const resultContent = gameState === 'won' ? (
    <>
      <div className="text-5xl mb-4">🎉</div>
      <h2 className="text-2xl font-bold text-green-600 mb-1">恭喜你赢了！</h2>
      <p className="text-gray-500 mb-6">你成功完成了记忆翻牌挑战！</p>
    </>
  ) : (
    <>
      <div className="text-5xl mb-4">😢</div>
      <h2 className="text-2xl font-bold text-red-600 mb-1">游戏结束</h2>
      <p className="text-gray-500 mb-6">再接再厉，下次一定能赢！</p>
    </>
  );
  
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <motion.div
        className="bg-white rounded-2xl p-8 w-full max-w-md text-center shadow-2xl"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {resultContent}
        
        {/* 成绩统计 */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="grid grid-cols-3 gap-2">
            <div>
              <div className="text-sm text-gray-500">得分</div>
              <motion.div
                className="text-2xl font-bold text-yellow-500"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 20 }}
              >
                {score}
              </motion.div>
            </div>
            <div>
              <div className="text-sm text-gray-500">尝试次数</div>
              <div className="text-2xl font-bold">{attempts}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">用时</div>
              <div className="text-2xl font-bold">{formatTime(timeElapsed)}</div>
            </div>
          </div>
        </div>
        
        {/* 操作按钮 */}
        <div className="space-y-3">
          <button
            onClick={onRestart}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:opacity-90 transition-opacity text-lg font-medium"
          >
            再来一局
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={onSettings}
              className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <i class="fa-solid fa-cog mr-1"></i> 设置
            </button>
            <button
              onClick={onShare}
              className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <i class="fa-solid fa-share-alt mr-1"></i> 分享
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default GameOverModal;