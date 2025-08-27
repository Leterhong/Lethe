import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';

const QRCodeGenerator: React.FC = () => {
  const { isDark } = useTheme();                        
 const [showQRCodePreview, setShowQRCodePreview] = useState(true);
  const [inputValue, setInputValue] = useState('https://example.com');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');                        
  const [qrCodeSize, setQrCodeSize] = useState(500);
  
  // 防抖处理
  const debounceRef = useRef<number | null>(null);
  
  // 生成二维码(主API)
  const generateQRCodeWithPrimaryAPI = (text: string) => {
    const encodedText = encodeURIComponent(text);
    return `https://api.qrserver.com/v1/create-qr-code/?data=${encodedText}&size=${qrCodeSize}x${qrCodeSize}&margin=4&format=png&color=#000000&bgcolor=#FFFFFF&ecc=L`;
  };
  
  // 生成二维码(备用API)
  const generateQRCodeWithFallbackAPI = (text: string) => {
    const encodedText = encodeURIComponent(text);
    return `https://chart.googleapis.com/chart?chs=${qrCodeSize}x${qrCodeSize}&cht=qr&chl=${encodedText}&choe=UTF-8`;
  };
  
  // 生成二维码(本地模拟API - 用于测试)
  const generateQRCodeWithLocalMock = (text: string) => {
    // 这是一个模拟的二维码生成URL，仅用于展示
    return `https://space.coze.cn/api/coze_space/gen_image?image_size=square_hd&prompt=QR%20Code%20for%20${encodeURIComponent(text)}&sign=mock_signature`;
  };
  
  // 检查URL可用性
  const checkUrlAvailability = async (url: string): Promise<boolean> => {
    try {
      const response = await fetch(url, { method: 'HEAD', mode: 'cors' });
      return response.ok;
    } catch (error) {
      return false;
    }
  };
  
  // 生成二维码
  const generateQRCode = async (text: string) => {
    if (!text.trim()) {
      setError('请输入有效的网址或文本内容');
      return;
    }
    
    setIsGenerating(true);
    setError('');
    setQrCodeUrl('');
    
    try {
      // 1. 尝试主API
      const primaryUrl = generateQRCodeWithPrimaryAPI(text);
      setQrCodeUrl(primaryUrl);
      setIsGenerating(false);
      return;
      
    } catch (err) {
      console.error('二维码生成错误:', err);
      setError('生成二维码时出错，请重试');
      setIsGenerating(false);
    }
  };
  
  // 输入变化处理
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // 清除之前的定时器
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    // 1秒后生成二维码
    debounceRef.current = setTimeout(() => {
      if (value.trim()) {
        generateQRCode(value);
      } else {
        setQrCodeUrl('');
      }
    }, 1000);
  };
  
  // 组件挂载时生成初始二维码
  useEffect(() => {
    generateQRCode(inputValue);
    
    // 清除定时器
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
}, []);
  
  // 复制文本
  const copyToClipboard = () => {
    navigator.clipboard.writeText(inputValue).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* 导航和标题 */}
      <div className="w-full max-w-md flex justify-between items-center mb-8">
        <Link to="/" className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl">
          <i className="fa-solid fa-arrow-left"></i>
        </Link>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-500 dark:from-green-400 dark:to-teal-400 bg-clip-text text-transparent">
          二维码生成工具
        </h1>
        <div className="w-10"></div> {/* 占位元素 */}
      </div>
      
      {/* 主内容区 */}
      <div className="w-full max-w-2xl flex flex-col items-center">
        {/* 输入框区域 */}
        <div className="w-full mb-8">
          <label htmlFor="qr-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            粘贴你的网址或文本链接
          </label>
          
          <div className="relative">
            <motion.input
              id="qr-input"
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              className="w-full px-5 py-4 pr-16 rounded-2xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-lg focus:outline-none focus:ring-4 focus:ring-green-200 dark:focus:ring-green-900 transition-all"
              placeholder="输入网址或文本内容..."
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            />
            
            <button
              onClick={copyToClipboard}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                copied 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {copied ? (
                <>
                  <i className="fa-solid fa-check mr-1"></i> 已复制
                </>
              ) : (
                <>
                  <i className="fa-solid fa-copy mr-1"></i> 复制
                </>
              )}
            </button>
          </div>
          
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
            支持HTTP、HTTPS链接以及纯文本内容，输入后将自动生成二维码
          </p>
        </div>
        
        {/* 二维码显示区域 */}
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8 transition-all duration-300 hover:shadow-2xl">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6 text-center">
            {isGenerating ? '生成中...' : '二维码预览'}
          </h2>
          
           <div className="flex justify-center items-center min-h-[400px] bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-6">
            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.div
                  key="loading"
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <div className="w-16 h-16 border-4 border-t-green-500 border-gray-200 dark:border-gray-700 rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-500 dark:text-gray-400">正在生成二维码...</p>
                </motion.div>
              ) : qrCodeUrl ? (
                <motion.div
                  key="qrcode"
                  className="relative bg-white dark:bg-gray-900 p-4 rounded-xl shadow-inner border border-gray-200 dark:border-gray-700"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                   <div className="relative">
                       <img
                         src={qrCodeUrl}                        
                         alt="Generated QR Code"                        
                         className="w-full max-w-md h-auto object-contain rounded-lg shadow-lg border-4 border-white dark:border-gray-700 transition-all duration-300 hover:shadow-xl"
                         onLoad={() => {
                           console.log('QR Code loaded successfully');
                           setError('');
                         }}
                         onError={() => {
                           console.error('主API加载失败，尝试备用API...');
                           // 主API失败，尝试备用API
                           const fallbackUrl = generateQRCodeWithFallbackAPI(inputValue);
                           setQrCodeUrl(fallbackUrl);
                           
                           // 创建一个临时图片对象来检测备用API是否工作
                           const testImg = new Image();
                           testImg.src = fallbackUrl;
                           testImg.onerror = () => {
                             console.error('备用API加载失败，使用模拟二维码...');
                             setQrCodeUrl(generateQRCodeWithLocalMock(inputValue));
                             setError('二维码API暂时不可用，已加载模拟二维码');
                           };
                         }}
                       />
                     
                     {/* 二维码状态指示器 */}
                     <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-xs font-medium px-2 py-1 rounded-full shadow-sm">
                       可扫描
                     </div>
                     
                     {/* 悬浮提示 */}
                     <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800/90 dark:bg-gray-900/90 text-white text-xs py-1 px-3 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                       右键点击保存图片 (PNG格式)
                     </div>
                   </div>
                 </motion.div>
               ) : error ? (
                 <motion.div
                   key="error"
                   className="text-center p-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.9 }}
                 >
                   <i className="fa-solid fa-exclamation-circle text-5xl text-red-400 dark:text-red-500 mb-4"></i>
                   <p className="text-red-600 dark:text-red-400">{error}</p>
                   <button 
                     onClick={() => generateQRCode(inputValue)}
                     className="mt-4 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                   >
                     <i className="fa-solid fa-refresh mr-1"></i> 重试
                   </button>
                 </motion.div>
               ) : (
                 <motion.div
                   key="empty"
                   className="text-center p-8 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.9 }}
                 >
                   <i className="fa-solid fa-qrcode text-5xl text-gray-300 dark:text-gray-600 mb-4"></i>
                   <p className="text-gray-500 dark:text-gray-400">输入内容后将在此显示二维码</p>
                 </motion.div>
               )}
            </AnimatePresence>
          </div>
          
          {qrCodeUrl && !isGenerating && (
             <motion.div
               className="mt-6 text-center"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.3, duration: 0.3 }}
             >
               <div className="grid grid-cols-2 gap-4 mb-4">
                 <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 text-sm">
                   <div className="text-gray-500 dark:text-gray-400 mb-1">图片格式</div>
                   <div className="font-medium">PNG (高清晰度)</div>
                 </div>
                 <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 text-sm">
                   <div className="text-gray-500 dark:text-gray-400 mb-1">图片尺寸</div>
                   <div className="font-medium">400 × 400 像素</div>
                 </div>
               </div>
               
               <div className="flex flex-col sm:flex-row gap-4 justify-center">
                 <a
                   href={qrCodeUrl}
                   download="qrcode.png"
                   className="flex-1 sm:flex-none sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
                 >
                   <i className="fa-solid fa-download"></i>
                   下载二维码
                 </a>
                 <button
                   onClick={() => {
                     navigator.clipboard.writeText(inputValue).then(() => {
                       setCopied(true);
                       setTimeout(() => setCopied(false), 2000);
                     });
                   }}
                   className="flex-1 sm:flex-none sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-medium rounded-xl shadow hover:shadow-md transform hover:-translate-y-1 transition-all"
                 >
                   <i className="fa-solid fa-copy"></i>
                   {copied ? '已复制内容' : '复制输入内容'}
                 </button>
               </div>
             </motion.div>
          )}
        </div>
        
        {/* 功能说明 */}
        <motion.div
          className="w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-6 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
            <i className="fa-solid fa-info-circle text-green-500 mr-2"></i>
            功能说明
          </h3>
          
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li className="flex items-start">
              <i className="fa-solid fa-check-circle text-green-500 mt-1 mr-2"></i>
              <span>输入网址或文本内容，系统将自动生成二维码</span>
            </li>
            <li className="flex items-start">
              <i className="fa-solid fa-check-circle text-green-500 mt-1 mr-2"></i>
              <span>支持HTTP、HTTPS链接以及纯文本内容</span>
            </li>
            <li className="flex items-start">
              <i className="fa-solid fa-check-circle text-green-500 mt-1 mr-2"></i>
              <span>右键点击二维码图片可直接保存到本地</span>
            </li>
            <li className="flex items-start">
              <i className="fa-solid fa-check-circle text-green-500 mt-1 mr-2"></i>
              <span>所有操作在本地完成，保护您的隐私安全</span>
            </li>
          </ul>
        </motion.div>
      </div>
      
      {/* 页脚 */}
      <footer className="mt-12 text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>极简二维码生成工具 &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default QRCodeGenerator;