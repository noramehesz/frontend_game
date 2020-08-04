import React, { useEffect, useRef, useState } from 'react';
import * as PIXI from 'pixi.js';
import { usePixiApp, Sprite } from 'react-pixi-fiber';
import PropTypes from 'prop-types';
import star from "./images/star.png";

interface BgProps {
    app?: PIXI.Application
}

export function Background(props: BgProps) {
    const app = usePixiApp();
    const [starsArray, setStarsArray] = useState([{props:{}, alpha: 1}]);

    const prevStar = useRef(Array<{props: any, alpha: number}>());
    const reqRef = useRef(0);

    useEffect(() => {
        let state: Array<{props: any, alpha: number}> = new Array<{props: {}, alpha: number}>();
        for (let i = 0 ; i < 100; i++) {
            state.push({props: getStarProps(i), alpha: Math.random()});
        }
        setStarsArray(state);
        prevStar.current = state;
    }, []);


    const getAplha = (idx: number) => {
        const time = Date.now() / 1000;
        const freq = idx / 100;
        const ampl = idx * 100;
        const alpha = freq * Math.sin(time + ampl);
        return alpha;
    }

    const getStarProps = (idx: number) => {
        let scale = Math.random() * 2;
        const starProps = {
            scale: new PIXI.Point(scale, scale),
            position: new PIXI.Point(Math.random() * app.renderer.width, Math.random() * app.renderer.height),
            zIndex: 3,
        };
        return starProps;
    }

    const animation = () => {
        if (reqRef.current !== undefined) {
            let data: Array<{props: any, alpha: number}> = prevStar.current;
            for (let i = 0; i < data.length; i++) {
                if (data[i].alpha < 0) {
                    data[i].alpha = 1;
                } else {
                    data[i].alpha = data[i].alpha - 0.01;
                }
            }
            setStarsArray(data);
            prevStar.current = data;
            reqRef.current = requestAnimationFrame(animation);
        }
    }

    useEffect(() => {
        reqRef.current = requestAnimationFrame(animation);
        return () => {
            cancelAnimationFrame(reqRef.current);
        }
    }, [])

    return (
        <>{starsArray.map((element, index) => 
            <Sprite texture={PIXI.Texture.from(star)} {...element.props} alpha={element.alpha}></Sprite>
        )}</>
    );
}

Background.contextTypes = {
    app: PropTypes.object,
}
