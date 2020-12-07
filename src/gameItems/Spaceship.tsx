import React, { useEffect, useState, useCallback } from "react";
import * as PIXI from "pixi.js";
import { Sprite, usePixiApp } from "react-pixi-fiber";
import spaceship from "../images/spaceship.png";

interface SpaceshipProps {
  setRockets: any;
  spaceshipPosition: any;
  state: { rot: number; scale: { x: number; y: number }; opacity: number };
}

export function Spaceship(props: SpaceshipProps) {
  const {view} = usePixiApp();
  const [mousePosition, setMousePosition] = useState({ x: 100, y: 300 });

  const handleMouse = useCallback(
    (event: MouseEvent) => {
      event.stopPropagation();
      event.preventDefault();
      let posX =
        event.offsetX < 0 ? 0 : event.offsetX > 800 ? 800 : event.offsetX;
      let posY =
        event.offsetY < 0 ? 0 : event.offsetY > 600 ? 600 : event.offsetY;

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
      props.setRockets({ x: event.offsetX, y: event.offsetY });
    },
    [props]
  );

  useEffect(() => {
    view.addEventListener("mousemove", handleMouse);
    view.addEventListener("click", shoot);
    return () => {
      view.removeEventListener("mousemove", handleMouse);
      view.removeEventListener("click", shoot);
    };
  }, [handleMouse, shoot, view]);

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
