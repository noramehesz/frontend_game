import React, { useState, useEffect, useRef, Fragment } from "react";
import "./App.css";
import { Sprite, Stage, Container } from "react-pixi-fiber";
import splash from "./images/space.png";
import * as PIXI from "pixi.js";
import { Background } from "./bgAnimation";
import { CustomButton } from "./Button";
import { Parallax } from "./ParallaxPlayground";

export enum GameState {
  splashState = "splashState",
  menuState = "menuState",
  gameState = "gameState",
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
            <CustomButton
              text={"GAME1"}
              position={new PIXI.Point(400, 120)}
              onClick={handleGameButtonOnClick}
            />
            <CustomButton
              text={"GAME2"}
              position={new PIXI.Point(400, 240)}
              onClick={handleGameButtonOnClick}
            />
            <CustomButton
              text={"GAME3"}
              position={new PIXI.Point(400, 360)}
              onClick={handleGameButtonOnClick}
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
      </Stage>
    </Fragment>
  );
}

export default App;
