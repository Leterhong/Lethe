import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// 蔬菜数据
const vegetables = [
  { id: 1, name: '胡萝卜', emoji: '🥕', price: 2 },
  { id: 2, name: '西红柿', emoji: '🍅', price: 3 },
  { id: 3, name: '黄瓜', emoji: '🥒', price: 4 },
  { id: 4, name: '卷心菜', emoji: '🥬', price: 5 },
  { id: 5, name: '土豆', emoji: '🥔', price: 2 },
  { id: 6, name: '茄子', emoji: '🍆', price: 3 },
  { id: 7, name: '辣椒', emoji: '🌶️', price: 4 },
  { id: 8, name: '洋葱', emoji: '🧅', price: 3 },
];

export default function MathGame() {
  // 游戏状态
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'gameOver'>('ready');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [bestScore, setBestScore] = useState(0);
  
  // 当前问题状态
  const [currentQuestion, setCurrentQuestion] = useState<any>({ text: '', correctAnswer: 0, vegetables: [], quantities: [] });
  const [userAnswer, setUserAnswer] = useState('');
  const [answerFeedback, setAnswerFeedback] = useState<{correct: boolean, message: string} | null>(null);
  
  // 蔬菜市场状态
  const [marketVegetables, setMarketVegetables] = useState<any[]>([]);
  
  // 计时器引用
  const timerRef = useRef<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(30);
  
  // 加载最佳分数
  useEffect(() => {
    const savedScore = localStorage.getItem('mathGameBestScore');
    if (savedScore) {
      setBestScore(parseInt(savedScore));
    }
  }, []);
  
  // 开始游戏
  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setLevel(1);
    setMarketVegetables([]);
    generateMarket();
    generateQuestion();
    setTimeRemaining(30);
    
    // 启动计时器
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setGameState('gameOver');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  // 生成市场蔬菜
  const generateMarket = () => {
    // 随机选择4-6种蔬菜放入市场
    const shuffled = [...vegetables].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 4 + Math.floor(Math.random() * 3));
    setMarketVegetables(selected);
  };
  
  // 生成问题
  const generateQuestion = () => {
    if (marketVegetables.length === 0) {
      console.error("市场中没有蔬菜数据，无法生成问题");
      return;
    }
    
    // 根据当前等级调整问题难度
    const maxQuantity = Math.min(5, level + 2);
    const useAddition = level > 3 ? Math.random() > 0.5 : false;
    
    // 选择1-2种蔬菜，确保有足够的蔬菜可供选择
    const availableVegs = [...marketVegetables];
    if (availableVegs.length < (useAddition ? 2 : 1)) {
      console.error("可用蔬菜不足，无法生成问题");
      return;
    }
    
    const selectedVegs = availableVegs
      .sort(() => 0.5 - Math.random())
      .slice(0, useAddition ? 2 : 1);
    
    // 生成数量
    const quantities = selectedVegs.map(() => 1 + Math.floor(Math.random() * maxQuantity));
    
    // 计算正确答案
    let correctAnswer = 0;
    let questionText = '';
    
    if (selectedVegs.length === 1) {
      // 单种蔬菜问题
      const veg = selectedVegs[0];
      if (!veg || typeof veg.price === 'undefined') {
        console.error("无效的蔬菜数据", selectedVegs);
        return generateQuestion(); // 尝试重新生成问题
      }
      const quantity = quantities[0];
      correctAnswer = veg.price * quantity;
      questionText = `请问 ${quantity} 个${veg.name}需要多少钱？`;
    } else if (selectedVegs.length >= 2) {
      // 多种蔬菜加法问题
      const veg1 = selectedVegs[0];
      const qty1 = quantities[0];
      const veg2 = selectedVegs[1];
      const qty2 = quantities[1];
      
      if (!veg1 || !veg2 || typeof veg1.price === 'undefined' || typeof veg2.price === 'undefined') {
        console.error("无效的蔬菜数据", selectedVegs);
        return generateQuestion(); // 尝试重新生成问题
      }
      
      correctAnswer = (veg1.price * qty1) + (veg2.price * qty2);
      questionText = `请问 ${qty1} 个${veg1.name}和 ${qty2} 个${veg2.name}一共需要多少钱？`;
    } else {
      console.error("未选择足够的蔬菜来生成问题");
      return;
    }
    
    setCurrentQuestion({
      text: questionText,
      correctAnswer,
      vegetables: selectedVegs,
      quantities
    });
    setUserAnswer('');
    setAnswerFeedback(null);
  };
  
  // 提交答案
  const submitAnswer = () => {
    if (!currentQuestion || !userAnswer.trim()) return;
    
    const userAnswerNum = parseInt(userAnswer);
    const isCorrect = userAnswerNum === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      // 答对了
      setAnswerFeedback({
        correct: true,
        message: '答对了！真棒！'
      });
      
      // 增加分数
      setScore(prev => {
        const newScore = prev + 10 * level;
        if (newScore > bestScore) {
          setBestScore(newScore);
          localStorage.setItem('mathGameBestScore', newScore.toString());
        }
        return newScore;
      });
      
      // 每5分升一级
      const newLevel = Math.floor(score / 50) + 1;
      if (newLevel > level) {
        setLevel(newLevel);
        setTimeRemaining(prev => Math.min(prev + 5, 60)); // 升级增加时间
      }
      
      // 生成新问题
      setTimeout(() => {
        generateQuestion();
      }, 1500);
    } else {
      // 答错了
      setAnswerFeedback({
        correct: false,
        message: `答错了，正确答案是 ${currentQuestion.correctAnswer} 元`
      });
      
      // 减少时间
      setTimeRemaining(prev => Math.max(prev - 5, 0));
    }
  };
  
  // 重置游戏
  const resetGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setGameState('ready');
    setScore(0);
    setLevel(1);
    setTimeRemaining(30);
  };
  
  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 只允许数字输入
    if (/^\d*$/.test(e.target.value)) {
      setUserAnswer(e.target.value);
    }
  };
  
  // 键盘事件处理
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameState === 'playing' && currentQuestion && !answerFeedback) {
        if (e.key === 'Enter') {
          submitAnswer();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, currentQuestion, answerFeedback]);
  
  // 游戏结束时清理
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 flex flex-col items-center p-4">
      {/* 标题区域 */}
      <div className="w-full max-w-md flex justify-between items-center mb-6">
        <Link to="/" className="bg-white/80 hover:bg-white text-green-700 p-2 rounded-full transition-colors shadow-md">
          <i class="fa-solid fa-home"></i>
        </Link>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-green-700 dark:text-green-300">蔬菜市场数学</h1>
          <div className="flex justify-center gap-4 mt-1">
            <div className="bg-white/80 text-green-700 px-3 py-1 rounded-full text-sm font-medium shadow-md">
              分数: {score}
            </div>
            <div className="bg-white/80 text-green-700 px-3 py-1 rounded-full text-sm font-medium shadow-md">
              等级: {level}
            </div>
          </div>
        </div>
        <div className="w-10"></div> {/* 占位，保持居中 */}
      </div>
      
      {/* 游戏容器 */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-green-200 dark:border-green-800">
        {/* 游戏状态界面 */}
        {gameState === 'ready' && (
          <div className="p-8 text-center">
            <div className="text-6xl mb-4">🥬</div>
            <h2 className="text-2xl font-bold text-green-700 mb-2">欢迎来到蔬菜市场！</h2>
            <p className="text-green-600 mb-6">
              在这个有趣的市场中练习数学计算！根据问题算出正确价格，提高你的算术能力！
            </p>
            
            <div className="bg-green-50 rounded-xl p-4 mb-6 text-left">
              <h3 className="font-bold text-green-700 mb-2">游戏规则：</h3>
              <ul className="list-disc list-inside text-green-600 space-y-1">
                <li>根据问题计算蔬菜价格</li>
                <li>输入答案并提交</li>
                <li>答对得分，答错扣分</li>
                <li>每答对5题升级一次</li>
                <li>时间用完游戏结束</li>
              </ul>
            </div>
            
            <div className="flex justify-center gap-4">
              <button 
                onClick={startGame}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transform transition hover:-translate-y-1"
              >
                开始游戏
              </button>
            </div>
            
            <div className="mt-6 text-green-600">
              <p>最高分: <span className="font-bold">{bestScore}</span></p>
            </div>
          </div>
        )}
        
        {/* 游戏进行界面 */}
        {gameState === 'playing' && (
          <>
            {/* 计时器 */}
            <div className="bg-green-500 text-white p-3">
              <div className="flex justify-between items-center">
                <div>剩余时间: {timeRemaining}秒</div>
                <div>等级: {level}</div>
              </div>
              <div className="w-full h-2 bg-green-400 mt-2 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-yellow-400 transition-all duration-1000"
                  style={{ width: `${(timeRemaining / 30) * 100}%` }}
                ></div>
              </div>
            </div>
            
            {/* 蔬菜市场 */}
            <div className="p-4 bg-green-50">
              <h3 className="text-green-700 font-bold mb-2">今日蔬菜价格:</h3>
              <div className="grid grid-cols-4 gap-2">
                {marketVegetables.map(veg => (
                  <div key={veg.id} className="bg-white rounded-lg p-2 text-center shadow-sm">
                    <div className="text-2xl">{veg.emoji}</div>
                    <div className="text-xs text-green-700">{veg.name}</div>
                    <div className="text-sm font-bold text-green-600">{veg.price}元/个</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* 问题区域 */}
            <div className="p-6">
              <div className="bg-white rounded-xl p-6 shadow-md mb-6">
                <h3 className="text-xl font-bold text-green-700 mb-4">问题 {score/10 + 1}</h3>
                 <p className="text-lg text-gray-700 mb-6">{currentQuestion?.text || '正在生成问题...'}</p>
                 
                 {/* 问题相关蔬菜 */}
                <div className="flex justify-center gap-4 mb-6">
                  {currentQuestion.vegetables.map((veg: any, index: number) => (
                    <div key={veg.id} className="text-center">
                      <div className="text-3xl">{veg.emoji}</div>
                      <div>{currentQuestion.quantities[index]}个{veg.name}</div>
                    </div>
                  ))}
                </div>
                
                {/* 答案输入 */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={handleInputChange}
                    onFocus={(e) => e.target.select()}
                    className="flex-grow px-4 py-3 border-2 border-green-300 rounded-lg text-lg focus:outline-none focus:border-green-500"
                    placeholder="输入答案..."
                    autoFocus
                  />
                  <button
                    onClick={submitAnswer}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                  >
                    提交
                  </button>
                </div>
              </div>
              
              {/* 答案反馈 */}
              {answerFeedback && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`p-4 rounded-lg text-center ${
                    answerFeedback.correct 
                      ? 'bg-green-100 text-green-700 border border-green-200' 
                      : 'bg-red-100 text-red-700 border border-red-200'
                  }`}
                >
                  <div className="text-2xl mb-2">
                    {answerFeedback.correct ? '🎉' : '❌'}
                  </div>
                  <p className="font-bold">{answerFeedback.message}</p>
                </motion.div>
              )}
            </div>
          </>
        )}
        
        {/* 游戏结束界面 */}
        {gameState === 'gameOver' && (
          <div className="p-8 text-center">
            <div className="text-6xl mb-4">🏁</div>
            <h2 className="text-2xl font-bold text-green-700 mb-2">游戏结束！</h2>
            <p className="text-gray-600 mb-2">你的得分: <span className="font-bold text-xl">{score}</span></p>
            <p className="text-gray-600 mb-6">达到等级: <span className="font-bold">{level}</span></p>
            
            {score > bestScore && (
              <div className="bg-yellow-100 text-yellow-700 p-3 rounded-lg mb-6">
                <p className="font-bold">新的最高分！</p>
              </div>
            )}
            
            <div className="flex justify-center gap-4">
              <button 
                onClick={resetGame}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform transition hover:-translate-y-1"
              >
                再玩一次
              </button>
              <Link
                to="/"
                className="bg-white border-2 border-green-500 text-green-600 font-bold py-3 px-6 rounded-full shadow-md hover:shadow-lg transform transition hover:-translate-y-1"
              >
                返回首页
              </Link>
            </div>
          </div>
        )}
      </div>
      
      {/* 分数显示 */}
      {gameState === 'playing' && (
        <div className="mt-4 text-center">
          <div className="bg-white/80 text-green-700 px-4 py-2 rounded-full font-bold shadow-md">
            得分: {score}
          </div>
        </div>
      )}
    </div>
  );
}