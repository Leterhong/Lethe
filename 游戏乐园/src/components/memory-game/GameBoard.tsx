import React from 'react';
import { motion } from 'framer-motion';
import Card from './Card';
import { cn } from '@/lib/utils';

interface GameBoardProps {
  cards: {
    id: number;
    icon: string;
    matched: boolean;
  }[];
  flippedCards: number[];
  matchedCards: number[];
  flipCard: (id: number) => void;
  isProcessing: boolean;
  size: number;
  cardBackStyle: string;
  flipTime: number;
}

const GameBoard: React.FC<GameBoardProps> = ({
  cards,
  flippedCards,
  matchedCards,
  flipCard,
  isProcessing,
  size,
  cardBackStyle,
  flipTime
}) => {
  // 根据尺寸计算网格样式
  const getGridStyle = () => {
    switch (size) {
      case 4:
        return 'grid-cols-4 gap-3 sm:gap-4';
      case 5:
        return 'grid-cols-5 gap-2 sm:gap-3';
      case 6:
        return 'grid-cols-6 gap-2 sm:gap-3';
      default:
        return 'grid-cols-4 gap-3 sm:gap-4';
    }
  };
  
  // 根据尺寸计算卡片大小
  const getCardSize = () => {
    switch (size) {
      case 4:
        return 'w-20 h-20 sm:w-24 sm:h-24'; // 4x4网格的卡片尺寸
      case 5:
        return 'w-16 h-16 sm:w-20 sm:h-20'; // 5x5网格的卡片尺寸
      case 6:
        return 'w-14 h-14 sm:w-16 sm:h-16'; // 6x6网格的卡片尺寸
      default:
        return 'w-20 h-20 sm:w-24 sm:h-24';
    }
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div 
        className={cn(
          'grid justify-items-center',
          getGridStyle()
        )}
      >
        {cards.map((card) => (
          <Card
            key={card.id}
            id={card.id}
            icon={card.icon}
            isFlipped={flippedCards.includes(card.id) || matchedCards.includes(card.id)}
            isMatched={matchedCards.includes(card.id)}
            onClick={() => flipCard(card.id)}
            size={getCardSize()}
            cardBackStyle={cardBackStyle}
            flipTime={flipTime}
            disabled={isProcessing}
          />
        ))}
      </div>
    </div>
  );
};

export default GameBoard;