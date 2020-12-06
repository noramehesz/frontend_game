import React, { useEffect, useState, useCallback } from "react";
import * as PIXI from "pixi.js";
import { Sprite } from "react-pixi-fiber";
import spaceship from "../images/spaceship.png";

interface SpaceshipProps {
  setRockets: any;
  spaceshipPosition: any;
  state: { rot: number; scale: { x: number; y: number }; opacity: number };
}

export function Spaceship(props: SpaceshipProps) {
  const [mousePosition, setMousePosition] = useState({ x: 100, y: 300 });

  const handleMouse = useCallback(
    (event: MouseEvent) => {
      event.stopPropagation();
      event.preventDefault();
      let posX =
        event.clientX < 0 ? 0 : event.clientX > 800 ? 800 : event.clientX;
      let posY =
        event.clientY < 0 ? 0 : event.clientY > 600 ? 600 : event.clientY;

      setMousePosition({
        x: posX,
        y: posY,
      });
      props.spaceshipPosition({
        visibility: true,
        posX: posX,
        posY: posY,
      });
    },
    [props]
  );

  const shoot = useCallback(
    (event: MouseEvent) => {
      event.stopPropagation();
      event.preventDefault();
      props.setRockets({ x: event.clientX, y: event.clientY });
    },
    [props]
  );

  useEffect(() => {
    document.addEventListener("mousemove", handleMouse);
    document.addEventListener("click", shoot);
    return () => {
      document.removeEventListener("mousemove", handleMouse);
      document.removeEventListener("click", shoot);
    };
  }, [handleMouse, shoot]);

  return (
    <Sprite
      texture={PIXI.Texture.from(spaceship)}
      position={new PIXI.Point(mousePosition.x, mousePosition.y)}
      anchor={new PIXI.Point(0.5, 0.5)}
      rotation={props.state.rot}
      scale={new PIXI.Point(props.state.scale.x, props.state.scale.y)}
      alpha={props.state.opacity}
    ></Sprite>
  );
}
