"use client";

import { useEffect, useState } from "react";
import Cell from "./cell";

export default function Game() {
  const [gameState, setGameState] = useState<string>("not_started");
  const [game, setGame] = useState<(boolean | null)[]>([
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ]);
  const [scores, setScores] = useState<{ player1: number; player2: number }>({
    player1: 0,
    player2: 0,
  });

  useEffect(() => {
    fetch("http://127.0.0.1:5000/scores")
      .then((res) => res.json())
      .then((data) => {
        console.log("Scores:", data);
        setScores({ player1: data.player1, player2: data.player2 });
      });
  });

  const startGame = () => {
    console.log("starting game");
    setGameState("player1");
    setGame([null, null, null, null, null, null, null, null, null]);
  };

  const winners = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const calcGameState = (g: (boolean | null)[]): string => {
    for (const w of winners) {
      if (g[w[0]] === g[w[1]] && g[w[1]] === g[w[2]] && g[w[0]] !== null) {
        if (g[w[0]]) {
          fetch("http://127.0.0.1:5000/score/player1", { method: "POST" });
        } else {
          fetch("http://127.0.0.1:5000/score/player2", { method: "POST" });
        }
        return g[w[0]] ? "winner_player1" : "winner_player2";
      }
    }
    if (g.every((v) => v !== null)) {
      return "game_over";
    }
    return "next_turn";
  };

  const cellClicked = (key: number) => {
    console.log("cell clicked " + key);

    if (!(gameState === "player1" || gameState === "player2")) {
      return;
    }

    let gameCopy = [...game];

    if (game[key] === null) {
      gameCopy[key] = gameState === "player1";

      setGame((prev) => {
        let next = [...prev];
        next[key] = gameCopy[key];
        return next;
      });

      const nextGameState = calcGameState(gameCopy);
      if (nextGameState === "next_turn") {
        setGameState((prev) => (prev === "player1" ? "player2" : "player1"));
      } else {
        setGameState(nextGameState);
      }
    }
  };

  if (game.length !== 9) {
    return <div>Loading...</div>;
  }

  let gameStateText = "";
  switch (gameState) {
    case "player1":
      gameStateText = "Player 1, pick a square";
      break;
    case "player2":
      gameStateText = "Player 2, pick a square";
      break;
    case "winner_player1":
      gameStateText = "Player 1 wins!";
      break;
    case "winner_player2":
      gameStateText = "Player 2 wins!";
      break;
    case "game_over":
      gameStateText = "Game over, it's a tie!";
      break;
  }

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[2px] row-start-2 items-center">
        {scores && (
          <div className="my-[20px]">
            <div>Scores</div>
            <div>Player 1: {scores.player1}</div>
            <div>Player 2: {scores.player2}</div>
          </div>
        )}
        <div className="my-[20px]">
          {gameState === "not_started" && (
            <div className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
              <button onClick={() => startGame()}>Start game</button>
            </div>
          )}
          {gameState !== "not_started" && <div>{gameStateText}</div>}
          {["winner_player1", "winner_player2", "game_over"].indexOf(
            gameState
          ) !== -1 && (
            <div className="my-[20px] bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
              <button onClick={() => startGame()}>Play again</button>
            </div>
          )}
        </div>
        {[0, 1, 2].map((i) => (
          <div className="flex flex-row gap-[2px]" key={i}>
            {[0, 1, 2].map((j) => (
              <Cell
                key={i * 3 + j}
                cellId={i * 3 + j}
                value={game[i * 3 + j]}
                onClick={(key: number) => cellClicked(key)}
              />
            ))}
          </div>
        ))}
      </main>
    </div>
  );
}
