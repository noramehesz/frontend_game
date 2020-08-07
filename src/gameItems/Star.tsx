import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as PIXI from 'pixi.js';
import { Sprite } from 'react-pixi-fiber';
import star from "../images/star.png";

interface StartProps {
    props: any,
    idx: number,
}

export function Star(props: StartProps) {
    const [alpha, setAlpha] = useState(Math.random());
    const requestRef = useRef(0);

    const animate = useCallback(() => {
        if (requestRef.current !== undefined){
            const time = Date.now() / 1000;
            const freq = props.idx / 1000;
            const ampl = props.idx * 1000;
            const alpha = freq * Math.sin(time + ampl);
            setAlpha(alpha * 2);
            requestRef.current = requestAnimationFrame(animate);
        }
    }, [props.idx]);

    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => {
            cancelAnimationFrame(requestRef.current);
        }
    }, [animate])

    return (
        <Sprite texture={PIXI.Texture.from(star)} {...props.props} alpha={alpha}></Sprite>
    )
}