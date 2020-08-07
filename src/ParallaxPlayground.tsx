import React, { useEffect, useState, useRef, useCallback } from 'react';
import * as PIXI from 'pixi.js';
import { Container, TilingSprite, Sprite, usePixiApp } from 'react-pixi-fiber';
import bg from './images/parallax_background/background.png';
import middle from './images/parallax_background/smallPlanets.png';
import front from './images/parallax_background/planet.png';
import rocket from './images/bullet.png';
import { Spaceship } from './gameItems/Spaceship';
import { RocketType, GameState } from './App';
import enemy from './images/enemy.png';

const ROCKETSIZE = {
    width: 53,
    height: 19,
  }
  
  const ENEMYSIZE = {
    width:  60,
    height: 76,
  }
  
  const SPACESHIPSIZE = {
    width: 67,
    height: 35,
  }


interface ParallaxProps {
    setGameState: any,
}

const INITROCKETS: Array<RocketType> = [
    {posX: 0, posY: 0, visibility: false},
    {posX: 0, posY: 0, visibility: false},
    {posX: 0, posY: 0, visibility: false},
  ];

export function Parallax(props: ParallaxProps) {
    const app = usePixiApp();
    const [BgX, setBgX] = useState(0);
    const [middleX, setMiddleX] = useState(0);
    const [frontX, setFrontx] = useState(0);

    const [spaceshipPos, setSaceshipPos] = useState({posX: 100, posY: 300, visibility: true});

    const [rocket1, setRocket1] = useState(INITROCKETS[0]);
    const [rocket2, setRocket2] = useState(INITROCKETS[1]);
    const [rocket3, setRocket3] = useState(INITROCKETS[2]);

    const [enemy1, setEnemy1] = useState({posX: 0, posY: 0, visibility: false} as RocketType);
    const [enemy2, setEnemy2] = useState({posX: 0, posY: 0, visibility: false} as RocketType);
    const [enemy3, setEnemy3] = useState({posX: 0, posY: 0, visibility: false} as RocketType);

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

    const doOverlap = (
        topLeft1: [number, number], 
        bottomRight1: [number, number], 
        topLeft2: [number, number], 
        bottomRight2: [number, number]
        ) => {
            if (topLeft1[0] > bottomRight2[0] || topLeft2[0] > bottomRight1[0]) {
                return false;
            }
            if (topLeft1[1] > bottomRight2[1] || topLeft2[1] > bottomRight1[1]) {
                return false;
            }
            return true;
        }

    const collisionDetection = useCallback((rocketOrSpaceship: RocketType, enemy: RocketType, isRocket: boolean) => {
        const bounds = {
            minX: rocketOrSpaceship.posX - (isRocket ? ROCKETSIZE.width/2 : SPACESHIPSIZE.width/2),
            maxX: rocketOrSpaceship.posX + (isRocket ? ROCKETSIZE.width/2 : SPACESHIPSIZE.width/2),
            minY: rocketOrSpaceship.posY - (isRocket ? ROCKETSIZE.height/2 : SPACESHIPSIZE.height/2),
            maxY: rocketOrSpaceship.posX + (isRocket ? ROCKETSIZE.height/2 : SPACESHIPSIZE.height/2),
        }

        const enemyBounds = {
            minX: enemy.posX - ENEMYSIZE.width / 2,
            maxX: enemy.posX + ENEMYSIZE.width / 2,
            minY: enemy.posY - ENEMYSIZE.height / 2,
            maxY: enemy.posY + ENEMYSIZE.height / 2,
        }

        return doOverlap(
            [bounds.minX, bounds.minY], 
            [bounds.maxX, bounds.maxY], 
            [enemyBounds.minX, enemyBounds.minY], 
            [enemyBounds.maxX, enemyBounds.maxY]
        );
    }, []);

    const moveObject = (idx: number, isRocket: boolean) => {
        const prevX = idx === 1 ? (isRocket? rocket1PrevX: enemy1PrevX) 
        : idx === 2 ? (isRocket ? rocket2PrevX : enemy2PrevX) : (isRocket ? rocket3PrevX : enemy3PrevX);

        const prevVis = idx === 1 ? (isRocket ? rocket1PrevVis : enemy1PrevVis) 
        : idx === 2 ? (isRocket ? rocket2PrevVis : enemy2PrevVis) : (isRocket ? rocket3PrevVis : enemy3PrevVis);
 
        if (prevVis.current) {
            if (isRocket ? prevX.current > 800 : prevX.current < 0) {
                let newState = {posX: 0, posY: 0, visibility: false};
                switch(idx) {
                    case 1:
                        if (isRocket) {
                            setRocket1(prevState => {return {...prevState, ...newState}});
                        } else {
                            setEnemy1(prevState => {return {...prevState, ...newState}})
                        }
                        break;
                    case 2:
                        if (isRocket){
                            setRocket2(prevState => {return {...prevState, ...newState}});
                        } else {
                            setEnemy2(prevState => {return {...prevState, ...newState}})
                        }
                        break;
                    case 3:
                        if (isRocket){
                            setRocket3(prevState => {return {...prevState, ...newState}});
                        } else {
                            setEnemy3(prevState => {return {...prevState, ...newState}})
                        }
                        break;
                    default:
                }
                prevX.current = isRocket ? 0 : 750;
                prevVis.current = false;
            } else {
                const newX = prevX.current  + (isRocket ? 7 : -4);
                switch(idx) {
                    case 1:
                        if (isRocket) {
                            setRocket1(prevState => { return {...prevState, posX: newX}});
                        } else {
                            setEnemy1(prevState => { return {...prevState, posX: newX}});
                        }
                        break;
                    case 2:
                        if (isRocket) {
                            setRocket2(prevState => { return {...prevState, posX: newX}});
                        } else {
                            setEnemy2(prevState => { return {...prevState, posX: newX}})
                        }
                        break;
                    case 3:
                        if (isRocket) {
                            setRocket3(prevState => { return {...prevState, posX: newX}});
                        } else {
                            setEnemy3(prevState => { return {...prevState, posX: newX}})
                        }
                        break;
                    default:
                }
                prevX.current = newX;
            }
        }
    }

    const createEnemy = useCallback(() => {
        let newEnemy: RocketType = {posX: 750, posY: Math.floor(Math.random() * (561)), visibility: true}
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

    const animate = useCallback(() => {
        time.current = time.current + 1
        const newX = prevX.current - 2
        const newBgX = newX / 4;
        const newMiddleX = newX / 2;
        const newFrontX = newX;
        setBgX(newBgX);
        setMiddleX(newMiddleX);
        setFrontx(newFrontX);
        prevX.current = newX;

        if(time.current % 120 === 0){
            createEnemy();
        }

        // move rockets
        moveObject(1, true);
        moveObject(2, true);
        moveObject(3, true);

        // move enemies
        moveObject(1, false);
        moveObject(2, false);
        moveObject(3, false);

        //check spaceship colision
        for (let i = 0; i < 3; i++){
            let enemy = i === 0 ? enemy1 : i === 1 ? enemy2 : enemy3;
            if(enemy.visibility && collisionDetection(spaceshipPos, enemy, false) === true) {
                let text = new PIXI.Text("GAME OVER", {fill: 'red', fonstSize: 800, fontWeight: 900});
                text.position.x = 400;
                text.position.y = 300;
                text.scale = new PIXI.Point(3, 3);
                text.anchor = new PIXI.Point(0.5, 0.5);
                app.stage.addChild(text);
                cancelAnimationFrame(requestRef.current);
                setTimeout(() => {
                    props.setGameState(GameState.menuState);
                }, 500);
            }
        }

        //check rockets & enemies
        for (let j = 0; j < 3; j++) { //rockets 
            let rocket = j === 0 ? rocket1 : j === 1 ? rocket2 : rocket3;
            if (rocket.visibility) { //if rocket is on the playground
                for (let k = 0; k < 3; k++) { //enemies
                    let enemy = k === 0 ? enemy1 : k === 1 ? enemy2 : enemy3;
                    if (enemy.visibility) { // if enemy is on the playground
                        if (collisionDetection(rocket, enemy, true)){
                            const setRocket = j === 0 ? setRocket1 : j === 1 ? setRocket2 : setRocket3;
                            const setEnemy = k === 0 ? setEnemy1 : k === 1 ? setEnemy2 : setEnemy3;
                            let enemyPrevVis =  k === 0 ? enemy1PrevVis : k === 1 ? enemy2PrevVis : enemy3PrevVis;
                            let enemyPrevX =  k === 0 ? enemy1PrevX : k === 1 ? enemy2PrevX : enemy3PrevX;

                            setRocket({
                                posX: 0,
                                posY: 0,
                                visibility: false,
                            });
                            setEnemy({
                                posX: 0,
                                posY: 0,
                                visibility: false,
                            });
                            enemyPrevVis.current = false;
                            enemyPrevX.current = 750;
                        }
                    }
                }
            }
        }

        requestRef.current = requestAnimationFrame(animate);
    }, [requestRef, prevX, createEnemy, props, enemy1, enemy2, enemy3, spaceshipPos, app.stage, rocket1, rocket2, rocket3, collisionDetection]);

    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => {
            cancelAnimationFrame(requestRef.current);
        }
    }, [animate, requestRef]); 

    const addRocketWhenShoot = useCallback((pos: {x: number, y: number}) => {
        let toUpdate: RocketType = {posX: pos.x, posY: pos.y, visibility: true};
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
    }, [rocket2, rocket3, rocket1, rocket2PrevVis, rocket2PrevX, rocket3PrevVis, rocket3PrevX, rocket1PrevVis, rocket1PrevX]);


    return (
        <Container>
            <TilingSprite texture={PIXI.Texture.from(bg)} width={800} height={600} tilePosition={new PIXI.Point(BgX, 0)}/>
            <TilingSprite texture={PIXI.Texture.from(middle)} width={800} height={471} y={70} tilePosition={new PIXI.Point(middleX, 0)}/>
            <TilingSprite texture={PIXI.Texture.from(front)} width={1000} height={600} y={70} tilePosition={new PIXI.Point(frontX, 0)}/>

            <Sprite 
                texture={PIXI.Texture.from(rocket)} 
                position={new PIXI.Point(rocket1.posX, rocket1.posY)} 
                visible={rocket1.visibility}
                anchor={new PIXI.Point(0.5, 0.5)}></Sprite>
            <Sprite 
                texture={PIXI.Texture.from(rocket)} 
                position={new PIXI.Point(rocket2.posX, rocket2.posY)} 
                visible={rocket2.visibility} 
                anchor={new PIXI.Point(0.5, 0.5)}></Sprite>
            <Sprite 
                texture={PIXI.Texture.from(rocket)} 
                position={new PIXI.Point(rocket3.posX, rocket3.posY)} 
                visible={rocket3.visibility}
                anchor={new PIXI.Point(0.5, 0.5)}></Sprite>

            <Sprite 
                texture={PIXI.Texture.from(enemy)} 
                position={new PIXI.Point(enemy1.posX, enemy1.posY)} 
                visible={enemy1.visibility}
                anchor={new PIXI.Point(0.5, 0.5)}></Sprite>
            <Sprite 
                texture={PIXI.Texture.from(enemy)} 
                position={new PIXI.Point(enemy2.posX, enemy2.posY)} 
                visible={enemy2.visibility} 
                anchor={new PIXI.Point(0.5, 0.5)}></Sprite>
            <Sprite 
                texture={PIXI.Texture.from(enemy)} 
                position={new PIXI.Point(enemy3.posX, enemy3.posY)} 
                visible={enemy3.visibility}
                anchor={new PIXI.Point(0.5, 0.5)}></Sprite>
            
            <Spaceship setRockets={addRocketWhenShoot} spaceshipPosition={setSaceshipPos}/>
        </Container>
    )
}