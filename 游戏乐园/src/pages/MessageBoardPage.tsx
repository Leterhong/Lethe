import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import { toast } from 'sonner';

// 定义留言类型
interface Message {
  id: string;
  name: string;
  content: string;
  date: string;
}

const MessageBoardPage: React.FC = () => {
  const { isDark } = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState({ name: '', content: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 从localStorage加载留言
  useEffect(() => {
    const savedMessages = localStorage.getItem('messageBoardMessages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  // 保存留言到localStorage
  useEffect(() => {
    localStorage.setItem('messageBoardMessages', JSON.stringify(messages));
  }, [messages]);

  // 处理表单输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewMessage(prev => ({ ...prev, [name]: value }));
  };

  // 提交新留言
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 简单验证
    if (!newMessage.name.trim() || !newMessage.content.trim()) {
      toast.error('请输入姓名和留言内容');
      return;
    }
    
    setIsSubmitting(true);
    
    // 模拟API请求延迟
    setTimeout(() => {
      const message: Message = {
        id: Date.now().toString(),
        name: newMessage.name.trim(),
        content: newMessage.content.trim(),
        date: new Date().toLocaleString()
      };
      
      setMessages(prev => [message, ...prev]);
      setNewMessage({ name: '', content: '' });
      toast.success('留言提交成功！');
      setIsSubmitting(false);
    }, 800);
  };

  // 删除留言
  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除这条留言吗？')) {
      setMessages(prev => prev.filter(message => message.id !== id));
      toast.success('留言已删除');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 relative overflow-hidden transition-colors duration-300 bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900">
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
    
      {/* main content */}
    
      <div className="w-full max-w-md relative z-10 flex flex-col items-center mt-8">
        
        <motion.h1 
          className="text-[clamp(2rem,_5vw,_3rem)] font-bold mb-8 tracking-wide text-white"
          style={{ textShadow: '0 0 10px rgba(138, 43, 226, 0.5)' }}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 150, damping: 20 }}
        >
          留言板
        </motion.h1>
        
        {/* 留言表单 */}
        <motion.div 
          className="w-full bg-white/10 backdrop-blur-md rounded-xl p-6 mb-8"
          initial={{ opacity:0, y:20 }} 
          animate={{ opacity:1, y:0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        
        >
          <h2 className="text-xl font-semibold mb-4 text-white">添加留言</h2>
        
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
        
              <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-1">姓名</label>
              <input
                type="text"
                id="name"
                name="name"
                value={newMessage.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                
                placeholder="请输入您想显示的名称"
                required
              />
            </div>
        
            <div>
        
              <label htmlFor="content" className="block text-sm font-medium text-white/80 mb-1">留言 content</label>
              <textarea
                id="content"
        
                name="content"
        
                value={newMessage.content}
        
                onChange={handleInputChange}
        
                rows={4}
        
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none
        
                "
        
                placeholder="请输入您的留言..."
        
                required
        
              ></textarea>
        
            </div>
        
            <button
        
              type="submit"
        
              disabled={isSubmitting}
        
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
        
            >
        
              {isSubmitting ? (
                <div className="flex items-center justify-center">
        
                  <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                  提交中...
        
                </div>
              ) : (
                <div className="flex items-center justify-center">
        
                  <i className="fa-solid fa-paper-plane mr-2"></i>
                  提交留言
        
                </div>
              )}
        
            </button>
        
          </form>
        
        </motion.div>
        
        {/* 留言列表 */}
        
        <div className="w-full">
        
          <h2 className="text-xl font-semibold mb-4 text-white flex items-center">
            <i className="fa-solid fa-comments mr-2"></i>
            留言列表
            <span className="ml-2 text-sm font-normal bg-white/20 px-2 py-1 rounded-full">
              {messages.length}
            </span>
        
          </h2>
        
          {messages.length === 0 ? (
            <motion.div 
              className="bg-white/10 backdrop-blur-md rounded-xl p-8 text-center"
              initial={{ opacity:0 }}
              animate={{ opacity:1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <i className="fa-solid fa-comment-dots text-4xl mb-4 text-white/50"></i>
              <p className="text-white/70">暂无留言，快来添加第一条留言吧！</p>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity:0 }}
              animate={{ opacity:1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="space-y-4">
                {messages.map((message) => (
                  <motion.div 
                    key={message.id}
                    className="bg-white/10 backdrop-blur-md rounded-xl p-6 hover:bg-white/15 transition-colors duration-300"
                    initial={{ opacity:0, y:20 }} 
                    animate={{ opacity:1, y:0 }}
                    transition={{ delay: 0.1 * messages.indexOf(message), duration: 0.3 }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-white">{message.name}</h3>
                      <button
                        onClick={() => handleDelete(message.id)}
                        className="text-white/50 hover:text-red-400 transition-colors"
                        aria-label="删除留言"
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                    <p className="text-white/80 mb-3">{message.content}</p>
                    <div className="text-right text-sm text-white/50">
                      {message.date}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        
        </div>
        
      </div>
      
      {/* 页脚 */}
      <footer className="mt-auto mb-6 text-center text-gray-400 text-sm z-10">
        <p>© {new Date().getFullYear()} 留言板功能</p>
      </footer>
    </div>
  );
};

export default MessageBoardPage;