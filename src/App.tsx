import React, { useState, useEffect, useRef, Fragment, useCallback } from 'react';
import './App.css';
import { Sprite, Stage, Container, usePixiApp } from "react-pixi-fiber";
import splash from './images/space.png';
import rocket from './images/bullet.png';
import * as PIXI from 'pixi.js';
import { Background } from './bgAnimation';
import { CustomButton } from './Button';
import { Spaceship } from './gameItems/Spaceship';
import { Rocket } from './gameItems/Rocket';
import { Parallax } from './ParallaxBackground';

const INITROCKETS = [
  {posX: 0, posY: 0, visibility: false},
  {posX: 0, posY: 0, visibility: false},
  {posX: 0, posY: 0, visibility: false},
];
const NUMOFENEMIES = 25;

enum GameState {
  splashState = 'splashState',
  menuState = 'menuState',
  gameState = 'gameState',
}

export type RocketType = {
  posX: number,
  posY: number,
  visibility: boolean,
}

function App() {
  const [spalshImage, setSplashImage] = useState({alpha: 1, visible: true});
  const [gameState, setGameState] = useState(GameState.splashState);
  const [rocket1, setRocket1] = useState(INITROCKETS[0]);
  const [rocket2, setRocket2] = useState(INITROCKETS[1]);
  const [rocket3, setRocket3] = useState(INITROCKETS[2]);

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
  }

  useEffect(() => {
    setTimeout(() => {
        requestRef.current = requestAnimationFrame(animateSplash);
      return () => {
        cancelAnimationFrame(requestRef.current);
      }
    }, 2000);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleGameButtonOnClick = () => {
    setGameState(GameState.gameState);
  }

  const handleExit = () => {
    window.location.replace("http://www.google.com");
  }

  const addRocketWhenShoot = (pos: {x: number, y: number}) => {
      let toUpdate;
      if (!rocket1.visibility) {
        toUpdate = rocket1;
        toUpdate.posX = pos.x;
        toUpdate.posY = pos.y;
        toUpdate.visibility = true;
        setRocket1(toUpdate);
        return;
      } else if (!rocket2.visibility) {
        toUpdate = rocket2;
        toUpdate.posX = pos.x;
        toUpdate.posY = pos.y;
        toUpdate.visibility = true;
        setRocket2(toUpdate);
        return;
      } else if (!rocket3.visibility) {
        toUpdate = rocket3;
        toUpdate.posX = pos.x;
        toUpdate.posY = pos.y;
        toUpdate.visibility = true;
        setRocket3(toUpdate);
        return;
      }
  }

  return (
    <Fragment>
      <Stage options={{width: 800, height: 600, backgroundColor: 0x02020F}} interactive={true}>
        { gameState === GameState.splashState &&
            <Sprite texture={PIXI.Texture.from(splash)} alpha={spalshImage.alpha} zIndex={100}></Sprite>
        }
        { gameState === GameState.menuState && 
          (
            <Container>
              <Background/>
              <CustomButton text={"GAME1"} position={new PIXI.Point(400, 120)} onClick={handleGameButtonOnClick}/>
              <CustomButton text={"GAME2"} position={new PIXI.Point(400, 240)} onClick={handleGameButtonOnClick}/>
              <CustomButton text={"GAME3"} position={new PIXI.Point(400, 360)} onClick={handleGameButtonOnClick}/>
              <CustomButton text={"EXIT"} position={new PIXI.Point(400, 480)} onClick={handleExit}/>
            </Container>
          )
        }
        {
          gameState === GameState.gameState &&
          (
            <Container interactive={true}>
              <Parallax />  
            </Container>
          )
        }
      </Stage>
    </Fragment>
  );
}
 
export default App;
