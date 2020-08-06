import React, { useEffect, useState, useRef, useCallback } from 'react';
import * as PIXI from 'pixi.js';
import { Container, TilingSprite, Sprite } from 'react-pixi-fiber';
import bg from './images/parallax_background/background.png';
import middle from './images/parallax_background/smallPlanets.png';
import front from './images/parallax_background/planet.png';
import rocket from './images/bullet.png';
import { Spaceship } from './gameItems/Spaceship';


interface ParallaxProps {
    addRocketWhenShoot: (pos: {x: number, y: number}) => void;
    rocket1: any;
    rocket2: any;
    rocket3: any;
    setRocket1: any;
}

const INITROCKETS = [
    {posX: 0, posY: 0, visibility: false},
    {posX: 0, posY: 0, visibility: false},
    {posX: 0, posY: 0, visibility: false},
  ];

export function Parallax() {
    const [BgX, setBgX] = useState(0);
    const [middleX, setMiddleX] = useState(0);
    const [frontX, setFrontx] = useState(0);

    const [rocket1, setRocket1] = useState(INITROCKETS[0]);
    const [rocket2, setRocket2] = useState(INITROCKETS[1]);
    const [rocket3, setRocket3] = useState(INITROCKETS[2]);

    const requestRef = useRef(0);
    const prevX = useRef(0);

    const rocket1PrevX = useRef(0);
    const rocket1PrevVis = useRef(false);
    const rocket2PrevX = useRef(0);
    const rocket2PrevVis = useRef(false);
    const rocket3PrevX = useRef(0);
    const rocket3PrevVis = useRef(false);

    const moveRocket = (idxOfRocket: number) => {
        const prevX = idxOfRocket === 1 ? rocket1PrevX : idxOfRocket === 2 ? rocket2PrevX : rocket3PrevX;
        const prevVis = idxOfRocket === 1 ? rocket1PrevVis : idxOfRocket === 2 ? rocket2PrevVis : rocket3PrevVis;
 
        if (prevVis.current) {
            if (prevX.current > 800) {
                const newState = ({
                    posX: 0,
                    posY: 0,
                    visibility: false,
                });
                switch(idxOfRocket) {
                    case 1:
                        setRocket1(newState);
                        break;
                    case 2:
                        setRocket2(newState);
                        break;
                    case 3:
                        setRocket3(newState);
                        break;
                    default:
                }
                prevX.current = 0;
                prevVis.current = false;
            } else {
                const newX = prevX.current  + 3;
                switch(idxOfRocket) {
                    case 1:
                        setRocket1({...rocket1, posX: newX});
                        break;
                    case 2:
                        setRocket2({...rocket2, posX: newX});
                        break;
                    case 3:
                        setRocket3({...rocket3, posX: newX});
                        break;
                    default:
                }
                prevX.current = newX;
            }
        }
    }

    const animate = () => {
        const newX = prevX.current - 2
        const newBgX = newX / 4;
        const newMiddleX = newX / 2;
        const newFrontX = newX;
        setBgX(newBgX);
        setMiddleX(newMiddleX);
        setFrontx(newFrontX);
        prevX.current = newX;
       

        moveRocket(1);
        moveRocket(2);
        moveRocket(3);

        requestAnimationFrame(animate);
    }

    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => {
            cancelAnimationFrame(requestRef.current);
        }
    }, []); 

    const addRocketWhenShoot = (pos: {x: number, y: number}) => {
        let toUpdate;
        if (!rocket1.visibility) {
          toUpdate = rocket1;
          toUpdate.posX = pos.x;
          toUpdate.posY = pos.y;
          toUpdate.visibility = true;
          setRocket1(toUpdate);
          rocket1PrevVis.current = true;
          rocket1PrevX.current = pos.x;
          return;
        } else if (!rocket2.visibility) {
          toUpdate = rocket2;
          toUpdate.posX = pos.x;
          toUpdate.posY = pos.y;
          toUpdate.visibility = true;
          setRocket2(toUpdate);
          rocket2PrevVis.current = true;
          rocket2PrevX.current = pos.x;
          return;
        } else if (!rocket3.visibility) {
          toUpdate = rocket3;
          toUpdate.posX = pos.x;
          toUpdate.posY = pos.y;
          toUpdate.visibility = true;
          setRocket3(toUpdate);
          rocket3PrevVis.current = true;
          rocket3PrevX.current = pos.x;
          return;
        }
    }

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

            <Spaceship setRockets={addRocketWhenShoot}/>
        </Container>
    )
}