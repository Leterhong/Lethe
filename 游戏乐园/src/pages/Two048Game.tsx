import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';

// 定义游戏状态类型
type GameStatus = 'playing' | 'won' | 'lost';
// 定义方向类型
type Direction = 'up' | 'down' | 'left' | 'right';
// 定义格子类型
type Cell = {
  value: number;
  merged: boolean;
  position: { x: number; y: number };
  id: string;
};
// 定义棋盘类型
type Board = (Cell | null)[][];
  
const Two048Game: React.FC = () => {
  const { isDark } = useTheme();
  const [board, setBoard] = useState<Board>(Array(4).fill(null).map(() => Array(4).fill(null)));;
  const [score, setScore] = useState(0);;
  const [bestScore, setBestScore] = useState(0);;
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');;
  const [gameMessage, setGameMessage] = useState('');;;
  
 // 键盘事件监听引用
  const keyDownRef = useRef<(e: KeyboardEvent) => void>(null);
  
  // 初始化游戏状态
  useEffect(() => {
    // 从本地存储加载最高分
    const savedBestScore = localStorage.getItem('2048BestScore');
    
    if (savedBestScore) {
      setBestScore(parseInt(savedBestScore));
    }
    
    // 初始化游戏
    resetGame();
    
    // 设置键盘事件监听
    keyDownRef.current = (e: KeyboardEvent) => {
      if (gameStatus !== 'playing') return;
      
      switch(e.key) {
        case 'ArrowUp':
          move('up');
          break;
        case 'ArrowDown':
          move('down');
          break;
        case 'ArrowLeft':
          move('left');
          break;
        case 'ArrowRight':
          move('right');
          break;
        case 'r':
        case 'R':
          resetGame();
          break;
      }
    };
    
    window.addEventListener('keydown', keyDownRef.current);
    
    return () => {
      if (keyDownRef.current) {
        window.removeEventListener('keydown', keyDownRef.current);
      }
    };
  }, [gameStatus]);
  
  // 生成随机ID
  const generateId = (x: number, y: number): string => {
    return `cell-${x}-${y}-${Date.now()}`;
  };
  
  // 在随机空位置生成新数字(2或4)
  const generateNewNumber = useCallback((currentBoard: Board): Board => {
    const newBoard = currentBoard.map(row => [...row]);
    const emptyCells: {x: number, y: number}[] = [];
    
    // 找出所有空位置
    for (let x = 0; x < 4; x++) {
      for (let y = 0; y < 4; y++) {
        if (!newBoard[x][y]) {
          emptyCells.push({ x, y });
        }
      }
    }
    
    // 如果没有空位置，返回原棋盘
    if (emptyCells.length === 0) return newBoard;
    
    // 随机选择一个空位置
    const { x, y } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    
    // 90%概率生成2，10%概率生成4
    const value = Math.random() < 0.9 ? 2 : 4;
    
    newBoard[x][y] = {
      value,
      merged: false,
      position: { x, y },
      id: generateId(x, y)
    };
    
    return newBoard;
  }, []);
  
  // 初始化游戏
  const resetGame = useCallback(() => {
    // 创建空棋盘
    let newBoard: Board = Array(4).fill(null).map(() => Array(4).fill(null));
    
    // 生成两个初始数字
    newBoard = generateNewNumber(newBoard);
    newBoard = generateNewNumber(newBoard);
    
    setBoard(newBoard);
    setScore(0);
    setGameStatus('playing');
    setGameMessage('');
  }, [generateNewNumber]);
  
  // 检查游戏是否结束
  const checkGameStatus = useCallback((currentBoard: Board) => {
    // 检查是否有2048，游戏胜利
    for (let x = 0; x < 4; x++) {
      for (let y = 0; y < 4; y++) {
        if (currentBoard[x][y]?.value === 2048) {
          return 'won';
        }
      }
    }
    
    // 检查是否有空位置
    for (let x = 0; x < 4; x++) {
      for (let y = 0; y < 4; y++) {
        if (!currentBoard[x][y]) {
          return 'playing';
        }
      }
    }
    
    // 检查是否有可合并的方块
    for (let x = 0; x < 4; x++) {
      for (let y = 0; y < 4; y++) {
        const current = currentBoard[x][y];
        
        // 检查右侧
        if (y < 3 && current && currentBoard[x][y+1] && current.value === currentBoard[x][y+1].value) {
          return 'playing';
        }
        
        // 检查下方
        if (x < 3 && current && currentBoard[x+1][y] && current.value === currentBoard[x+1][y].value) {
          return 'playing';
        }
      }
    }
    
    // 游戏失败
    return 'lost';
  }, []);
  
  // 移动方块
  const move = useCallback((direction: Direction) => {
    if (gameStatus !== 'playing') return;
    
    let newBoard = board.map(row => row.map(cell => 
      cell ? { ...cell, merged: false } : null
    ));
    let newScore = score;
    let moved = false;
    
    // 根据方向处理不同的移动逻辑
    switch (direction) {
      case 'left':
        for (let x = 0; x < 4; x++) {
          let row = newBoard[x].filter(cell => cell !== null) as Cell[];
          const newRow: (Cell | null)[] = Array(4).fill(null);
          
          let y = 0;
          for (let i = 0; i < row.length; i++) {
            if (i < row.length - 1 && row[i].value === row[i+1].value && !row[i].merged && !row[i+1].merged) {
              // 合并方块
              const mergedValue = row[i].value * 2;
              newScore += mergedValue;
              
              newRow[y] = {
                ...row[i],
                value: mergedValue,
                merged: true,
                position: { x, y }
              };
              
              row[i+1].merged = true;
              i++;
              moved = true;
            } else {
              newRow[y] = {
                ...row[i],
                position: { x, y }
              };
            }
            
            y++;
          }
          
          if (JSON.stringify(newRow) !== JSON.stringify(newBoard[x])) {
            moved = true;
            newBoard[x] = newRow;
          }
        }
        break;
        
      case 'right':
        for (let x = 0; x < 4; x++) {
          let row = newBoard[x].filter(cell => cell !== null) as Cell[];
          const newRow: (Cell | null)[] = Array(4).fill(null);
          
          let y = 3;
          for (let i = row.length - 1; i >= 0; i--) {
            if (i > 0 && row[i].value === row[i-1].value && !row[i].merged && !row[i-1].merged) {
              // 合并方块
              const mergedValue = row[i].value * 2;
              newScore += mergedValue;
              
              newRow[y] = {
                ...row[i],
                value: mergedValue,
                merged: true,
                position: { x, y }
              };
              
              row[i-1].merged = true;
              i--;
              moved = true;
            } else {
              newRow[y] = {
                ...row[i],
                position: { x, y }
              };
            }
            
            y--;
          }
          
          if (JSON.stringify(newRow) !== JSON.stringify(newBoard[x])) {
            moved = true;
            newBoard[x] = newRow;
          }
        }
        break;
        
      case 'up':
        for (let y = 0; y < 4; y++) {
          let column: Cell[] = [];
          for (let x = 0; x < 4; x++) {
            if (newBoard[x][y]) {
              column.push(newBoard[x][y] as Cell);
            }
          }
          
          const newColumn: (Cell | null)[] = Array(4).fill(null);
          let x = 0;
          
          for (let i = 0; i < column.length; i++) {
            if (i < column.length - 1 && column[i].value === column[i+1].value && !column[i].merged && !column[i+1].merged) {
              // 合并方块
              const mergedValue = column[i].value * 2;
              newScore += mergedValue;
              
              newColumn[x] = {
                ...column[i],
                value: mergedValue,
                merged: true,
                position: { x, y }
              };
              
              column[i+1].merged = true;
              i++;
              moved = true;
            } else {
              newColumn[x] = {
                ...column[i],
                position: { x, y }
              };
            }
            
            x++;
          }
          
          // 更新列
          for (let i = 0; i < 4; i++) {
            if (newBoard[i][y]?.value !== newColumn[i]?.value) {
              moved = true;
            }
            newBoard[i][y] = newColumn[i];
          }
        }
        break;
        
      case 'down':
        for (let y = 0; y < 4; y++) {
          let column: Cell[] = [];
          for (let x = 0; x < 4; x++) {
            if (newBoard[x][y]) {
              column.push(newBoard[x][y] as Cell);
            }
          }
          
          const newColumn: (Cell | null)[] = Array(4).fill(null);
          let x = 3;
          
          for (let i = column.length - 1; i >= 0; i--) {
            if (i > 0 && column[i].value === column[i-1].value && !column[i].merged && !column[i-1].merged) {
              // 合并方块
              const mergedValue = column[i].value * 2;
              newScore += mergedValue;
              
              newColumn[x] = {
                ...column[i],
                value: mergedValue,
                merged: true,
                position: { x, y }
              };
              
              column[i-1].merged = true;
              i--;
              moved = true;
            } else {
              newColumn[x] = {
                ...column[i],
                position: { x, y }
              };
            }
            
            x--;
          }
          
          // 更新列
          for (let i = 0; i < 4; i++) {
            if (newBoard[i][y]?.value !== newColumn[i]?.value) {
              moved = true;
            }
            newBoard[i][y] = newColumn[i];
          }
        }
        break;
    }
    
    // 如果有移动，生成新数字并检查游戏状态
    if (moved) {
      newBoard = generateNewNumber(newBoard);
      setBoard(newBoard);
      setScore(newScore);
      
      // 保存最高分
      if (newScore > bestScore) {
        setBestScore(newScore);
        localStorage.setItem('2048BestScore', newScore.toString());
      }
      
      // 检查游戏状态
      const status = checkGameStatus(newBoard);
      setGameStatus(status);
      
      if (status === 'won') {
        setGameMessage('恭喜你赢了！🎉');
      } else if (status === 'lost') {
        setGameMessage('游戏结束！再接再厉！');
      }
    }
  }, [board, score, bestScore, gameStatus, generateNewNumber, checkGameStatus]);
  
  // 处理触摸滑动
  const [touchStart, setTouchStart] = useState<{x: number, y: number} | null>(null);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    });
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    
    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY
    };
    
    const diffX = touchEnd.x - touchStart.x;
    const diffY = touchEnd.y - touchStart.y;
    
    // 判断滑动方向
    if (Math.abs(diffX) > Math.abs(diffY)) {
      // 水平滑动
      if (diffX > 50) {
        move('right');
      } else if (diffX < -50) {
        move('left');
      }
    } else {
      // 垂直滑动
      if (diffY > 50) {
        move('down');
      } else if (diffY < -50) {
        move('up');
      }
    }
    
    setTouchStart(null);
  };
  
  // 获取方块颜色
  const getTileColor = (value: number) => {
    const colors = {
      2: { bg: 'bg-amber-100', text: 'text-gray-800', darkBg: 'bg-amber-900', darkText: 'text-amber-100' },
      4: { bg: 'bg-amber-200', text: 'text-gray-800', darkBg: 'bg-amber-800', darkText: 'text-amber-100' },
      8: { bg: 'bg-orange-300', text: 'text-white', darkBg: 'bg-orange-700', darkText: 'text-white' },
      16: { bg: 'bg-orange-400', text: 'text-white', darkBg: 'bg-orange-600', darkText: 'text-white' },
      32: { bg: 'bg-orange-500', text: 'text-white', darkBg: 'bg-orange-500', darkText: 'text-white' },
      64: { bg: 'bg-orange-600', text: 'text-white', darkBg: 'bg-orange-400', darkText: 'text-white' },
      128: { bg: 'bg-yellow-300', text: 'text-white', darkBg: 'bg-yellow-600', darkText: 'text-white' },
      256: { bg: 'bg-yellow-400', text: 'text-white', darkBg: 'bg-yellow-500', darkText: 'text-white' },
      512: { bg: 'bg-yellow-500', text: 'text-white', darkBg: 'bg-yellow-400', darkText: 'text-white' },
      1024: { bg: 'bg-yellow-600', text: 'text-white', darkBg: 'bg-yellow-300', darkText: 'text-white' },
      2048: { bg: 'bg-yellow-700', text: 'text-white', darkBg: 'bg-yellow-200', darkText: 'text-gray-800' },
      default: { bg: 'bg-gray-200', text: 'text-gray-800', darkBg: 'bg-gray-700', darkText: 'text-gray-200' }
    };
    
    return colors[value as keyof typeof colors] || colors.default;
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
       {/* 头部导航 */}
      <div className="w-full max-w-md flex justify-between items-center mb-6">
        <Link to="/" className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl">
          <i class="fa-solid fa-home"></i>
        </Link>
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">2048</h1>
          <div className="flex justify-center gap-4 mt-2">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md px-4 py-2 rounded-full text-gray-800 dark:text-white shadow-lg">
              <span className="font-medium">分数:</span> {score}
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md px-4 py-2 rounded-full text-gray-800 dark:text-white shadow-lg">
              <span className="font-medium">最高分:</span> {bestScore}
            </div>
          </div>
        </div>
        <button 
          onClick={resetGame}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-2 rounded-full shadow-lg transition-colors"
        >
          <i class="fa-solid fa-rotate-right"></i>
        </button>
      </div>
      
      {/* 游戏状态消息 */}
      {gameMessage && (
        <div className="w-full max-w-md mb-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl p-3 text-center font-bold text-lg text-gray-800 dark:text-white shadow-lg">
          {gameMessage}
        </div>
      )}
      
       {/* 游戏棋盘 */}
      <div 
        className="relative bg-gray-300 dark:bg-gray-700 rounded-2xl p-4 shadow-2xl transform transition-all duration-300 hover:shadow-xl"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        tabIndex={0}
      >
        <div className="grid grid-cols-4 gap-4 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px]">
          {board.map((row, x) => 
            row.map((cell, y) => (
              <div 
                key={`${x}-${y}`}
                className={`rounded-lg bg-gray-200 dark:bg-gray-600 overflow-hidden shadow-inner transition-all duration-200`}
              >
                {cell && (
                  <motion.div
                    key={cell.id}
                    className={`w-full h-full rounded-lg flex items-center justify-center font-bold transition-all duration-200 ${
                      isDark 
                        ? getTileColor(cell.value).darkBg 
                        : getTileColor(cell.value).bg
                    } ${
                      isDark 
                        ? getTileColor(cell.value).darkText 
                        : getTileColor(cell.value).text
                    } ${
                      cell.value >= 1024 ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl'
                    } shadow-md hover:shadow-lg transform hover:scale-[1.02]`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {cell.value}
                  </motion.div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* 游戏结束弹窗 */}
      <AnimatePresence>
        {gameStatus === 'lost' && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-md text-center shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <div className="text-6xl mb-4">🎮</div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">游戏结束</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">{gameMessage}</p>
              
              <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4 mb-6">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">最终得分</div>
                <div className="text-4xl font-bold text-yellow-500">{score}</div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={resetGame}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:opacity-90 transition-opacity text-lg font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  再来一局
                </button>
                <Link
                  to="/"
                  className="flex-1 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-lg font-medium shadow-md hover:shadow-lg transform hover:-translate-y-1"
                >
                  返回首页
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
       {/* 游戏控制和说明 */}
      <div className="w-full max-w-md mt-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl p-6 shadow-lg transform transition-all duration-300 hover:shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="text-center text-sm text-gray-600 dark:text-gray-300">
            <p className="mb-1"><i class="fa-solid fa-keyboard mr-2"></i>使用方向键或滑动来移动方块</p>
            <p><i class="fa-solid fa-cubes mr-2"></i>合并相同数字的方块，尝试获得2048！</p>
          </div>
          
          <button
            onClick={resetGame}
            className="py-3 px-8 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:opacity-90 transition-all duration-300 text-lg font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <i class="fa-solid fa-rotate-right mr-2"></i>重新开始
          </button>
        </div>
      </div>
    </div>
  );
};

export default Two048Game;