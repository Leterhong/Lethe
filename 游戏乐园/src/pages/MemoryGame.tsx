import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import GameBoard from '@/components/memory-game/GameBoard';
import SettingsPanel from '@/components/memory-game/SettingsPanel';
import ScoreDisplay from '@/components/memory-game/ScoreDisplay';
import GameOverModal from '@/components/memory-game/GameOverModal';
import PauseMenu from '@/components/memory-game/PauseMenu';
import Tutorial from '@/components/memory-game/Tutorial';
import { useMemoryGame } from '@/hooks/useMemoryGame';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';

// 游戏主题定义
const THEMES = {
  animals: {
    name: '动物',
    icons: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔'],
    backgroundColor: 'from-blue-400 to-indigo-500',
    cardBack: 'bg-gradient-to-br from-blue-600 to-indigo-700'
  },
  fruits: {
    name: '水果',
    icons: ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍒', '🥭', '🥑', '🥝', '🍍', '🥥', '🍑', '🍅'],
    backgroundColor: 'from-green-400 to-emerald-500',
    cardBack: 'bg-gradient-to-br from-green-600 to-emerald-700'
  },
  emojis: {
    name: '表情',
    icons: ['😀', '😂', '😍', '🤔', '😎', '🥳', '🤩', '😜', '🤪', '😇', '🥺', '😉', '😋', '🤤', '😱', '😴'],
    backgroundColor: 'from-purple-400 to-pink-500',
    cardBack: 'bg-gradient-to-br from-purple-600 to-pink-700'
  },
  vehicles: {
    name: '交通工具',
    icons: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🚚', '🚛', '🚜', '✈️', '🚀', '🚢'],
    backgroundColor: 'from-amber-400 to-orange-500',
    cardBack: 'bg-gradient-to-br from-amber-600 to-orange-700'
  }
};

// 游戏难度定义
const DIFFICULTIES = {
  easy: { name: '简单', size: 4, maxTime: null, maxMoves: null },
  medium: { name: '中等', size: 5, maxTime: null, maxMoves: null },
  hard: { name: '困难', size: 6, maxTime: null, maxMoves: null }
};

// 游戏模式定义
const GAME_MODES = {
  classic: { name: '经典模式', description: '找出所有配对卡片' },
  timed: { name: '计时挑战', description: '在限定时间内完成' },
  limitedMoves: { name: '限步模式', description: '在有限次数内完成' },
  progressive: { name: '渐进难度', description: '成功后增加难度' }
};

const MemoryGame: React.FC = () => {
  // 游戏状态管理
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  
  // 游戏配置
  const [difficulty, setDifficulty] = useState<keyof typeof DIFFICULTIES>('easy');
  const [theme, setTheme] = useState<keyof typeof THEMES>('animals');
  const [gameMode, setGameMode] = useState<keyof typeof GAME_MODES>('classic');
  const [cardFlipTime, setCardFlipTime] = useState(1000);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const { isDark, toggleTheme } = useTheme();
  
  // 获取游戏逻辑hook
  const {
    cards,
    flippedCards,
    matchedCards,
    attempts,
    timeElapsed,
    gameScore,
    isProcessing,
    startGame,
    flipCard,
    resetGame,
    pauseGame,
    resumeGame,
    gameState
  } = useMemoryGame({
    size: DIFFICULTIES[difficulty].size,
    cardIcons: THEMES[theme].icons,
    flipDelay: cardFlipTime,
    gameMode,
    soundEnabled
  });
  
  // 处理游戏结束
  useEffect(() => {
    if (gameState === 'won' || gameState === 'lost') {
      setGameOver(true);
    }
  }, [gameState]);
  
  // 处理难度变化
  const handleDifficultyChange = useCallback((newDifficulty: keyof typeof DIFFICULTIES) => {
    setDifficulty(newDifficulty);
    resetGame({
      size: DIFFICULTIES[newDifficulty].size,
      cardIcons: THEMES[theme].icons
    });
    setSettingsOpen(false);
  }, [resetGame, theme]);
  
  // 处理主题变化
  const handleThemeChange = useCallback((newTheme: keyof typeof THEMES) => {
    setTheme(newTheme);
    resetGame({
      size: DIFFICULTIES[difficulty].size,
      cardIcons: THEMES[newTheme].icons
    });
    setSettingsOpen(false);
  }, [resetGame, difficulty]);
  
  // 处理游戏模式变化
  const handleGameModeChange = useCallback((newMode: keyof typeof GAME_MODES) => {
    setGameMode(newMode);
    resetGame({
      size: DIFFICULTIES[difficulty].size,
      cardIcons: THEMES[theme].icons,
      gameMode: newMode
    });
    setSettingsOpen(false);
  }, [resetGame, difficulty, theme]);
  
  // 处理设置变化
  const handleSettingsChange = useCallback((settings: {
    difficulty: keyof typeof DIFFICULTIES,
    theme: keyof typeof THEMES,
    gameMode: keyof typeof GAME_MODES,
    flipTime: number,
    soundEnabled: boolean
  }) => {
    setDifficulty(settings.difficulty);
    setTheme(settings.theme);
    setGameMode(settings.gameMode);
    setCardFlipTime(settings.flipTime);
    setSoundEnabled(settings.soundEnabled);
    
    resetGame({
      size: DIFFICULTIES[settings.difficulty].size,
      cardIcons: THEMES[settings.theme].icons,
      flipDelay: settings.flipTime,
      gameMode: settings.gameMode,
      soundEnabled: settings.soundEnabled
    });
    
    setSettingsOpen(false);
  }, [resetGame]);
  
  // 重新开始游戏
  const handleRestart = useCallback(() => {
    setGameOver(false);
    resetGame({
      size: DIFFICULTIES[difficulty].size,
      cardIcons: THEMES[theme].icons,
      gameMode
    });
  }, [resetGame, difficulty, theme, gameMode]);
  
  // 开始新游戏（从设置面板）
  const handleStartNewGame = useCallback(() => {
    setSettingsOpen(false);
    setShowTutorial(false);
    startGame();
  }, [startGame]);
  
  // 渲染游戏主界面
  return (
     <div className={cn(
      'min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-300',
      `bg-gradient-to-br ${THEMES[theme].backgroundColor} text-white dark:from-gray-900 dark:to-gray-800 dark:text-gray-100`
    )}>
      {/* 游戏标题和主题切换 */}
       <header className="w-full max-w-3xl mb-6 flex justify-between items-center">         <Link to="/" className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors">
           <i class="fa-solid fa-home"></i>
         </Link>
         <div className="text-center">
           <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight drop-shadow-lg">
             记忆翻牌游戏
           </h1>           <p className="text-lg opacity-90">{GAME_MODES[gameMode].description}</p>
         </div>
         <button
           onClick={() => toggleTheme()}
           className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
           aria-label={isDark ? "切换到白天模式" : "切换到夜晚模式"}
         >
           {isDark ? (
             <i className="fa-solid fa-sun"></i>
           ) : (
             <i className="fa-solid fa-moon"></i>
           )}
         </button>
      </header>
      
      {/* 分数显示 */}
      <ScoreDisplay
        attempts={attempts}
        timeElapsed={timeElapsed}
        score={gameScore}
        difficulty={DIFFICULTIES[difficulty].name}
        onSettingsClick={() => setSettingsOpen(true)}
        onPauseClick={() => {
          pauseGame();
          setPaused(true);
        }}
        onLeaderboardClick={() => setShowLeaderboard(true)}
      />
      
      {/* 游戏区域 */}
      <main className="relative w-full max-w-3xl flex-grow flex items-center justify-center my-4">
        {/* 游戏板 */}
        <AnimatePresence>
          {gameState !== 'paused' && !showTutorial && !showLeaderboard && (
            <GameBoard
              key="game-board"
              cards={cards}
              flippedCards={flippedCards}
              matchedCards={matchedCards}
              flipCard={flipCard}
              isProcessing={isProcessing}
              size={DIFFICULTIES[difficulty].size}
              cardBackStyle={THEMES[theme].cardBack}
              flipTime={cardFlipTime}
            />
          )}
        </AnimatePresence>
        
        {/* 教程 */}
        {showTutorial && (
          <Tutorial
            onClose={() => setShowTutorial(false)}
            onStartGame={() => {
              setShowTutorial(false);
              startGame();
            }}
          />
        )}
        
        {/* 排行榜 */}
        {showLeaderboard && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md text-gray-800 shadow-2xl transform transition-all">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">排行榜</h2>
                <button 
                  onClick={() => setShowLeaderboard(false)}
                  className="text-gray-500 hover:text-gray-800"
                >
                  <i class="fa-solid fa-times"></i>
                </button>
              </div>
              <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                {/* 这里简化处理，实际项目中应该从本地存储加载数据 */}
                <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center font-bold mr-3">1</div>
                    <span>玩家1</span>
                  </div>
                  <span className="font-bold">1250</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center font-bold mr-3">2</div>
                    <span>玩家2</span>
                  </div>
                  <span className="font-bold">1100</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-amber-700 rounded-full flex items-center justify-center font-bold mr-3">3</div>
                    <span>玩家3</span>
                  </div>
                  <span className="font-bold">950</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold mr-3">4</div>
                    <span>你</span>
                  </div>
                  <span className="font-bold">{gameScore}</span>
                </div>
              </div>
              <button 
                onClick={() => setShowLeaderboard(false)}
                className="mt-4 w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
              >
                返回游戏
              </button>
            </div>
          </div>
        )}
      </main>
      
      {/* 设置面板 */}
      {settingsOpen && (
        <SettingsPanel
          difficulty={difficulty}
          theme={theme}
          gameMode={gameMode}
          cardFlipTime={cardFlipTime}
          soundEnabled={soundEnabled}
          difficulties={DIFFICULTIES}
          themes={THEMES}
          gameModes={GAME_MODES}
          onDifficultyChange={handleDifficultyChange}
          onThemeChange={handleThemeChange}
          onGameModeChange={handleGameModeChange}
          onSettingsChange={handleSettingsChange}
          onClose={() => setSettingsOpen(false)}
          onStartGame={handleStartNewGame}
        />
      )}
      
      {/* 暂停菜单 */}
      {paused && (
        <PauseMenu
          onResume={() => {
            setPaused(false);
            resumeGame();
          }}
          onRestart={handleRestart}
          onSettings={() => {
            setSettingsOpen(true);
            setPaused(false);
          }}
          onQuit={() => {
            // 在实际应用中，这里可以导航到主页
            resetGame({
              size: DIFFICULTIES[difficulty].size,
              cardIcons: THEMES[theme].icons
            });
            setPaused(false);
            setShowTutorial(true);
          }}
        />
      )}
      
      {/* 游戏结束弹窗 */}
      {gameOver && (
        <GameOverModal
          gameState={gameState}
          score={gameScore}
          attempts={attempts}
          timeElapsed={timeElapsed}
          onRestart={handleRestart}
          onSettings={() => {
            setSettingsOpen(true);
            setGameOver(false);
          }}
          onShare={() => {
            // 模拟分享功能
            alert(`我在记忆翻牌游戏中获得了${gameScore}分！`);
          }}
        />
      )}
    </div>
  );
};

export default MemoryGame;