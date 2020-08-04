import React from 'react';
import * as PIXI from 'pixi.js';
import { Sprite, Text } from 'react-pixi-fiber';
import button from './images/imageButton.png';

interface ButtonPorps {
    position: any;
    text: string;
}

export function CustomButton(props: ButtonPorps) {

    return (
        <Sprite 
            texture={PIXI.Texture.from(button)}
            buttonMode={true} 
            interactive={true} 
            position={props.position} 
            anchor={new PIXI.Point(0.5, 0.5)}>
            <Text 
            text={props.text}
            anchor={new PIXI.Point(0.5, 0.5)}>
                
            </Text>
        </Sprite>
    )
}