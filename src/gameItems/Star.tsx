import React, { useState, useCallback } from "react";
import * as PIXI from "pixi.js";
import { Sprite } from "react-pixi-fiber";
import star from "../images/star.png";
import { useAnimation } from "../context";

interface StartProps {
  props: any;
  idx: number;
}

export function Star(props: StartProps) {
  const [alpha, setAlpha] = useState(Math.random());

  const animate = useCallback(() => {
    const time = Date.now() / 1000;
    const freq = props.idx / 1000;
    const ampl = props.idx * 1000;
    const alpha = freq * Math.sin(time + ampl);
    setAlpha(alpha * 3);
  }, [props.idx]);

  useAnimation(animate);

  return (
    <Sprite
      texture={PIXI.Texture.from(star)}
      {...props.props}
      alpha={alpha}
    ></Sprite>
  );
}
