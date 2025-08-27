import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SettingsPanelProps {
  difficulty: string;
  theme: string;
  gameMode: string;
  cardFlipTime: number;
  soundEnabled: boolean;
  difficulties: Record<string, { name: string; size: number }>;
  themes: Record<string, { name: string; icons: string[]; backgroundColor: string; cardBack: string }>;
  gameModes: Record<string, { name: string; description: string }>;
  onDifficultyChange: (difficulty: string) => void;
  onThemeChange: (theme: string) => void;
  onGameModeChange: (mode: string) => void;
  onSettingsChange: (settings: any) => void;
  onClose: () => void;
  onStartGame: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  difficulty,
  theme,
  gameMode,
  cardFlipTime,
  soundEnabled,
  difficulties,
  themes,
  gameModes,
  onDifficultyChange,
  onThemeChange,
  onGameModeChange,
  onSettingsChange,
  onClose,
  onStartGame
}) => {
  // 本地状态管理
  const [localDifficulty, setLocalDifficulty] = useState(difficulty);
  const [localTheme, setLocalTheme] = useState(theme);
  const [localGameMode, setLocalGameMode] = useState(gameMode);
  const [localCardFlipTime, setLocalCardFlipTime] = useState(cardFlipTime);
  const [localSoundEnabled, setLocalSoundEnabled] = useState(soundEnabled);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // 当props变化时更新本地状态
  useEffect(() => {
    setLocalDifficulty(difficulty);
    setLocalTheme(theme);
    setLocalGameMode(gameMode);
    setLocalCardFlipTime(cardFlipTime);
    setLocalSoundEnabled(soundEnabled);
  }, [difficulty, theme, gameMode, cardFlipTime, soundEnabled]);
  
  // 处理应用设置
  const handleApplySettings = () => {
    onSettingsChange({
      difficulty: localDifficulty,
      theme: localTheme,
      gameMode: localGameMode,
      flipTime: localCardFlipTime,
      soundEnabled: localSoundEnabled
    });
  };
  
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <motion.div
        className="bg-white rounded-2xl p-6 w-full max-w-md text-gray-800 shadow-2xl"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">游戏设置</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            <i class="fa-solid fa-times"></i>
          </button>
        </div>
        
        <div className="space-y-6">
          {/* 难度设置 */}
          <div>
            <h3 className="text-lg font-semibold mb-3">难度</h3>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(difficulties).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => setLocalDifficulty(key)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    localDifficulty === key
                      ? 'border-blue-500 bg-blue-50 font-medium'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {value.name}
                  <div className="text-sm opacity-70">{value.size}x{value.size}</div>
                </button>
              ))}
            </div>
          </div>
          
          {/* 主题设置 */}
          <div>
            <h3 className="text-lg font-semibold mb-3">主题</h3>
            <div className="grid grid-cols-4 gap-3">
              {Object.entries(themes).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => setLocalTheme(key)}
                  className={`p-3 rounded-lg border-2 flex flex-col items-center transition-all ${
                    localTheme === key
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{value.icons[0]}</div>
                  <div className="text-xs">{value.name}</div>
                </button>
              ))}
            </div>
          </div>
          
          {/* 游戏模式 */}
          <div>
            <h3 className="text-lg font-semibold mb-3">游戏模式</h3>
            <div className="space-y-2">
              {Object.entries(gameModes).map(([key, value]) => (
                <label key={key} className="flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all">
                  <input
                    type="radio"
                    name="gameMode"
                    checked={localGameMode === key}
                    onChange={() => setLocalGameMode(key)}
                    className="mr-3 h-4 w-4 text-blue-500"
                  />
                  <div>
                    <div className="font-medium">{value.name}</div>
                    <div className="text-sm text-gray-500">{value.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
          
          {/* 高级设置 */}
          <div>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center text-blue-500 hover:text-blue-600 text-sm font-medium"
            >
              {showAdvanced ? (
                <>收起高级设置 <i class="fa-solid fa-chevron-up ml-1"></i></>
              ) : (
                <>高级设置 <i class="fa-solid fa-chevron-down ml-1"></i></>
              )}
            </button>
            
            <AnimatePresence>
              {showAdvanced && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-4 space-y-4 overflow-hidden"
                >
                  {/* 翻牌时间 */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      翻牌时间: {localCardFlipTime}ms
                    </label>
                    <input
                      type="range"
                      min="500"
                      max="2000"
                      step="100"
                      value={localCardFlipTime}
                      onChange={(e) => setLocalCardFlipTime(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>
                  
                  {/* 音效设置 */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center text-sm font-medium">
                      <i class="fa-solid fa-volume-up mr-2"></i> 音效
                    </label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={localSoundEnabled}
                        onChange={(e) => setLocalSoundEnabled(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                    </label>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        <div className="mt-8 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleApplySettings}
            className="flex-1 py-2 px-4 border border-blue-500 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
          >
            应用设置
          </button>
          <button
            onClick={onStartGame}
            className="flex-1 py-2 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            开始游戏
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsPanel;