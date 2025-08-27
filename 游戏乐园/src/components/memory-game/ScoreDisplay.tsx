import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ScoreDisplayProps {
  attempts: number;
  timeElapsed: number;
  score: number;
  difficulty: string;
  onSettingsClick: () => void;
  onPauseClick: () => void;
  onLeaderboardClick: () => void;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  attempts,
  timeElapsed,
  score,
  difficulty,
  onSettingsClick,
  onPauseClick,
  onLeaderboardClick
}) => {
  // 格式化时间
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="w-full max-w-3xl bg-white/10 backdrop-blur-md rounded-xl p-4 mb-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        {/* 难度显示 */}
        <div className="flex items-center bg-white/20 px-4 py-2 rounded-full">
          <i class="fa-solid fa-signal mr-2"></i>
          <span className="font-medium">难度: {difficulty}</span>
        </div>
        
        {/* 分数信息 */}
        <div className="grid grid-cols-3 gap-4 w-full md:w-auto text-center">
          <div className="bg-white/20 px-4 py-2 rounded-lg">
            <div className="text-sm opacity-80">尝试次数</div>
            <motion.div 
              className="text-xl font-bold"
              animate={{ scale: attempts > 0 ? [1, 1.2, 1] : 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              initial={false}
            >
              {attempts}
            </motion.div>
          </div>
          
          <div className="bg-white/20 px-4 py-2 rounded-lg">
            <div className="text-sm opacity-80">用时</div>
            <div className="text-xl font-bold">{formatTime(timeElapsed)}</div>
          </div>
          
          <div className="bg-white/20 px-4 py-2 rounded-lg">
            <div className="text-sm opacity-80">得分</div>
            <motion.div 
              className="text-xl font-bold text-yellow-300"
              animate={{ scale: score > 0 ? [1, 1.2, 1] : 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              initial={false}
            >
              {score}
            </motion.div>
          </div>
        </div>
        
        {/* 操作按钮 */}
        <div className="flex gap-2">
          <button
            onClick={onLeaderboardClick}
            className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
            aria-label="查看排行榜"
          >
            <i class="fa-solid fa-trophy"></i>
          </button>
          
          <button
            onClick={onSettingsClick}
            className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
            aria-label="游戏设置"
          >
            <i class="fa-solid fa-cog"></i>
          </button>
          
          <button
            onClick={onPauseClick}
            className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
            aria-label="暂停游戏"
          >
            <i class="fa-solid fa-pause"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScoreDisplay;