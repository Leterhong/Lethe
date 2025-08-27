import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// 难度级别定义
const DIFFICULTIES = {
  easy: { name: '简单', min: 1, max: 50, attempts: 10, timeLimit: 60 },
  medium: { name: '中等', min: 1, max: 100, attempts: 8, timeLimit: 45 },
  hard: { name: '困难', min: 1, max: 200, attempts: 7, timeLimit: 30 }
};

export default function NumberGuessingGame() {
  // 游戏状态
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'gameOver'>('ready');
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  
  // 游戏配置
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  
  // 当前游戏数据
  const [targetNumber, setTargetNumber] = useState(0);
  const [userGuess, setUserGuess] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [guesses, setGuesses] = useState<Array<{value: number, result: 'high' | 'low' | 'correct'}>>([]);
  const [message, setMessage] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(DIFFICULTIES[difficulty].timeLimit);
  
  // 计时器引用
const timerRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // 加载最佳分数
  useEffect(() => {
    const savedScore = localStorage.getItem('numberGuessBestScore');
    if (savedScore) {
      setBestScore(parseInt(savedScore));
    }
  }, []);
  
  // 难度变化时更新设置
  useEffect(() => {
    if (gameState === 'ready') {
      setTimeRemaining(DIFFICULTIES[difficulty].timeLimit);
    }
  }, [difficulty, gameState]);
  
  // 清理计时器
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  
  // 开始游戏
  const startGame = () => {
    // 生成目标数字
    const { min, max, attempts: maxAttempts } = DIFFICULTIES[difficulty];
    const newTarget = Math.floor(Math.random() * (max - min + 1)) + min;
    
    setTargetNumber(newTarget);
    setAttempts(0);
    setGuesses([]);
    setMessage('');
    setUserGuess('');
    setGameState('playing');
    setTimeRemaining(DIFFICULTIES[difficulty].timeLimit);
    
    // 启动计时器
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          endGame(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // 聚焦输入框
    setTimeout(() => {
      inputRef.current?.focus();
    }, 500);
  };
  
  // 处理猜测
  const handleGuess = () => {
    if (!userGuess || gameState !== 'playing') return;
    
    const guess = parseInt(userGuess);
    const { min, max, attempts: maxAttempts } = DIFFICULTIES[difficulty];
    
    // 验证输入
    if (isNaN(guess) || guess < min || guess > max) {
      setMessage(`请输入${min}到${max}之间的有效数字`);
      return;
    }
    
    // 检查猜测
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    
    let result: 'high' | 'low' | 'correct';
    let newMessage = '';
    
    if (guess === targetNumber) {
      // 猜对了
      result = 'correct';
      newMessage = `恭喜你猜对了！答案就是 ${targetNumber}！`;
      setGuesses([...guesses, { value: guess, result }]);
      
      // 计算得分
      const baseScore = 1000;
      const attemptPenalty = (newAttempts / maxAttempts) * 500;
      const timePenalty = ((DIFFICULTIES[difficulty].timeLimit - timeRemaining) / DIFFICULTIES[difficulty].timeLimit) * 300;
      const newScore = Math.max(0, Math.round(baseScore - attemptPenalty - timePenalty));
      
      setScore(newScore);
      
      // 保存最高分
      if (newScore > bestScore) {
        setBestScore(newScore);
        localStorage.setItem('numberGuessBestScore', newScore.toString());
      }
      
      // 结束游戏
      endGame(true);
    } else if (guess > targetNumber) {
      // 猜高了
      result = 'high';
      newMessage = `猜高了！试试更小的数字`;
      setGuesses([...guesses, { value: guess, result }]);
    } else {
      // 猜低了
      result = 'low';
      newMessage = `猜低了！试试更大的数字`;
      setGuesses([...guesses, { value: guess, result }]);
    }
    
    setMessage(newMessage);
    setUserGuess('');
    
    // 检查是否用完猜测次数
    if (newAttempts >= maxAttempts) {
      setMessage(`游戏结束！正确答案是 ${targetNumber}`);
      endGame(false);
    }
    
    // 聚焦输入框
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };
  
  // 结束游戏
  const endGame = (isVictory: boolean) => {
    setGameState('gameOver');
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };
  
  // 重置游戏
  const resetGame = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setGameState('ready');
    setGuesses([]);
    setAttempts(0);
    setMessage('');
  };
  
  // 处理键盘回车
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && gameState === 'playing') {
      handleGuess();
    }
  };
  
  // 获取当前难度配置
  const currentDifficulty = DIFFICULTIES[difficulty];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center p-4">
      {/* 游戏标题和分数 */}
      <div className="w-full max-w-md mb-6 flex justify-between items-center">
        <Link to="/" className="bg-white/80 hover:bg-white text-blue-700 p-2 rounded-full transition-colors shadow-md">
          <i className="fa-solid fa-home"></i>
        </Link>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-blue-700">猜数字游戏</h1>
          <div className="flex justify-center gap-4 mt-2">
            <div className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-blue-700">
              分数: {score}
            </div>
            <div className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-blue-700">
              最高分: {bestScore}
            </div>
          </div>
        </div>
        <div className="w-10"></div> {/* 占位，保持居中 */}
      </div>
      
      {/* 游戏容器 */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-blue-200 dark:border-blue-800">
        {/* 游戏状态界面 */}
        {gameState === 'ready' && (
          <div className="p-8 text-center">
            <div className="text-6xl mb-4">🔢</div>
            <h2 className="text-2xl font-bold text-blue-700 mb-2">欢迎来到猜数字游戏！</h2>
            <p className="text-blue-600 mb-6">
              系统会随机生成一个数字，你需要在限定次数内猜出这个数字。
            </p>
            
            {/* 难度选择 */}
            <div className="mb-8">
              <h3 className="font-bold text-blue-700 mb-3">选择难度:</h3>
              <div className="flex justify-center gap-4">
                {(['easy', 'medium', 'hard'] as const).map(diff => (
                  <button
                    key={diff}
                    onClick={() => setDifficulty(diff)}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      difficulty === diff
                        ? 'bg-blue-500 text-white font-bold shadow-lg'
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}
                  >
                    {DIFFICULTIES[diff].name}
                    <div className="text-xs mt-1">
                      {DIFFICULTIES[diff].min}-{DIFFICULTIES[diff].max}, {DIFFICULTIES[diff].attempts}次机会
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            <button 
              onClick={startGame}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 px-8 rounded-full text-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              开始游戏
            </button>
          </div>
        )}
        
        {/* 游戏进行界面 */}
        {gameState === 'playing' && (
          <div className="p-6">
            {/* 游戏状态 */}
            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <span className="text-blue-700 font-medium">数字范围:</span>
                  <span className="ml-2"> {currentDifficulty.min}-{currentDifficulty.max}</span>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">剩余机会:</span>
                  <span className="ml-2"> {currentDifficulty.attempts - attempts}/{currentDifficulty.attempts}</span>
                </div>
              </div>
              
              {/* 计时器 */}
              <div className="w-full bg-blue-200 rounded-full h-2.5 mb-1">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000"
                  style={{ width: `${(timeRemaining / currentDifficulty.timeLimit) * 100}%` }}
                ></div>
              </div>
              <div className="text-right text-sm text-blue-700">
                剩余时间: {timeRemaining}秒
              </div>
            </div>
            
            {/* 猜测输入 */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-blue-700 mb-4 text-center">猜猜看是哪个数字？</h3>
              <div className="flex gap-3">
                <input
                  ref={inputRef}
                  type="number"
                  value={userGuess}
                  onChange={(e) => setUserGuess(e.target.value)}
                  onKeyDown={handleKeyPress}
                  min={currentDifficulty.min}
                  max={currentDifficulty.max}
                  className="flex-grow px-4 py-3 border-2 border-blue-300 rounded-lg text-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  placeholder="输入你猜的数字..."
                  autoFocus
                />
                <button
                  onClick={handleGuess}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  提交
                </button>
              </div>
            </div>
            
            {/* 反馈信息 */}
            {message && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-100 text-blue-800 p-3 rounded-lg mb-6 text-center font-medium"
              >
                {message}
              </motion.div>
            )}
            
            {/* 猜测历史 */}
            <div>
              <h3 className="text-blue-700 font-bold mb-2">猜测历史:</h3>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pb-2">
                {guesses.map((guess, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      guess.result === 'high' 
                        ? 'bg-red-100 text-red-700' 
                        : guess.result === 'low'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {guess.value}
                    {guess.result === 'high' && ' ↓'}
                    {guess.result === 'low' && ' ↑'}
                    {guess.result === 'correct' && ' ✔️'}
                  </motion.div>
                ))}
                {guesses.length === 0 && (
                  <div className="text-gray-400 text-center w-full py-2">
                    暂无猜测记录
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* 游戏结束界面 */}
        {gameState === 'gameOver' && (
          <div className="p-8 text-center">
            <div className="text-6xl mb-4">
              {guesses.some(g => g.result === 'correct') ? '🎉' : '🤔'}
            </div>
            <h2 className="text-2xl font-bold text-blue-700 mb-2">
              {guesses.some(g => g.result === 'correct') ? '恭喜你赢了！' : '游戏结束'}
            </h2>
            <p className="text-gray-600 mb-2">
              {guesses.some(g => g.result === 'correct') 
                ? `你用了${attempts}次猜出了正确数字` 
                : `正确答案是 ${targetNumber}`}
            </p>
            <p className="text-xl font-bold text-blue-600 mb-6">本次得分: {score}</p>
            
            {score > bestScore && score > 0 && (
              <div className="bg-yellow-100 text-yellow-700 p-3 rounded-lg mb-6 animate-pulse">
                <p className="font-bold">新的最高分！</p>
              </div>
            )}
            
            <div className="flex justify-center gap-4">
              <button 
                onClick={startGame}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                再玩一次
              </button>
              <Link
                to="/"
                className="bg-white border-2 border-blue-500 text-blue-600 font-bold py-3 px-6 rounded-full transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
              >
                返回首页
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}