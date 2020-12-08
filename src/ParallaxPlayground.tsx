import React, { useEffect, useState, useRef, useCallback } from "react";
import * as PIXI from "pixi.js";
import {
  Container,
  TilingSprite,
  Sprite,
  usePixiApp,
  Text,
} from "react-pixi-fiber";
import bg from "./images/parallax_background/background.png";
import middle from "./images/parallax_background/smallPlanets.png";
import front from "./images/parallax_background/planet.png";
import rocket from "./images/bullet.png";
import blowUpPng from "./images/spritesheet.png";
import blowUpJson from "./images/spritesheet.json";
import { Spaceship } from "./gameItems/Spaceship";
import { RocketType, GameState } from "./App";
import enemy from "./images/enemy.png";
import { set, get } from "idb-keyval";

const ROCKETSIZE = {
  width: 53,
  height: 19,
};

const ENEMYSIZE = {
  width: 60,
  height: 76,
};

const SPACESHIPSIZE = {
  width: 67,
  height: 35,
};

interface ParallaxProps {
  setGameState: any;
}

const INITROCKETS: Array<RocketType> = [
  { posX: 0, posY: 0, visibility: false },
  { posX: 0, posY: 0, visibility: false },
  { posX: 0, posY: 0, visibility: false },
];

type EnemyPath = {
  A1: number;
  A2: number;
  p1: number;
  p2: number;
  translation: number;
};

export function Parallax(props: ParallaxProps) {
  const app = usePixiApp();
  const willMount = useRef(true);
  const [BgX, setBgX] = useState(0);
  const [middleX, setMiddleX] = useState(0);
  const [frontX, setFrontx] = useState(0);
  const [score, setScore] = useState(0);
  const scoreAsRef = useRef(0);
  const scoreStyle = new PIXI.TextStyle();
  scoreStyle.fill = "#FFFFFF";
  scoreStyle.dropShadow = true;

  const [blowingUp, setBBlowingUp] = useState(new Array<PIXI.Texture>());

  const [spaceshipPos, setSaceshipPos] = useState({
    posX: 100,
    posY: 300,
    visibility: true,
  });

  const spaceshipDies = useRef({ rot: 0, scale: { x: 1, y: 1 }, opacity: 1 });

  const [rocket1, setRocket1] = useState(INITROCKETS[0]);
  const [rocket2, setRocket2] = useState(INITROCKETS[1]);
  const [rocket3, setRocket3] = useState(INITROCKETS[2]);

  const [enemy1, setEnemy1] = useState({
    posX: -200,
    posY: -200,
    startY: 0,
    visibility: false,
    path: {} as EnemyPath,
  });
  const [enemy2, setEnemy2] = useState({
    posX: -200,
    posY: -200,
    visibility: false,
    startY: 0,
    path: {} as EnemyPath,
  });
  const [enemy3, setEnemy3] = useState({
    posX: -200,
    posY: -200,
    visibility: false,
    startY: 0,
    path: {} as EnemyPath,
  });

  const requestRef = useRef(0);
  const prevX = useRef(0);

  const rocket1PrevX = useRef(0);
  const rocket1PrevVis = useRef(false);
  const rocket2PrevX = useRef(0);
  const rocket2PrevVis = useRef(false);
  const rocket3PrevX = useRef(0);
  const rocket3PrevVis = useRef(false);

  const enemy1PrevX = useRef(750);
  const enemy1PrevVis = useRef(false);
  const enemy2PrevX = useRef(750);
  const enemy2PrevVis = useRef(false);
  const enemy3PrevX = useRef(750);
  const enemy3PrevVis = useRef(false);

  const [isGameOver, setGameOver] = useState(false);

  const loadSpritesheet = () => {
    const baseTexture = PIXI.BaseTexture.from(blowUpPng);
    const spritesheet = new PIXI.Spritesheet(baseTexture, blowUpJson);
    spritesheet.parse(() =>
      setBBlowingUp(
        Object.keys(spritesheet.textures).map((t) => spritesheet.textures[t])
      )
    );
  };

  if (willMount.current) {
    loadSpritesheet();
    willMount.current = false;
  }

  const getRandom = (min: number, max: number) =>
    Math.random() * (max - min) + min;

  const collisionDetection = useCallback(
    (rocketOrSpaceship: RocketType, enemy: RocketType, isRocket: boolean) => {
      const sizes = isRocket ? ROCKETSIZE : SPACESHIPSIZE;

      const enemyB = {
        posX: enemy.posX - ENEMYSIZE.width / 2,
        posY: enemy.posY - ENEMYSIZE.height / 2,
      };
      const nonEnemyBounds = {
        posX: rocketOrSpaceship.posX - sizes.width / 2,
        posY: rocketOrSpaceship.posY - sizes.height / 2,
      };

      return (
        nonEnemyBounds.posX + sizes.width >= enemyB.posX &&
        nonEnemyBounds.posX <= enemyB.posX + ENEMYSIZE.width &&
        nonEnemyBounds.posY + sizes.height >= enemyB.posY &&
        nonEnemyBounds.posY <= enemyB.posY + ENEMYSIZE.height
      );
    },
    []
  );

  const moveObject = (idx: number, isRocket: boolean, delta: number) => {
    const prevX =
      idx === 1
        ? isRocket
          ? rocket1PrevX
          : enemy1PrevX
        : idx === 2
        ? isRocket
          ? rocket2PrevX
          : enemy2PrevX
        : isRocket
        ? rocket3PrevX
        : enemy3PrevX;

    const prevVis =
      idx === 1
        ? isRocket
          ? rocket1PrevVis
          : enemy1PrevVis
        : idx === 2
        ? isRocket
          ? rocket2PrevVis
          : enemy2PrevVis
        : isRocket
        ? rocket3PrevVis
        : enemy3PrevVis;

    // out of space
    if (prevVis.current) {
      if (isRocket ? prevX.current > 800 : prevX.current < 0) {
        let newState = { posX: 0, posY: 0, visibility: false };
        switch (idx) {
          case 1:
            if (isRocket) {
              setRocket1((prevState) => {
                return { ...prevState, ...newState };
              });
            } else {
              setEnemy1((prevState) => {
                return { ...prevState, ...newState };
              });
            }
            break;
          case 2:
            if (isRocket) {
              setRocket2((prevState) => {
                return { ...prevState, ...newState };
              });
            } else {
              setEnemy2((prevState) => {
                return { ...prevState, ...newState };
              });
            }
            break;
          case 3:
            if (isRocket) {
              setRocket3((prevState) => {
                return { ...prevState, ...newState };
              });
            } else {
              setEnemy3((prevState) => {
                return { ...prevState, ...newState };
              });
            }
            break;
          default:
        }
        prevX.current = isRocket ? 0 : 750;
        prevVis.current = false;
      } else {
        const newX =
          prevX.current + (isRocket ? 7 + delta / 7 : -4 - delta / 4);
        switch (idx) {
          case 1:
            if (isRocket) {
              setRocket1((prevState) => {
                return { ...prevState, posX: newX };
              });
            } else {
              setEnemy1((prevState) => {
                return {
                  ...prevState,
                  posX: newX - (delta ? delta : 0),
                  posY:
                    prevState.path.A1 * Math.cos(prevState.path.p1 * newX) +
                    prevState.path.A2 * Math.cos(prevState.path.p2 * newX) +
                    prevState.startY,
                };
              });
            }
            break;
          case 2:
            if (isRocket) {
              setRocket2((prevState) => {
                return { ...prevState, posX: newX };
              });
            } else {
              setEnemy2((prevState) => {
                return {
                  ...prevState,
                  posX: newX - (delta ? delta : 0),
                  posY:
                    prevState.path.A1 *
                      Math.cos(prevState.path.p1 * newX + 1000) +
                    prevState.path.A2 * Math.cos(prevState.path.p2 * newX) +
                    prevState.startY,
                };
              });
            }
            break;
          case 3:
            if (isRocket) {
              setRocket3((prevState) => {
                return { ...prevState, posX: newX };
              });
            } else {
              setEnemy3((prevState) => {
                return {
                  ...prevState,
                  posX: newX,
                  posY:
                    prevState.path.A1 *
                      Math.cos(prevState.path.p1 * newX + 1000) +
                    prevState.path.A2 * Math.cos(prevState.path.p2 * newX) +
                    prevState.startY,
                };
              });
            }
            break;
          default:
        }
        prevX.current = newX;
      }
    }
  };

  const gameOverAnimationForSpaceship = useCallback((delta: number) => {
    spaceshipDies.current.rot += delta / 80;
    spaceshipDies.current.opacity -= 0.05;
    spaceshipDies.current.scale = {
      x: spaceshipDies.current.scale.x - 0.02,
      y: spaceshipDies.current.scale.y - 0.02,
    };
  }, []);

  const setHighScore = useCallback(async () => {
    let prevScores: number[] = await get("highScore");
    if (prevScores === undefined) {
      await set("highScore", [score]);
      return;
    }
    prevScores.push(scoreAsRef.current);
    prevScores = prevScores.sort((a, b) => b - a);
    if (prevScores.length > 10) {
      prevScores = prevScores.slice(0, 10)
    }
    await set("highScore", prevScores);
  }, [score]);

  const gameOver = useCallback(() => {
    setGameOver(true);
    let text = new PIXI.Text("GAME OVER", {
      fill: "red",
      fonstSize: 800,
      fontWeight: 900,
    });
    text.position.x = 400;
    text.position.y = 300;
    text.scale = new PIXI.Point(3, 3);
    text.anchor = new PIXI.Point(0.5, 0.5);
    app.stage.addChild(text);

    cancelAnimationFrame(requestRef.current);
    setTimeout(() => {
      props.setGameState(GameState.menuState);
      setHighScore();
    }, 1250);
  }, [props, app.stage, setHighScore]);

  const createEnemy = useCallback(() => {
    const maxAmplitude = (600 - ENEMYSIZE.height) / 2;
    const a = getRandom(50, maxAmplitude);
    const a2 = getRandom(0, maxAmplitude - a);
    const start = getRandom(
      ENEMYSIZE.height / 2 + a + a2,
      600 - a - a2 - ENEMYSIZE.height / 2
    );
    const path: EnemyPath = {
      A1: Math.max(a, a2),
      A2: Math.min(a, a2),
      p1: getRandom(0.003, 0.005),
      p2: getRandom(0.01, 0.02),
      translation: getRandom(0, 2 * Math.PI),
    };
    let newEnemy = {
      posX: 850,
      posY: start,
      startY: start,
      path: path,
      visibility: true,
    };
    if (!enemy1.visibility) {
      setEnemy1(newEnemy);
      enemy1PrevVis.current = true;
    } else if (!enemy2.visibility) {
      setEnemy2(newEnemy);
      enemy2PrevVis.current = true;
    } else if (!enemy3.visibility) {
      setEnemy3(newEnemy);
      enemy3PrevVis.current = true;
    }
  }, [enemy1, enemy2, enemy3]);

  const time = useRef(0);
  const start = useRef(0);

  const animate = useCallback(
    (timestamp) => {
      //ts is ms
      if (start.current === 0) {
        start.current = timestamp;
      }
      const delta = timestamp - start.current;
      start.current = timestamp;
      time.current = time.current + 1;
      const newX = prevX.current - 2 - delta / 8;
      const newBgX = newX / 4;
      const newMiddleX = newX / 2;
      const newFrontX = newX;
      setBgX(newBgX);
      setMiddleX(newMiddleX);
      setFrontx(newFrontX);
      prevX.current = newX;

      if (time.current % 60 === 0) {
        createEnemy();
      }

      // move rockets
      moveObject(1, true, delta);
      moveObject(2, true, delta);
      moveObject(3, true, delta);

      // move enemies
      moveObject(1, false, delta);
      moveObject(2, false, delta);
      moveObject(3, false, delta);

      if (
        collisionDetection(spaceshipPos, enemy1, false) ||
        collisionDetection(spaceshipPos, enemy2, false) ||
        collisionDetection(spaceshipPos, enemy3, false)
      ) {
        gameOver();
      }

      if (isGameOver) {
        gameOverAnimationForSpaceship(delta);
      }

      //check rockets & enemies
      for (let j = 0; j < 3; j++) {
        //rockets
        let rocket = j === 0 ? rocket1 : j === 1 ? rocket2 : rocket3;
        if (rocket.visibility) {
          //if rocket is on the playground
          for (let k = 0; k < 3; k++) {
            //enemies
            let enemy = k === 0 ? enemy1 : k === 1 ? enemy2 : enemy3;
            if (enemy.visibility) {
              // if enemy is on the playground
              if (collisionDetection(rocket, enemy, true)) {
                const setRocket =
                  j === 0 ? setRocket1 : j === 1 ? setRocket2 : setRocket3;
                const setEnemy =
                  k === 0 ? setEnemy1 : k === 1 ? setEnemy2 : setEnemy3;
                let enemyPrevVis =
                  k === 0
                    ? enemy1PrevVis
                    : k === 1
                    ? enemy2PrevVis
                    : enemy3PrevVis;
                let enemyPrevX =
                  k === 0 ? enemy1PrevX : k === 1 ? enemy2PrevX : enemy3PrevX;
                const blowPos = { x: enemy.posX, y: enemy.posY };

                scoreAsRef.current = scoreAsRef.current + 1;
                setScore(scoreAsRef.current);
                console.log(scoreAsRef.current);
                setRocket({
                  posX: -200,
                  posY: -200,
                  visibility: false,
                });
                setEnemy({
                  posX: -200,
                  posY: -200,
                  visibility: false,
                  path: { A1: 0, A2: 0, p1: 0, p2: 0, translation: 0 },
                  startY: 0,
                });
                const animateBlow = new PIXI.AnimatedSprite(blowingUp);
                animateBlow.position = new PIXI.Point(blowPos.x, blowPos.y);
                animateBlow.anchor = new PIXI.Point(0.5, 0.5);
                animateBlow.play();
                app.stage.addChild(animateBlow);
                enemyPrevVis.current = false;
                enemyPrevX.current = 750;
                setTimeout(() => {
                  app.stage.removeChild(animateBlow);
                }, 250);
              }
            }
          }
        }
      }

      requestRef.current = requestAnimationFrame(animate);
    },
    [
      requestRef,
      prevX,
      createEnemy,
      enemy1,
      enemy2,
      enemy3,
      spaceshipPos,
      app.stage,
      rocket1,
      rocket2,
      rocket3,
      collisionDetection,
      blowingUp,
      gameOver,
      gameOverAnimationForSpaceship,
      isGameOver,
    ]
  );

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(requestRef.current);
    };
  }, [animate, requestRef]);

  const addRocketWhenShoot = useCallback(
    (pos: { x: number; y: number }) => {
      let toUpdate: RocketType = { posX: pos.x, posY: pos.y, visibility: true };
      if (!rocket1.visibility) {
        setRocket1(toUpdate);
        rocket1PrevVis.current = true;
        rocket1PrevX.current = pos.x;
      } else if (!rocket2.visibility) {
        setRocket2(toUpdate);
        rocket2PrevVis.current = true;
        rocket2PrevX.current = pos.x;
      } else if (!rocket3.visibility) {
        setRocket3(toUpdate);
        rocket3PrevVis.current = true;
        rocket3PrevX.current = pos.x;
      }
    },
    [
      rocket2,
      rocket3,
      rocket1,
      rocket2PrevVis,
      rocket2PrevX,
      rocket3PrevVis,
      rocket3PrevX,
      rocket1PrevVis,
      rocket1PrevX,
    ]
  );

  return (
    <Container>
      <TilingSprite
        texture={PIXI.Texture.from(bg)}
        width={800}
        height={600}
        tilePosition={new PIXI.Point(BgX, 0)}
      />
      <TilingSprite
        texture={PIXI.Texture.from(middle)}
        width={800}
        height={471}
        y={70}
        tilePosition={new PIXI.Point(middleX, 0)}
      />
      <TilingSprite
        texture={PIXI.Texture.from(front)}
        width={1000}
        height={600}
        y={70}
        tilePosition={new PIXI.Point(frontX, 0)}
      />

      <Sprite
        texture={PIXI.Texture.from(rocket)}
        position={new PIXI.Point(rocket1.posX, rocket1.posY)}
        visible={rocket1.visibility}
        anchor={new PIXI.Point(0.5, 0.5)}
      ></Sprite>
      <Sprite
        texture={PIXI.Texture.from(rocket)}
        position={new PIXI.Point(rocket2.posX, rocket2.posY)}
        visible={rocket2.visibility}
        anchor={new PIXI.Point(0.5, 0.5)}
      ></Sprite>
      <Sprite
        texture={PIXI.Texture.from(rocket)}
        position={new PIXI.Point(rocket3.posX, rocket3.posY)}
        visible={rocket3.visibility}
        anchor={new PIXI.Point(0.5, 0.5)}
      ></Sprite>

      <Sprite
        texture={PIXI.Texture.from(enemy)}
        position={new PIXI.Point(enemy1.posX, enemy1.posY)}
        visible={enemy1.visibility}
        anchor={new PIXI.Point(0.5, 0.5)}
      ></Sprite>
      <Sprite
        texture={PIXI.Texture.from(enemy)}
        position={new PIXI.Point(enemy2.posX, enemy2.posY)}
        visible={enemy2.visibility}
        anchor={new PIXI.Point(0.5, 0.5)}
      ></Sprite>
      <Sprite
        texture={PIXI.Texture.from(enemy)}
        position={new PIXI.Point(enemy3.posX, enemy3.posY)}
        visible={enemy3.visibility}
        anchor={new PIXI.Point(0.5, 0.5)}
      ></Sprite>

      <Spaceship
        setRockets={addRocketWhenShoot}
        spaceshipPosition={setSaceshipPos}
        state={spaceshipDies.current}
      />

      <Text
        x={775}
        y={575}
        anchor={new PIXI.Point(0.5, 0.5)}
        scale={new PIXI.Point(2, 2)}
        text={score.toString()}
        style={scoreStyle}
      />
    </Container>
  );
}
