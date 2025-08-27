import React from 'react';import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';

const AuthorPage: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  
  return (
     <div className="min-h-screen flex flex-col items-center p-4 relative overflow-hidden transition-colors duration-300 dark:bg-gray-900">
       {/* 主题切换按钮 */}
       <button
         onClick={toggleTheme}
         className="fixed top-6 right-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50"
         aria-label={isDark ? "切换到白天模式" : "切换到夜晚模式"}
       >
         {isDark ? (
           <i className="fa-solid fa-sun text-yellow-500 text-xl"></i>
         ) : (
           <i className="fa-solid fa-moon text-blue-700 text-xl"></i>
         )}
       </button>

       {/* 头部导航 */}
       <div className="w-full max-w-md mt-6 flex justify-start items-center">
         <Link to="/" className="bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 text-indigo-700 dark:text-indigo-400 p-2 rounded-full transition-colors shadow-md">
           <i class="fa-solid fa-arrow-left"></i>
         </Link>
       </div>

			
       
       {/* 作者信息卡片 */}
        <motion.div
   className="w-full max-w-md mt-10 rounded-2xl shadow-xl overflow-hidden border border-indigo-100 dark:border-indigo-900 relative"
   style={{
     backgroundImage: "url('https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=anime%20shooting%20stars%20background%2C%20night%20sky%2C%20high%20definition%2C%20no%20watermark&sign=55294803cb65f0e8a94a7f7460ae7878')",
     backgroundSize: "cover",
     backgroundPosition: "center"
   }}
   initial={{ opacity: 0, y: 20 }}
   animate={{ opacity: 1, y: 0 }}
   transition={{ duration: 0.5 }}
>
          {/* 内容区域 */}
          <div className="pt-6 pb-8 px-6 text-center bg-black/40 backdrop-blur-sm">
            {/* 作者头像 */}
            <div className="w-32 h-32 mx-auto rounded-full bg-white p-2 shadow-lg mb-4">
              <img 
                src="https://space.coze.cn/api/coze_space/gen_image?image_size=square_hd&prompt=sad%20anime%20girl%2C%20high%20definition%2C%20emotional%20expression%2C%20tears%2C%20soft%20colors%2C%20anime%20style&sign=1c563f5b8861a5e9416717acb2251483" 
                alt="Lethehong" 
                className="w-full h-full rounded-full object-contain bg-gray-100"
              />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">Lethehong</h1>
           
            <div className="mt-6 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl p-6">
             <div className="space-y-4 text-left">
               <div className="flex items-center">
                 <i class="fa-solid fa-user text-indigo-500 mr-3 text-xl"></i>
                 <div>
                   <div className="text-sm text-gray-500 dark:text-gray-400">姓名</div>
                   <div className="text-xl font-bold text-gray-800 dark:text-white">Lethehong</div>
                 </div>
               </div>
               
               <div className="flex items-center">
                 <i class="fa-solid fa-globe text-indigo-500 mr-3 text-xl"></i>
                 <div>
                   <div className="text-sm text-gray-500 dark:text-gray-400">网站</div>
                   <a href="https://lethehong.top" target="_blank" rel="noopener noreferrer" className="text-xl font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                     lethehong.top
                   </a>
                 </div>
               </div>
               
               <div className="flex items-center">
                 <i class="fa-solid fa-envelope text-indigo-500 mr-3 text-xl"></i>
                 <div>
                   <div className="text-sm text-gray-500 dark:text-gray-400">邮箱</div>
                   <a href="mailto:1977642959@qq.com" className="text-xl font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                     1977642959@qq.com
                   </a>
                 </div>
               </div>
             </div>
           </div>
         </div>
       </motion.div>
       
       {/* 页脚 */}
       <footer className="mt-auto mb-6 text-center text-gray-500 dark:text-gray-400 text-sm">
         <p>© {new Date().getFullYear()} 作者信息页面</p>
       </footer>
     </div>
   );
};

export default AuthorPage;