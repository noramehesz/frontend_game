import React, { useEffect, useState } from "react";
import { Container, Text } from "react-pixi-fiber";
import * as PIXI from "pixi.js";
import { CustomButton } from "./Button";
import { get } from "idb-keyval";

interface HighScoresProps {
  backToMenuOnClick: () => void;
}

export default function HighScores(props: HighScoresProps) {
  const [scores, setScores] = useState<number[]>([]);
  const titleStyle = new PIXI.TextStyle();
  titleStyle.fill = "#FFFFFF";
  titleStyle.dropShadowColor = "grey";

  const listStyle = new PIXI.TextStyle();
  listStyle.fill = "#FFFFFF";

  useEffect(() => {
    async function getScores() {
      const scoresFromDb: number[] = await get("highScore");
      console.log(scoresFromDb)
      if (scoresFromDb !== undefined) {
        setScores(scoresFromDb);
      }
    }
    getScores();
  }, []);

  return (
    <Container>
      <Text
        text="HIGH SCORES"
        x={400}
        y={75}
        anchor={new PIXI.Point(0.5, 0.5)}
        scale={new PIXI.Point(2, 2)}
        style={titleStyle}
      />
      {scores.map((sc, idx) => {
        return (
          <Text
            text={`${idx + 1}. ${sc}`}
            position={new PIXI.Point(400, 120 + idx * 40)}
            anchor={new PIXI.Point(0.5, 0.5)}
            style={listStyle}
          />
        );
      })}
      <CustomButton
        position={new PIXI.Point(100, 550)}
        text="MENU"
        menu
        onClick={props.backToMenuOnClick}
      />
    </Container>
  );
}
