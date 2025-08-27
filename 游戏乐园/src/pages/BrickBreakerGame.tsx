import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// 定义游戏状态类型
type GameStatus = 'playing' | 'won' | 'tied';
// 定义玩家类型
type Player = 'X' | 'O';
// 定义棋盘单元格值类型
type CellValue = Player | null;
// 定义获胜组合类型
type WinningCombination = [number, number, number];

export default function TicTacToeGame() {
  // 游戏状态
  const [board, setBoard] = useState<CellValue[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [xWins, setXWins] = useState(0);
  const [oWins, setOWins] = useState(0);
  const [ties, setTies] = useState(0);
  const [winningCells, setWinningCells] = useState<WinningCombination | null>(null);
  
  // 获胜组合
  const WINNING_COMBINATIONS: WinningCombination[] = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // 行
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // 列
    [0, 4, 8], [2, 4, 6]             // 对角线
  ];
  
  // 从本地存储加载分数
  useEffect(() => {
    const savedXWins = localStorage.getItem('ticTacToeXWins');
    const savedOWins = localStorage.getItem('ticTacToeOWins');
    const savedTies = localStorage.getItem('ticTacToeTies');
    
    if (savedXWins) setXWins(parseInt(savedXWins));
    if (savedOWins) setOWins(parseInt(savedOWins));
    if (savedTies) setTies(parseInt(savedTies));
  }, []);
  
  // 保存分数到本地存储
  useEffect(() => {
    localStorage.setItem('ticTacToeXWins', xWins.toString());
    localStorage.setItem('ticTacToeOWins', oWins.toString());
    localStorage.setItem('ticTacToeTies', ties.toString());
  }, [xWins, oWins, ties]);
  
  // 检查游戏结果
  useEffect(() => {
    checkGameStatus();
  }, [board]);
  
  // 检查游戏状态（胜利或平局）
  const checkGameStatus = useCallback(() => {
    // 检查是否有玩家获胜
    for (const combo of WINNING_COMBINATIONS) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        const winner = board[a] as Player;
        setGameStatus('won');
        setWinningCells(combo);
        
        // 更新获胜次数
        if (winner === 'X') {
          setXWins(prev => prev + 1);
        } else {
          setOWins(prev => prev + 1);
        }
        return;
      }
    }
    
    // 检查是否平局
    if (!board.includes(null)) {
      setGameStatus('tied');
      setTies(prev => prev + 1);
      return;
    }
    
    // 游戏仍在进行中
    setGameStatus('playing');
  }, [board]);
  
  // 处理单元格点击
  const handleCellClick = (index: number) => {
    // 如果单元格已被填充或游戏已结束，则不执行任何操作
    if (board[index] || gameStatus !== 'playing') return;
    
    // 更新棋盘
    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    
    // 切换玩家
    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
  };
  
  // 重置游戏
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setGameStatus('playing');
    setWinningCells(null);
  };
  
  // 重置分数
  const resetScores = () => {
    setXWins(0);
    setOWins(0);
    setTies(0);
    localStorage.removeItem('ticTacToeXWins');
    localStorage.removeItem('ticTacToeOWins');
    localStorage.removeItem('ticTacToeTies');
    resetGame();
  };
  
  // 获取游戏状态消息
  const getStatusMessage = () => {
    if (gameStatus === 'won') {
      return `${currentPlayer === 'X' ? 'O' : 'X'} 获胜！🎉`;
    } else if (gameStatus === 'tied') {
      return "游戏平局！🤝";
    } else {
      return `玩家 ${currentPlayer} 的回合`;
    }
  };
  
  // 渲染单元格
  const renderCell = (index: number) => {
    const isWinningCell = winningCells?.includes(index) || false;
    
    return (
      <motion.button
        key={index}
        onClick={() => handleCellClick(index)}
        className={`w-full h-full flex items-center justify-center text-4xl font-bold transition-all duration-300 ${
          isWinningCell 
            ? 'bg-yellow-400 text-white' 
            : 'hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.05 }}
      >
        {board[index] === 'X' ? (
          <motion.span 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="text-blue-600 dark:text-blue-400"
          >
            X
          </motion.span>
        ) : board[index] === 'O' ? (
          <motion.span 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="text-red-600 dark:text-red-400"
          >
            O
          </motion.span>
        ) : null}
      </motion.button>
    );
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center p-4">
      {/* 游戏标题和导航 */}
      <div className="w-full max-w-3xl mb-6 flex justify-between items-center">
        <Link to="/" className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors">
          <i className="fa-solid fa-home"></i>
        </Link>
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
            井字游戏
          </h1>
          <div className="mt-2 text-lg font-medium text-gray-700 dark:text-gray-300">
            {getStatusMessage()}
          </div>
        </div>
        <div className="w-10"></div> {/* 占位元素，保持布局平衡 */}
      </div>
      
      {/* 分数显示 */}
      <div className="w-full max-w-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl p-4 mb-8 shadow-lg">
        <div className="flex justify-around items-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">X</div>
            <div className="text-3xl font-bold">{xWins}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">胜场</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-500 dark:text-gray-400 mb-1">平局</div>
            <div className="text-3xl font-bold">{ties}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">场数</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400 mb-1">O</div>
            <div className="text-3xl font-bold">{oWins}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">胜场</div>
          </div>
        </div>
      </div>
      
      {/* 游戏棋盘 */}
      <div className="w-full max-w-md aspect-square bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border-4 border-indigo-200 dark:border-indigo-900">
        <div className="grid grid-cols-3 grid-rows-3 h-full">
          {board.map((_, index) => (
            <div 
              key={index} 
              className="border border-gray-300 dark:border-gray-700 relative"
            >
              {renderCell(index)}
            </div>
          ))}
        </div>
      </div>
      
      {/* 游戏控制按钮 */}
      <div className="w-full max-w-md mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={resetGame}
          className="flex-1 py-3 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity text-lg font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          {gameStatus === 'playing' ? '重新开始' : '再来一局'}
        </button>
        <button
          onClick={resetScores}
          className="flex-1 py-3 px-6 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-lg font-medium"
        >
          重置分数
        </button>
      </div>
      
      {/* 游戏说明 */}
      <div className="w-full max-w-md mt-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-md">
        <h3 className="text-lg font-bold text-center mb-2 text-gray-800 dark:text-gray-200">游戏规则</h3>
        <ul className="text-gray-700 dark:text-gray-300 space-y-1 text-sm">
          <li>• 两人轮流在3x3的网格上放置X和O</li>
          <li>• 率先将三个标记连成一条线（横、竖或对角线）的玩家获胜</li>
          <li>• 如果所有格子都被填满但没有玩家获胜，则游戏平局</li>
          <li>• 点击格子放置你的标记，点击"重新开始"可以随时开始新游戏</li>
        </ul>
      </div>
    </div>
  );
}