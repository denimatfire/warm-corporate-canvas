import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Play, RotateCcw } from 'lucide-react';

interface Position {
  x: number;
  y: number;
}

const SnakeGame = () => {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<string>('RIGHT');
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(150);

  const BOARD_SIZE = 20;
  const CELL_SIZE = 20;

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * BOARD_SIZE),
      y: Math.floor(Math.random() * BOARD_SIZE)
    };
    setFood(newFood);
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection('RIGHT');
    setGameOver(false);
    setScore(0);
    setGameStarted(false);
    generateFood();
  };

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
  };

  const moveSnake = useCallback(() => {
    if (!gameStarted || gameOver) return;

    setSnake(prevSnake => {
      const newSnake = [...prevSnake];
      const head = { ...newSnake[0] };

      switch (direction) {
        case 'UP':
          head.y = (head.y - 1 + BOARD_SIZE) % BOARD_SIZE;
          break;
        case 'DOWN':
          head.y = (head.y + 1) % BOARD_SIZE;
          break;
        case 'LEFT':
          head.x = (head.x - 1 + BOARD_SIZE) % BOARD_SIZE;
          break;
        case 'RIGHT':
          head.x = (head.x + 1) % BOARD_SIZE;
          break;
      }

      // Check collision with self
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        return prevSnake;
      }

      newSnake.unshift(head);

      // Check if food is eaten
      if (head.x === food.x && head.y === food.y) {
        setScore(prev => prev + 10);
        generateFood();
        // Increase speed every 50 points
        if (score > 0 && score % 50 === 0) {
          setSpeed(prev => Math.max(50, prev - 10));
        }
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameStarted, gameOver, score, generateFood]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameStarted) return;

      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [direction, gameStarted]);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const interval = setInterval(moveSnake, speed);
      return () => clearInterval(interval);
    }
  }, [moveSnake, gameStarted, gameOver, speed]);

  const renderBoard = () => {
    const board = [];
    for (let y = 0; y < BOARD_SIZE; y++) {
      for (let x = 0; x < BOARD_SIZE; x++) {
        const isSnake = snake.some(segment => segment.x === x && segment.y === y);
        const isFood = food.x === x && food.y === y;
        const isHead = snake[0]?.x === x && snake[0]?.y === y;

        let cellClass = 'border border-border/20';
        if (isSnake) {
          cellClass = isHead 
            ? 'bg-primary border-primary' 
            : 'bg-secondary border-secondary';
        } else if (isFood) {
          cellClass = 'bg-accent border-accent animate-pulse';
        }

        board.push(
          <div
            key={`${x}-${y}`}
            className={`${cellClass} transition-colors duration-100`}
            style={{
              width: CELL_SIZE,
              height: CELL_SIZE,
            }}
          />
        );
      }
    }
    return board;
  };

  return (
    <div className="flex flex-col items-center space-y-6 p-6 bg-card rounded-lg border border-border shadow-soft">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Snake Game</h2>
        <p className="text-muted-foreground">Use arrow keys to play!</p>
      </div>

      <div className="flex items-center space-x-4 mb-4">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Score</p>
          <p className="text-2xl font-bold text-primary">{score}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Speed</p>
          <p className="text-lg font-semibold text-secondary">{Math.round(1000 / speed)}</p>
        </div>
      </div>

      <div 
        className="grid gap-0 bg-background border-2 border-border rounded-lg overflow-hidden shadow-inner"
        style={{
          gridTemplateColumns: `repeat(${BOARD_SIZE}, ${CELL_SIZE}px)`,
          gridTemplateRows: `repeat(${BOARD_SIZE}, ${CELL_SIZE}px)`,
        }}
      >
        {renderBoard()}
      </div>

      <div className="flex space-x-4">
        {!gameStarted ? (
          <Button onClick={startGame} className="bg-primary hover:bg-primary-hover">
            <Play className="w-4 h-4 mr-2" />
            Start Game
          </Button>
        ) : (
          <Button onClick={resetGame} className="bg-secondary hover:bg-secondary-hover">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        )}
      </div>

      {gameOver && (
        <div className="text-center">
          <p className="text-lg font-semibold text-destructive mb-2">Game Over!</p>
          <p className="text-muted-foreground">Final Score: {score}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 text-center text-sm text-muted-foreground">
        <div className="flex items-center justify-center space-x-2">
          <ArrowUp className="w-4 h-4" />
          <span>Move Up</span>
        </div>
        <div className="flex items-center justify-center space-x-2">
          <ArrowDown className="w-4 h-4" />
          <span>Move Down</span>
        </div>
        <div className="flex items-center justify-center space-x-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Move Left</span>
        </div>
        <div className="flex items-center justify-center space-x-2">
          <ArrowRight className="w-4 h-4" />
          <span>Move Right</span>
        </div>
      </div>
    </div>
  );
};

export default SnakeGame;
