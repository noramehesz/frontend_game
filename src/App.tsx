import React, { useState, useEffect, useRef, Fragment } from 'react';
import './App.css';
import { Sprite, Stage } from "react-pixi-fiber";
import splash from './images/splashexample.png';
import * as PIXI from 'pixi.js';
import { Background } from './bgAnimation';

enum GameState {
  splashState = 'splashState',
  menuState = 'menuState',
  gameState = 'gameState',
}

function App() {
  const [spalshImage, setSplashImage] = useState({alpha: 1, visible: true});
  const [gameState, setGameState] = useState(GameState.splashState)

  const requestRef = useRef(0);
  const prevValueRef = useRef(1);

  const animate = () => {
    if (prevValueRef.current !== undefined) {
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
      requestRef.current = requestAnimationFrame(animate);
    }
  }

  useEffect(() => {
    setTimeout(() => {
      requestRef.current = requestAnimationFrame(animate);
      return () => {
        cancelAnimationFrame(requestRef.current);
      }
    }, 2000);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  return (
    <Fragment>
      <Stage options={{width: 800, height: 600, backgroundColor: 0x02020F}}>
        { gameState === GameState.splashState &&
            <Sprite texture={PIXI.Texture.from(splash)} alpha={spalshImage.alpha} zIndex={100}></Sprite>
        }
        { gameState === GameState.menuState && <Background/>}
      </Stage>
    </Fragment>
);
}
 
export default App;
