import React from 'react';
import * as PIXI from 'pixi.js';
import { Sprite, Text } from 'react-pixi-fiber';
import button from './images/imageButton.png';

interface ButtonPorps {
    position: any;
    text: string;
    onClick?: () => void;
    isHighScore?: boolean;
    menu?: boolean;
}

export function CustomButton(props: ButtonPorps) {
    const buttonStyle = new PIXI.TextStyle()
    buttonStyle.fontSize = 20;

    return (
        <Sprite 
            texture={PIXI.Texture.from(button)}
            width={props.menu ? 100 : undefined}
            height={props.menu ? 50 : undefined}
            buttonMode={true} 
            interactive={true} 
            position={props.position} 
            anchor={new PIXI.Point(0.5, 0.5)}
            pointerdown={props.onClick}
            pointerup={props.onClick}
            mousedown={props.onClick}>
            <Text 
            text={props.text}
            anchor={new PIXI.Point(0.5, 0.5)}
            style={props.isHighScore ? buttonStyle : null}
            >

            </Text>
        </Sprite>
    )
}