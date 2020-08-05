import React, { useState } from 'react';
import * as PIXI from 'pixi.js';
import { Sprite } from 'react-pixi-fiber';
import rocketImg from '../images/bullet.png';

interface RocketProps {
    initialPosition: any,
    visibilty: boolean,
}

export function Rocket(props: RocketProps) {
    const [position, setPosition] = useState(props.initialPosition);

    // const prevValue = 

    return (
       <Sprite texture={PIXI.Texture.from(rocketImg)} position={position} visible={props.visibilty}></Sprite>
    );

}