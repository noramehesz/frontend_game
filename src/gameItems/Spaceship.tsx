import React, { useEffect, useState } from 'react';
import * as PIXI from 'pixi.js';
import { Sprite } from 'react-pixi-fiber';
import spaceship from '../images/spaceship.png'

interface SpaceshipProps{
    position: any,
}

export function Spaceship(props: SpaceshipProps) {
    const [mousePosition, setMousePosition] = useState({x: 100, y: 300});

    const handleMouse = (event: any) => {
        event.stopPropagation();
        event.preventDefault();
        let posX = event.clientX < 0 ? 0 : event.clientX > 800 ? 800 : event.clientX;
        let posY = event.clientY < 0 ? 0 : event.clientY > 600 ? 600 : event.clientY;

        setMousePosition({
            x: posX,
            y: posY
        })
    }

    useEffect(() => {
        document.addEventListener("mousemove", handleMouse);
    }, [])
    

    return (
        <Sprite
            texture={PIXI.Texture.from(spaceship)}
            position={new PIXI.Point(mousePosition.x, mousePosition.y)}
            anchor={new PIXI.Point(0.5, 0.5)} 
        >

        </Sprite>
    )
}