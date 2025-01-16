import React, { useState, useEffect } from "react";
import Grid from "./components/grid/Grid";
import "./App.css";

const App: React.FC = () => {
  const rows = 20; // Nombre de lignes
  const cols = 20; // Nombre de colonnes

  // État du serpent
  const [snake, setSnake] = useState<Array<[number, number]>>([
    [10, 9],
    [10, 8],
  ]);

  // Direction actuelle du serpent
  const [direction, setDirection] = useState<"UP" | "DOWN" | "LEFT" | "RIGHT">("RIGHT");
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0); // Score actuel
  const [bestScore, setBestScore] = useState<number>(() => {
    return Number(localStorage.getItem("snake_best_score")) || 0; // Utilisez la clé unique
  });
  const [time, setTime] = useState(0); // Temps écoulé en secondes
  const [speed, setSpeed] = useState(200); // Vitesse initiale en ms

  // Ajouter une pomme
  const [food, setFood] = useState<[number, number]>([5, 5]);

  // Fonction pour générer une nouvelle pomme
  const generateFood = () => {
    let newFood: [number, number];
    do {
      newFood = [
        Math.floor(Math.random() * rows),
        Math.floor(Math.random() * cols),
      ];
    } while (snake.some(([sRow, sCol]) => sRow === newFood[0] && sCol === newFood[1]));
    setFood(newFood);
  };

  // Fonction pour déplacer le serpent
  const updateSnake = () => {
    const head = snake[0];
    let newHead: [number, number];

    switch (direction) {
      case "UP":
        newHead = [head[0], head[1] - 1];
        break;
      case "DOWN":
        newHead = [head[0], head[1] + 1];
        break;
      case "LEFT":
        newHead = [head[0] - 1, head[1]];
        break;
      case "RIGHT":
        newHead = [head[0] + 1, head[1]];
        break;
      default:
        newHead = head;
    }

    if (
      newHead[0] < 0 ||
      newHead[0] >= rows ||
      newHead[1] < 0 ||
      newHead[1] >= cols ||
      snake.some(([sRow, sCol]) => sRow === newHead[0] && sCol === newHead[1])
    ) {
      resetGame();
      return;
    }

    let newSnake = [newHead, ...snake];

    // Si le serpent mange la pomme
    if (newHead[0] === food[0] && newHead[1] === food[1]) {
      setScore(score + 100); // Augmente le score
      generateFood(); // Génère une nouvelle pomme
    } else {
      newSnake.pop(); // Si pas de pomme, retire la queue
    }

    setSnake(newSnake);
  };

  // Réinitialise le jeu
  const resetGame = () => {
    if (score > bestScore) {
      setBestScore(score); // Met à jour le meilleur score
      localStorage.setItem("snake_best_score", String(score)); // Sauvegarde dans le localStorage
    }
    setSnake([
      [10, 9],
      [10, 8],
    ]);
    setDirection("RIGHT");
    setScore(0); // Réinitialise le score
    setTime(0); // Réinitialise le timer
    setSpeed(200); // Réinitialise la vitesse
    generateFood(); // Génère une nouvelle pomme
  };

  // Gestion des événements clavier
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowUp":
          if (direction !== "DOWN") setDirection("UP");
          break;
        case "ArrowDown":
          if (direction !== "UP") setDirection("DOWN");
          break;
        case "ArrowLeft":
          if (direction !== "RIGHT") setDirection("LEFT");
          break;
        case "ArrowRight":
          if (direction !== "LEFT") setDirection("RIGHT");
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction]);

  // Mise à jour automatique du serpent selon la vitesse
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(updateSnake, speed);
    return () => clearInterval(interval);
  }, [snake, direction, isPaused, speed]);

  // Timer de la partie
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => setTime((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, [isPaused]);

  useEffect(() => {
    // Charger le meilleur score depuis le localStorage au démarrage
    const savedBestScore = localStorage.getItem("snake_best_score");
    if (savedBestScore) {
      setBestScore(Number(savedBestScore));
    }
  }, []);

  useEffect(() => {
    // Mettre à jour le meilleur score dans le localStorage si le score actuel est meilleur
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem("snake_best_score", score.toString());
    }
  }, [score, bestScore]);

  // Augmenter la vitesse lorsque le score dépasse 600
  useEffect(() => {
    if (score >= 600 && score < 1500) {
      setSpeed(200 * 0.8); // Réduit la durée de l'intervalle de 20 %
    }
    if (score >= 1500 && score < 2000) {
      setSpeed(200 * 0.6); // Réduit la durée de l'intervalle de 20 %
    }
    if (score >= 2000 && score < 3000) {
      setSpeed(200 * 0.4); // Réduit la durée de l'intervalle de 20 %
    }
    if (score >= 3000) {
      setSpeed(200 * 0.2); // Réduit la durée de l'intervalle de 20 %
    }
  }, [score]);

  return (
    <div className="app">
      <h1>Snake Game</h1>
      <div className="game-container">
        <Grid rows={rows} cols={cols} snake={snake} food={food} />
        <div className="stats">
          <h2>Score: {score}</h2>
          <h2>Best Score: {bestScore}</h2>
          <h2>Time: {time}s</h2>
          <button onClick={() => setIsPaused((prev) => !prev)}>
            {isPaused ? "Resume" : "Pause"}
          </button>
          <button onClick={resetGame}>Restart</button>
        </div>
      </div>
    </div>
  );
};

export default App;