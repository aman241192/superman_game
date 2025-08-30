import React, { useEffect, useState, useRef } from "react";
import Avatar from "../../components/Avatar";
import Star from "../../components/Star";

const GAME_WIDTH = 1200;
const GAME_HEIGHT = 600;
const AVATAR_SIZE = 150; // Updated to match actual avatar size
const FINISH_LINE = GAME_WIDTH - AVATAR_SIZE;

const Game = () => {
  const [avatarX, setAvatarX] = useState(50);
  const [avatarY, setAvatarY] = useState((GAME_HEIGHT - AVATAR_SIZE) / 2);
  const [stars, setStars] = useState([]);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState("notStarted");
  const [level, setLevel] = useState(1);
  const [fallSpeed, setFallSpeed] = useState(5);
  const [spawnRate, setSpawnRate] = useState(0.1);
  const intervalRef = useRef(null);
  const [move, setMove] = useState(false);

  const isPlaying = gameState === "playing";

  const moveAvatar = () => {
    if (gameState !== "playing") return;
    setMove(true);

    setAvatarX((prevX) => {
      const nextX = prevX + 100;
      if (nextX >= FINISH_LINE) {
        setGameState("won");
        setScore((prev) => prev + 10);
        setAvatarX(50);
        return FINISH_LINE;
      }
      return nextX;
    });

    setScore((prev) => prev + 5);
    setTimeout(() => setMove(false), 300);
  };

  const spawnStar = () => {
    const x = Math.floor(Math.random() * (GAME_WIDTH - 20));
    const direction = Math.random() > 0.5 ? "right" : "left";
    return { id: Date.now() + Math.random(), x, y: 0, direction };
  };

  // Fixed collision detection with proper timing
  const checkCollisions = (currentStars, currentAvatarX, currentAvatarY) => {
    for (let star of currentStars) {
      const starSize = 20;
      const heroSize = AVATAR_SIZE;

      // Add some buffer for more forgiving gameplay
      const buffer = 15;

      // AABB (Axis-Aligned Bounding Box) collision detection
      if (
        star.x < currentAvatarX + heroSize - buffer &&
        star.x + starSize > currentAvatarX + buffer &&
        star.y < currentAvatarY + heroSize - buffer &&
        star.y + starSize > currentAvatarY + buffer
      ) {
        return true; // Collision detected
      }
    }
    return false;
  };

  useEffect(() => {
    if (!isPlaying) return;

    intervalRef.current = setInterval(() => {
      setStars((prevStars) => {
        const updated = prevStars
          .map((star) => ({
            ...star,
            y: star.y + fallSpeed,
            x: star.x + (star.direction === "right" ? 2 : -2),
          }))
          .filter(
            (star) => star.y < GAME_HEIGHT && star.x > 0 && star.x < GAME_WIDTH
          );

        // Check collisions with current avatar position
        if (checkCollisions(updated, avatarX, avatarY)) {
          setGameState("over");
          clearInterval(intervalRef.current);
          return []; // Clear all stars
        }

        // Spawn new star
        if (Math.random() < spawnRate) {
          return [...updated, spawnStar()];
        }

        return updated;
      });
    }, 100);

    return () => clearInterval(intervalRef.current);
  }, [avatarX, avatarY, fallSpeed, spawnRate, isPlaying]);

  const startGame = () => {
    setAvatarX(50);
    setAvatarY((GAME_HEIGHT - AVATAR_SIZE) / 2); // Center vertically
    setStars([]);
    setScore(0);
    setGameState("playing");
    setLevel(1);
    setFallSpeed(5);
    setSpawnRate(0.1);
  };

  const nextLevel = () => {
    setAvatarX(50);
    setAvatarY((GAME_HEIGHT - AVATAR_SIZE) / 2); // Center vertically
    setStars([]);
    setGameState("playing");
    setLevel((prev) => prev + 1);
    setFallSpeed((prev) => prev + 2);
    setSpawnRate((prev) => Math.min(prev + 0.05, 0.5));
  };

  const restartGame = () => {
    startGame();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4 w-full">
      <div
        className="relative rounded-lg overflow-hidden bgImg" // In game
        style={{
          width: GAME_WIDTH,
          height: GAME_HEIGHT,
        }}
        onClick={moveAvatar}
      >
        {/* Superman avatar */}
        <Avatar x={avatarX} y={avatarY} move={move} />

        {/* Falling stars */}
        {stars.map((star) => (
          <Star key={star.id} x={star.x} y={star.y} />
        ))}

        {/* Finish line */}
        <div
          className="absolute top-0 w-2 h-full "
          style={{ left: FINISH_LINE + AVATAR_SIZE / 2 }}
        />

        {/* HUD & Overlays */}
        {gameState === "playing" && (
          <div className="absolute top-4 left-4 right-4 flex justify-between text-white text-xl">
            <span>🏆 Score: {score}</span>
            <span>🚀 Level: {level}</span>
            <span>🌟 Stars: {stars.length}</span>
          </div>
        )}

        {gameState === "notStarted" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center startImg bg-opacity-50">
            <h2 className="text-white text-4xl mb-6">
              🌟 Superman Sky Escape!
            </h2>
            <p className="text-white text-xl mb-6">
              Click to move your hero to the finish line!
            </p>
            <button
              onClick={startGame}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-red-600 text-yellow-500 text-xl font-bold rounded-full shadow-lg hover:from-blue-500 hover:to-red-500 transition-all"
            >
              Start Game
            </button>
          </div>
        )}

        {gameState === "won" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center startImg bg-opacity-50">
            <h2 className="text-white text-4xl mb-4">🎉 Level Complete!</h2>
            <p className="text-white text-2xl mb-2 font-bold text-white p-2 rounded-md bg-yellow-500">
              Score: {score}
            </p>
            <button
              onClick={nextLevel}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-red-600 text-yellow-500 text-xl font-bold rounded-full shadow-lg hover:from-blue-500 hover:to-red-500 transition-all"
            >
              Next Level
            </button>
          </div>
        )}

        {gameState === "over" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center startImg bg-opacity-50">
            <h2 className="text-white text-4xl mb-4">Game Over!</h2>
            <p className="text-white text-2xl mb-2 font-bold text-white p-2 rounded-md bg-yellow-500">
              Your Score: {score}
            </p>
            <button
              onClick={restartGame}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-red-600 text-yellow-500 text-xl font-bold rounded-full shadow-lg hover:from-blue-500 hover:to-red-500 transition-all"
            >
              Restart
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 text-white text-center">
        <p>Click anywhere in the game area to move your hero!</p>
        <p>Avoid the falling kryptonite and reach the end!</p>
      </div>
    </div>
  );
};

export default Game;
