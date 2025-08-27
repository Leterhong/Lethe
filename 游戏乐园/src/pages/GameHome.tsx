import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';

export default function GameHome() {
  const { isDark, toggleTheme } = useTheme();
  // 游戏数据
  const games = [
    {
      id: 'memory',
      title: '记忆翻牌游戏',
      description: '挑战你的记忆力，找出所有匹配的卡片对！锻炼你的观察力和记忆力，适合所有年龄段。',
      icon: '🧠',
      color: 'from-purple-500 to-indigo-600',
      path: '/game'
    },
    {
      id: 'number',
      title: '猜数字游戏',
      description: '系统随机生成一个数字，你需要在限定次数内猜出正确数字，系统会提示你猜的数字是太高还是太低！',
      icon: '🔢',
      color: 'from-blue-500 to-cyan-600',
      path: '/jumping'
    },
    {
      id: 'math',
      title: '蔬菜市场数学',
      description: '在有趣的蔬菜市场中练习数学计算，提高你的算术能力，适合儿童学习！',
      icon: '🥬',
      color: 'from-amber-500 to-orange-600',
      path: '/math'
    },

    {
      id: 'tictactoe',
      title: '井字游戏',
      description: '经典的井字游戏，两人轮流在3x3的网格中放置X和O，先连成一条线的一方获胜！',
      icon: '❌⭕',
      color: 'from-indigo-500 to-purple-600',
      path: '/brick-breaker'
    },
    {
      id: '2048',
      title: '2048游戏',
      description: '经典数字益智游戏，通过移动方块合并数字，最终目标是合成2048！',
      icon: '🔢',
      color: 'from-blue-500 to-cyan-600',
      path: '/2048'
    },
    {
      id: 'qrcode',
      title: '二维码生成',
      description: '输入网址或文本，即时生成可保存的二维码图片，无需注册登录',
      icon: '🔲',
      color: 'from-green-500 to-teal-600',
      path: '/qrcode'
    }, 

  ];

  return (
      <div className="min-h-screen bg-cover bg-center flex flex-col items-center p-4 transition-colors duration-300 dark:bg-gray-900" 
  style={{ 
    backgroundImage: isDark 
      ? "url('https://space.coze.cn/api/coze_space/gen_image?format=gif&image_size=landscape_16_9&prompt=night%20sky%20with%20stars%20and%20moon%20animation%2C%20twinkling%20stars%2C%20moving%20clouds%2C%20smooth%20transition%2C%20high%20quality%2C%204K%20resolution&sign=b61dee2ae41b36128496e0724fea100c')" 
      : "url('https://space.coze.cn/api/coze_space/gen_image?format=gif&image_size=landscape_16_9&prompt=daytime%20landscape%20with%20flowing%20river%20and%20moving%20clouds%2C%20sun%20rays%2C%20animated%20nature%20scene%2C%20high%20quality%2C%204K%20resolution&sign=076fd5486064d05c5ea4f7ffefb37114')" 
  }}>
      {/* 标题和主题切换区域 */}
      <header className="w-full max-w-6xl mb-12 pt-8 flex flex-col md:flex-row justify-between items-center">
        {/* 主题切换按钮 */}
        <button onClick={toggleTheme} className="fixed top-6 right-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50">
          {isDark ? (
            <i className="fa-solid fa-sun text-yellow-500 text-xl"></i>
          ) : (
            <i className="fa-solid fa-moon text-blue-700 text-xl"></i>
          )}
        </button>
        <motion.h1
          className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        >
          游戏乐园
        </motion.h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          
        </p>
      </header>
      
      {/* 游戏卡片区域 */}
           <main className="max-w-6xl mx-auto relative z-20">
             {/* 二维码生成工具 */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map((game) => (
            <motion.div
              key={game.id}
              className="group"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -10 }}
            >
              <div className={`relative rounded-2xl overflow-hidden shadow-xl transition-all duration-300 group-hover:shadow-2xl h-full flex flex-col`}>
                {/* 背景渐变 */}
                <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-90`}></div>
                
                {/* 游戏内容 */}
                <div className="relative p-6 flex flex-col h-full">
                  {/* 游戏图标 */}
                  <div className="text-5xl mb-4">{game.icon}</div>
                  
                  {/* 游戏标题 */}
                  <h2 className="text-2xl font-bold text-white mb-3">{game.title}</h2>
                  
                  {/* 游戏描述 */}
                  <p className="text-white/90 mb-6 flex-grow">{game.description}</p>
                  
                  {/* 进入游戏按钮 */}
                  <Link
                    to={game.path}
                    className="inline-block bg-white text-gray-800 font-bold py-3 px-6 rounded-full text-center shadow-lg hover:shadow-xl transform transition hover:-translate-y-1"
                  >
                    开始游戏 <i class="fa-solid fa-arrow-right ml-2"></i>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
      
       {/* 作者信息按钮 */}
        <div className="mt-12 text-center flex justify-center gap-4">
   <Link
  to="/author-blog"
  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 backdrop-blur-sm text-white font-medium py-3 px-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
  
>
  <i class="fa-solid fa-user-circle"></i>
  作者博客
  
</Link>
        <Link
          to="/author"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 backdrop-blur-sm text-white font-medium py-3 px-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          <i class="fa-solid fa-info-circle"></i>
          作者信息
        </Link>
        <Link
          to="/message-board"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 backdrop-blur-sm text-white font-medium py-3 px-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          <i class="fa-solid fa-comment"></i>
          留言板
        </Link>
      </div>
      
      {/* 页脚 */}
      <footer className="mt-16 text-center text-gray-500 dark:text-gray-400 py-6">
        <p>游戏乐园 &copy; {new Date().getFullYear()} - I wish you to become your own sun, no need to rely on who's light.</p>
      </footer>
    </div>
  );
}