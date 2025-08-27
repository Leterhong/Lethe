import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps {
  id: number;
  icon: string;
  isFlipped: boolean;
  isMatched: boolean;
  onClick: () => void;
  size: string;
  cardBackStyle: string;
  flipTime: number;
  disabled: boolean;
}

const Card: React.FC<CardProps> = ({
  id,
  icon,
  isFlipped,
  isMatched,
  onClick,
  size,
  cardBackStyle,
  flipTime,
  disabled
}) => {
  // 卡片翻转动画变体
  const cardVariants = {
    hidden: {
      rotateY: 0,
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
    },
    flipped: {
      rotateY: 180,
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
    }
  };
  
  // 卡片内容变体（用于显示/隐藏正面和背面）
  const contentVariants = {
    hidden: {
      opacity: 0,
      rotateY: -180
    },
    visible: {
      opacity: 1,
      rotateY: 0
    }
  };
  
  // 匹配成功动画
  const matchedVariants = {
    initial: {
      scale: 1
    },
    matched: {
      scale: 1.1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 10
      }
    },
    afterMatch: {
      scale: 1,
      opacity: 0.9
    }
  };
  
  return (
    <motion.div
      id={`card-${id}`}
      className={cn(
        'relative cursor-pointer rounded-xl overflow-hidden shadow-lg',
        size,
        disabled ? 'cursor-not-allowed' : ''
      )}
      onClick={onClick}
      variants={cardVariants}
      initial="hidden"
      animate={isFlipped ? 'flipped' : 'hidden'}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 30,
        duration: flipTime / 1000
      }}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d'
      }}
    >
      {/* 卡片背面 */}
      <motion.div
        className={cn(
          'absolute inset-0 flex items-center justify-center',
          cardBackStyle,
          'text-white text-3xl font-bold shadow-inner'
        )}
        variants={contentVariants}
        initial="visible"
        animate={isFlipped ? 'hidden' : 'visible'}
        transition={{ duration: flipTime / 1000 / 2 }}
        style={{ backfaceVisibility: 'hidden' }}
      >
        <i class="fa-solid fa-question"></i>
      </motion.div>
      
      {/* 卡片正面 */}
      <motion.div
        className={cn(
          'absolute inset-0 flex items-center justify-center bg-white rounded-xl',
          'text-4xl sm:text-5xl font-bold shadow-inner'
        )}
        variants={contentVariants}
        initial="hidden"
        animate={isFlipped ? 'visible' : 'hidden'}
        transition={{ duration: flipTime / 1000 / 2 }}
        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
      >
        <motion.span
          variants={matchedVariants}
          initial="initial"
          animate={isMatched ? 'afterMatch' : 'initial'}
          transition={{ duration: 0.5 }}
          whileHover={!isMatched ? { scale: 1.1 } : undefined}
        >
          {icon}
        </motion.span>
      </motion.div>
    </motion.div>
  );
};

export default Card;