import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';

const AuthorBlogPage: React.FC = () => {
  const { isDark } = useTheme();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors duration-300 bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900">
      {/* 背景星空效果 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=starry%20night%20sky%2C%20twinkling%20stars%2C%20dark%20background%2C%20high%20definition&sign=234e0f2d6ac5a3b847d8023df11e9e75')] bg-cover bg-center opacity-60"></div>
        {/* 星星动画效果 */}
        <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.1)_1px,_transparent_1px)] bg-[length:30px_30px] animate-pulse"></div>
      </div>
      
      {/* 返回按钮 */}
      <div className="absolute top-6 left-6 z-10">
        <Link to="/" className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl">
          <i class="fa-solid fa-arrow-left"></i>
        </Link>
      </div>
      
      {/* 主内容区 */}
      <div className="w-full max-w-md relative z-10 flex flex-col items-center">
        {/* 头像 */}
        <motion.div
          className="w-40 h-40 rounded-full border-4 border-white/30 shadow-lg overflow-hidden mb-6"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 150, damping: 20 }}
        >
          <img 
            src="https://space.coze.cn/api/coze_space/gen_image?image_size=square_hd&prompt=sad%20anime%20girl%2C%20high%20definition%2C%20emotional%20expression%2C%20tears%2C%20soft%20colors%2C%20anime%20style&sign=1c563f5b8861a5e9416717acb2251483" 
            alt="Lethehong" 
            className="w-full h-full object-cover"
          />
        </motion.div>
        
        {/* 作者名称 */}
        <motion.h1
          className="text-3xl font-bold text-white mb-8 tracking-wide"
          style={{ textShadow: '0 0 10px rgba(138, 43, 226, 0.5)' }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Lethehong
        </motion.h1>
        
        {/* 引言 */}
        <motion.div
          className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-10 w-full text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <p className="text-xl text-white italic">"只愿君心似我心，定不负相思意"</p>
        </motion.div>
        
        {/* CSDN博客按钮 */}
        <motion.a
          href="https://blog.csdn.net/2301_76341691?type=blog"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-4 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 w-full max-w-xs"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <i class="fa-brands fa-codepen"></i>
          访问我的CSDN博客
        </motion.a>
      </div>
      
      {/* 页脚 */}
      <footer className="mt-auto mb-6 text-center text-gray-400 text-sm z-10">
        <p>© {new Date().getFullYear()} Lethehong's Blog</p>
      </footer>
    </div>
  );
};

export default AuthorBlogPage;