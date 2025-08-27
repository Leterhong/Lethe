import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface TutorialProps {
  onClose: () => void;
  onStartGame: () => void;
}

const Tutorial: React.FC<TutorialProps> = ({ onClose, onStartGame }) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const tutorialSteps = [
    {
      title: "欢迎来到记忆翻牌游戏！",
      description: "这是一个经典的记忆配对游戏，考验你的记忆力和观察力。",
      image: <div className="text-5xl my-4">🧠</div>
    },
    {
      title: "游戏规则很简单",
      description: "点击任意两张卡片，如果它们匹配，就会保持翻开状态。找出所有匹配的卡片即可获胜！",
      image: (
        <div className="flex justify-center gap-2 my-4">
          <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center text-white">1</div>
          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">?</div>
          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">?</div>
        </div>
      )
    },
    {
      title: "多种游戏模式",
      description: "尝试不同的游戏模式挑战自己：经典模式、计时挑战、限步模式和渐进难度模式。",
      image: (
        <div className="flex justify-center gap-3 my-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-1">1</div>
            <div className="text-xs">经典</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-1">⏱️</div>
            <div className="text-xs">计时</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 mx-auto mb-1">📊</div>
            <div className="text-xs">限步</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mx-auto mb-1">📈</div>
            <div className="text-xs">渐进</div>
          </div>
        </div>
      )
    },
    {
      title: "准备好开始挑战了吗？",
      description: "选择难度和主题，开始你的记忆翻牌之旅！祝你玩得开心！",
      image: <div className="text-5xl my-4">🎮</div>
    }
  ];
  
  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onStartGame();
    }
  };
  
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">游戏教程</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            <i class="fa-solid fa-times"></i>
          </button>
        </div>
        
        <div className="text-center mb-6">
          <div className="flex justify-center">
            {tutorialSteps.map((_, index) => (
              <div 
                key={index}
                className={`w-2 h-2 rounded-full mx-1 ${
                  index === currentStep ? 'bg-blue-500' : 'bg-gray-200'
                }`}
              ></div>
            ))}
          </div>
          
          {tutorialSteps[currentStep].image}
          
          <h3 className="text-xl font-bold mb-2">{tutorialSteps[currentStep].title}</h3>
          <p className="text-gray-600">{tutorialSteps[currentStep].description}</p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
              currentStep === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'border border-gray-300 hover:bg-gray-50'
            }`}
          >
            上一步
          </button>
          <button
            onClick={nextStep}
            className="flex-1 py-2 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            {currentStep < tutorialSteps.length - 1 ? '下一步' : '开始游戏'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;