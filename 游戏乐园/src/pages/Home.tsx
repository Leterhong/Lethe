import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Home() {
  return (<div className="min-h-screen bg-[url('https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=anime%20landscape%2C%20high%20definition%2C%20no%20watermark&sign=56de3d94edbf224e4275d3ff509f04f9')] bg-cover bg-center flex flex-col items-center justify-center p-4 text-white">
      {/* 标题区域 */}
      <header className="text-center mb-12">
        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-lg"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        >
          记忆翻牌游戏
        </motion.h1>
        <p className="text-xl md:text-2xl opacity-90 max-w-lg mx-auto">
          挑战你的记忆力，找出所有匹配的卡片对！
        </p>
      </header>
      
      {/* 主游戏区域 */}
      <main className="w-full max-w-3xl flex flex-col items-center">
        {/* 游戏卡片预览 */}
        <div className="grid grid-cols-4 gap-3 mb-10 w-full max-w-md">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className={`w-16 h-16 rounded-xl bg-gradient-to-br ${
                i % 2 === 0 ? 'from-blue-500 to-indigo-600' : 'from-purple-500 to-pink-600'
              } flex items-center justify-center text-2xl shadow-lg`}
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ 
                type: 'spring', 
                stiffness: 100, 
                damping: 20,
                delay: i * 0.05
              }}
            >
              {i % 2 === 0 ? '🐱' : '🐶'}
            </motion.div>
          ))}
        </div>
        
        {/* 开始游戏按钮 */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            to="/game"
            className="bg-white text-indigo-600 font-bold py-4 px-10 rounded-full text-xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center"
          >
            <i class="fa-solid fa-play mr-2"></i> 开始游戏
          </Link>
        </motion.div>
        
        {/* 游戏特点 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full max-w-3xl">
          {[
            { icon: '🧠', title: '锻炼记忆', desc: '提升你的记忆力和专注力' },
            { icon: '🎨', title: '多种主题', desc: '动物、水果、表情等多种卡片主题' },
            { icon: '⚡', title: '多种模式', desc: '经典、计时、限步和渐进难度模式' }
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white/10 backdrop-blur-md p-5 rounded-xl text-center"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ 
                type: 'spring', 
                stiffness: 100, 
                damping: 20,
                delay: 0.6 + index * 0.1
              }}
            >
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="opacity-80">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </main>
      
      {/* 页脚 */}
      <footer className="mt-auto py-6 text-center text-sm opacity-70">
        <p>记忆翻牌游戏 &copy; {new Date().getFullYear()} - 适合所有年龄段的益智游戏</p>
      </footer>
    </div>
  );
}