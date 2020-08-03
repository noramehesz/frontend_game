import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { Sprite, Stage } from "react-pixi-fiber";
import splash from './images/splashexample.png';
import * as PIXI from 'pixi.js';


/*function useInterval(callback: () => {}, delay: number) {
  const intervalRef = React.useRef(any);
  const callbackRef = React.useRef(callback);

  React.useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  React.useEffect(() => {
      intervalRef.current = window.setInterval(() => callbackRef.current(), delay);
      return () => window.clearInterval(intervalRef.current);
  }, [delay]);
  
  return intervalRef;
}*/


function App() {
  const [spalshImage, setSplashImage] = useState({alpha: 1, visible: true});

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

 /* const fadeOut = useCallback(() => {
    function decrease() {
      let newAlpha = spalshImage.alpha - 0.05;
      console.log(newAlpha);
      if (newAlpha <= 0) {
        setSplashImage({
          alpha: 0,
          visible: false,
        });
        return true;
      }
      setSplashImage({
        ...spalshImage,
        alpha: newAlpha,
      }); 
      requestAnimationFrame(decrease);
    }
    decrease();
  }, [spalshImage]);

  useEffect(() => {
    setTimeout(() => {
      fadeOut();
    }, 2000);
  }, [fadeOut]);*/

  useEffect(() => {
    setTimeout(() => {
      requestRef.current = requestAnimationFrame(animate);
      const script = document.createElement('script');
      script.src = './space.js';
      script.async = true;
      document.body.appendChild(script);
      return () => {
        cancelAnimationFrame(requestRef.current);
        document.body.removeChild(script);  
      }
    }, 2000);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  return (
    <Stage options={{width: 800, height: 600,}}>
      { spalshImage.visible &&
          <Sprite texture={PIXI.Texture.from(splash)} alpha={spalshImage.alpha} zIndex={100}></Sprite>
      }
    </Stage>
);
}

export default App;
