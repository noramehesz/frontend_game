import React, { useState } from 'react';
import * as PIXI from 'pixi.js';
import { Sprite } from 'react-pixi-fiber';
import rocketImg from '../images/bullet.png';

interface RocketProps {
    initialPosition: {x: number, y: number},
    visibilty: boolean,
}

export function Rocket(props: RocketProps) {
    const [position, setPosition] = useState(props.initialPosition);

    // const prevValue = 

    return (
       <Sprite 
       texture={PIXI.Texture.from(rocketImg)} 
       position={new PIXI.Point(position.x, position.y)} 
       visible={true}
       zIndex={5}
       interactive={true}
       scale={0.7}>
           
       </Sprite>
    );

}