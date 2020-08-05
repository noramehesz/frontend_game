import React, { useEffect, useState } from 'react';
import * as PIXI from 'pixi.js';
import { usePixiApp } from 'react-pixi-fiber';
import { Star } from './gameItems/Star';

interface BgProps {
    app?: PIXI.Application
}

export function Background(props: BgProps) {
    const app = usePixiApp();
    const [starsArray, setStarsArray] = useState([{props:{}, alpha: 1}]);

    useEffect(() => {
        let state: Array<{props: any, alpha: number}> = new Array<{props: {}, alpha: number}>();
        for (let i = 0 ; i < 200; i++) {
            state.push({props: getStarProps(i), alpha: Math.random()});
        }
        setStarsArray(state);
    }, []);

    const getStarProps = (idx: number) => {
        let scale = Math.random() * 2;
        const starProps = {
            scale: new PIXI.Point(scale, scale),
            position: new PIXI.Point(Math.random() * app.renderer.width, Math.random() * app.renderer.height),
            zIndex: 3,
        };
        return starProps;
    }

    return (
        <>{starsArray.map((element: any, index: number) => 
           <Star props={element.props} idx={index}></Star>
        )}</>
    );
}
