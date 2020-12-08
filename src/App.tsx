import React, { useState, useEffect, useRef, Fragment } from "react";
import "./App.css";
import { Sprite, Stage, Container } from "react-pixi-fiber";
import splash from "./images/space.png";
import logo from "./images/logo.png"
import * as PIXI from "pixi.js";
import { Background } from "./bgAnimation";
import { CustomButton } from "./Button";
import { Parallax } from "./ParallaxPlayground";
import HighScores from "./HighScores";

export enum GameState {
  splashState = "splashState",
  menuState = "menuState",
  gameState = "gameState",
  highScores = "highScores"
}

export type RocketType = {
  posX: number;
  posY: number;
  visibility: boolean;
};

function App() {
  const [spalshImage, setSplashImage] = useState({ alpha: 1, visible: true });
  const [gameState, setGameState] = useState(GameState.splashState);

  const requestRef = useRef(0);
  const prevValueRef = useRef(1);

  const animateSplash = () => {
    if (gameState === GameState.splashState) {
      let newAlpha = prevValueRef.current - 0.01;
      if (newAlpha <= 0) {
        setSplashImage({
          visible: false,
          alpha: 0,
        });
        setGameState(GameState.menuState);
        return 0;
      }
      setSplashImage({
        ...spalshImage,
        alpha: newAlpha,
      });
      prevValueRef.current = newAlpha;
      requestRef.current = requestAnimationFrame(animateSplash);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      requestRef.current = requestAnimationFrame(animateSplash);
      return () => {
        cancelAnimationFrame(requestRef.current);
      };
    }, 2000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGameButtonOnClick = () => {
    setGameState(GameState.gameState);
  };

  const handleHighScoreOnClick = () => {
    setGameState(GameState.highScores)
  }

  const handleBackButton = () => {
    setGameState(GameState.menuState)
  }

  const handleExit = () => {
    window.location.replace("http://www.google.com");
  };

  return (
    <Fragment>
      <Stage
        options={{ width: 800, height: 600, backgroundColor: 0x02020f }}
        interactive={true}
        className={gameState === GameState.gameState ? "play" : ""}
      >
        {gameState === GameState.splashState && (
          <Sprite
            texture={PIXI.Texture.from(splash)}
            alpha={spalshImage.alpha}
            zIndex={100}
          ></Sprite>
        )}
        {gameState === GameState.menuState && (
          <Container>
            <Background />
            <Sprite 
             texture={PIXI.Texture.from(logo)}
              position={new PIXI.Point(400, 100)}
              anchor={new PIXI.Point(0.5, 0.5)}
              scale={new PIXI.Point(0.6, 0.6)}
             />
            <CustomButton
              text={"PLAY"}
              position={new PIXI.Point(400, 240)}
              onClick={handleGameButtonOnClick}
            />
            <CustomButton
              text={"HIGH SCORES"}
              position={new PIXI.Point(400, 360)}
              onClick={handleHighScoreOnClick}
              isHighScore={true}
            />
            <CustomButton
              text={"EXIT"}
              position={new PIXI.Point(400, 480)}
              onClick={handleExit}
            />
          </Container>
        )}
        {gameState === GameState.gameState && (
          <Container interactive={true}>
            <Parallax setGameState={setGameState} />
          </Container>
        )}
        {
          gameState === GameState.highScores && (
            <Container>
              <Background/>
              <HighScores backToMenuOnClick={handleBackButton}/>
            </Container>
          )
        }
      </Stage>
    </Fragment>
  );
}

export default App;
