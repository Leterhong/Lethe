import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';

// 定义卡片接口
interface Card {
  id: number;
  icon: string;
  matched: boolean;
}

// 定义游戏配置接口
interface GameConfig {
  size: number;
  cardIcons: string[];
  flipDelay?: number;
  gameMode?: 'classic' | 'timed' | 'limitedMoves' | 'progressive';
  soundEnabled?: boolean;
  timeLimit?: number;
  moveLimit?: number;
}

// 定义游戏状态类型
type GameState = 'idle' | 'playing' | 'paused' | 'won' | 'lost';

// 定义排行榜记录接口
interface LeaderboardRecord {
  score: number;
  attempts: number;
  time: number;
  date: string;
  difficulty: string;
}

export function useMemoryGame(initialConfig: GameConfig) {
  // 游戏状态
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedCards, setMatchedCards] = useState<number[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameScore, setGameScore] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [gameState, setGameState] = useState<GameState>('idle');
  const [config, setConfig] = useState<GameConfig>(initialConfig);
  
  // 计时器引用
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gameStartTimeRef = useRef<number>(0);
  const timeElapsedRef = useRef(0);
  
  // 生成卡片
  const generateCards = useCallback((size: number, icons: string[]): Card[] => {
    const cardPairs = size * size / 2;
    const selectedIcons = [...icons].sort(() => 0.5 - Math.random()).slice(0, cardPairs);
    const cardIcons = [...selectedIcons, ...selectedIcons];
    
    return cardIcons
      .sort(() => 0.5 - Math.random())
      .map((icon, index) => ({
        id: index,
        icon,
        matched: false
      }));
  }, []);
  
  // 初始化游戏
  const initializeGame = useCallback((currentConfig: GameConfig) => {
    setCards(generateCards(currentConfig.size, currentConfig.cardIcons));
    setFlippedCards([]);
    setMatchedCards([]);
    setAttempts(0);
    setTimeElapsed(0);
    setGameScore(0);
    timeElapsedRef.current = 0;
    
    // 根据游戏模式设置不同的限制
    if (currentConfig.gameMode === 'timed' && !currentConfig.timeLimit) {
      // 基于难度设置时间限制（秒）
      currentConfig.timeLimit = currentConfig.size * currentConfig.size * 3;
    }
    
    if (currentConfig.gameMode === 'limitedMoves' && !currentConfig.moveLimit) {
      // 基于难度设置移动限制
      currentConfig.moveLimit = Math.floor(currentConfig.size * currentConfig.size * 1.5);
    }
  }, [generateCards]);
  
  // 开始游戏
  const startGame = useCallback(() => {
    if (gameState === 'playing') return;
    
    setGameState('playing');
    gameStartTimeRef.current = Date.now();
    
    // 启动计时器
    if (!timerRef.current) {
      timerRef.current = setInterval(() => {
        timeElapsedRef.current += 1;
        setTimeElapsed(timeElapsedRef.current);
        
        // 检查计时模式是否超时
        if (config.gameMode === 'timed' && config.timeLimit) {
          if (timeElapsedRef.current >= config.timeLimit) {
            endGame(false);
          }
        }
      }, 1000);
    }
  }, [gameState, config]);
  
  // 暂停游戏
  const pauseGame = useCallback(() => {
    if (gameState !== 'playing') return;
    
    setGameState('paused');
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [gameState]);
  
  // 恢复游戏
  const resumeGame = useCallback(() => {
    if (gameState !== 'paused') return;
    
    setGameState('playing');
    
    // 重启计时器
    if (!timerRef.current) {
      timerRef.current = setInterval(() => {
        timeElapsedRef.current += 1;
        setTimeElapsed(timeElapsedRef.current);
        
        // 检查计时模式是否超时
        if (config.gameMode === 'timed' && config.timeLimit) {
          if (timeElapsedRef.current >= config.timeLimit) {
            endGame(false);
          }
        }
      }, 1000);
    }
  }, [gameState, config]);
  
  // 重置游戏
  const resetGame = useCallback((newConfig?: Partial<GameConfig>) => {
    // 清除计时器
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // 更新配置
    const updatedConfig = { ...config, ...newConfig };
    setConfig(updatedConfig);
    
    // 初始化游戏
    initializeGame(updatedConfig);
    setGameState('idle');
  }, [config, initializeGame]);
  
  // 翻转卡片
  const flipCard = useCallback((cardId: number) => {
    // 如果游戏未开始、正在处理或卡片已匹配，则不执行操作
    if (
      gameState !== 'playing' ||
      isProcessing ||
      matchedCards.includes(cardId) ||
      flippedCards.includes(cardId) ||
      flippedCards.length >= 2
    ) {
      return;
    }
    
    // 翻转卡片
    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);
    
    // 如果翻转了两张卡片，检查匹配
    if (newFlippedCards.length === 2) {
      setAttempts(prev => prev + 1);
      setIsProcessing(true);
      
      // 检查限步模式是否已达上限
      if (config.gameMode === 'limitedMoves' && config.moveLimit) {
        if (attempts + 1 >= config.moveLimit) {
          setTimeout(() => {
            endGame(false);
          }, config.flipDelay || 1000);
          return;
        }
      }
      
      // 获取翻转的卡片
      const [firstId, secondId] = newFlippedCards;
      const firstCard = cards.find(card => card.id === firstId);
      const secondCard = cards.find(card => card.id === secondId);
      
      // 检查匹配
      if (firstCard && secondCard && firstCard.icon === secondCard.icon) {
        // 匹配成功
        setTimeout(() => {
          const newMatchedCards = [...matchedCards, firstId, secondId];
          setMatchedCards(newMatchedCards);
          setFlippedCards([]);
          setIsProcessing(false);
          
          // 播放匹配成功音效
          if (config.soundEnabled) {
            // 在实际应用中，这里会播放音效
          }
          
          // 更新分数
          calculateScore();
          
          // 检查游戏是否胜利
          if (newMatchedCards.length === cards.length) {
            endGame(true);
          }
        }, config.flipDelay || 1000);
      } else {
        // 匹配失败
        setTimeout(() => {
          setFlippedCards([]);
          setIsProcessing(false);
          
          // 播放匹配失败音效
          if (config.soundEnabled) {
            // 在实际应用中，这里会播放音效
          }
        }, config.flipDelay || 1000);
      }
    }
  }, [gameState, isProcessing, matchedCards, flippedCards, cards, attempts, config]);
  
  // 计算分数
  const calculateScore = useCallback(() => {
    // 基于尝试次数和用时计算分数
    const baseScore = 1000;
    const attemptPenalty = attempts * 10;
    const timePenalty = Math.floor(timeElapsed / 5) * 5;
    const score = Math.max(0, baseScore - attemptPenalty - timePenalty);
    
    setGameScore(score);
  }, [attempts, timeElapsed]);
  
  // 保存分数到本地存储
  const saveScore = useCallback(() => {
    try {
      // 获取难度名称
      const difficultyName = config.size === 4 ? '简单' : 
                            config.size === 5 ? '中等' : '困难';
      
      // 创建新记录
      const newRecord: LeaderboardRecord = {
        score: gameScore,
        attempts,
        time: timeElapsed,
        date: new Date().toISOString(),
        difficulty: difficultyName
      };
      
      // 从本地存储获取现有记录
      const storedRecords = localStorage.getItem('memoryGameLeaderboard');
      const leaderboard: Record<string, LeaderboardRecord[]> = storedRecords 
        ? JSON.parse(storedRecords) 
        : {};
      
      // 确保难度分类存在
      if (!leaderboard[difficultyName]) {
        leaderboard[difficultyName] = [];
      }
      
      // 添加新记录并按分数排序
      leaderboard[difficultyName].push(newRecord);
      leaderboard[difficultyName].sort((a, b) => b.score - a.score);
      
      // 只保留前10条记录
      leaderboard[difficultyName] = leaderboard[difficultyName].slice(0, 10);
      
      // 保存回本地存储
      localStorage.setItem('memoryGameLeaderboard', JSON.stringify(leaderboard));
    } catch (error) {
      console.error('Failed to save score:', error);
    }
  }, [config.size, gameScore, attempts, timeElapsed]);

  // 结束游戏
  const endGame = useCallback((isVictory: boolean) => {
    // 清除计时器
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // 计算最终分数
    calculateScore();
    
    // 更新游戏状态
    setGameState(isVictory ? 'won' : 'lost');
    
    // 如果胜利，保存成绩
    if (isVictory) {
      saveScore();
      
      // 渐进难度模式，增加难度
      if (config.gameMode === 'progressive') {
        const newSize = Math.min(config.size + 1, 6); // 最大6x6
        if (newSize > config.size) {
          setTimeout(() => {
            resetGame({ size: newSize });
            toast.success(`恭喜！进入${newSize}x${newSize}难度！`);
            startGame();
          }, 3000);
        }
      }
    }
  }, [calculateScore, config, resetGame, saveScore, startGame]);
  
  // 初始化游戏
  useEffect(() => {
    initializeGame(config);
  }, [initializeGame, config]);
  
  // 清理函数
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  
  return {
    cards,
    flippedCards,
    matchedCards,
    attempts,
    timeElapsed,
    gameScore,
    isProcessing,
    gameState,
    startGame,
    flipCard,
    resetGame,
    pauseGame,
    resumeGame
  };
}