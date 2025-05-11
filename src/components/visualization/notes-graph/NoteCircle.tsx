"use client";

import { DiaryNote } from "@/services/types/notes";
import Konva from "konva";
import React, { forwardRef } from "react";
import { Circle, Group, Text } from "react-konva";

export type NoteCircleProps = {
  note: DiaryNote;
  active?: boolean;
  onSelected?: (note: DiaryNote) => void;
};
export type NoteCirlceApi = Konva.Group & {
  vx: number;
  vy: number;
  radius: number;
  note: DiaryNote;
};

export const NoteCircle = forwardRef<NoteCirlceApi, NoteCircleProps>(
  ({ note, active, onSelected }: NoteCircleProps, ref) => {
    const groupRef = React.useRef<NoteCirlceApi>(null);

    React.useImperativeHandle(ref, () => {
      return groupRef.current!;
    }, []);

    React.useLayoutEffect(() => {
      if (groupRef.current) {
        groupRef.current.vx = Math.random() * 2 - 1;
        groupRef.current.vy = Math.random() * 2 - 1;
        groupRef.current.radius = 1;
        groupRef.current.note = note;
      }
    }, [note.id]);

    React.useEffect(() => {
      if (groupRef.current) {
        groupRef.current.note = note;
      }
    }, [note]);

    const [isHovered, setIsHovered] = React.useState(false);
    const [isPressed, setIsPressed] = React.useState(false);

    const onEnter = React.useCallback(
      (e: Konva.KonvaEventObject<PointerEvent>) => {
        const stage = e.target.getStage();
        if (stage) stage.container().style.cursor = "pointer";
        setIsHovered(true);
      },
      [],
    );
    const onLeave = React.useCallback(
      (e: Konva.KonvaEventObject<PointerEvent>) => {
        const stage = e.target.getStage();
        if (stage) stage.container().style.cursor = "default";
        setIsHovered(false);
      },
      [],
    );

    const onDown = React.useCallback(
      (e: Konva.KonvaEventObject<PointerEvent>) => {
        setIsPressed(true);
      },
      [],
    );
    React.useEffect(() => {
      function onMouseUp() {
        if (isPressed) {
          setIsPressed(false);
        }
      }
      window.addEventListener("mouseup", onMouseUp);

      return () => {
        window.removeEventListener("mouseup", onMouseUp);
      };
    });

    const onClick = React.useCallback(
      (e: Konva.KonvaEventObject<PointerEvent>) => {
        if (onSelected) onSelected(note);
      },
      [note, onSelected],
    );

    const radius = 25 + (isPressed ? -3 : 0);
    if (groupRef.current) groupRef.current.radius = radius;

    return (
      <Group ref={groupRef} draggable x={0} y={0}>
        <Text
          x={-50}
          y={-530}
          width={100}
          height={500}
          align="center"
          verticalAlign="bottom"
          text={note.name}
          fill={"white"}
          hitFunc={() => false}
        />
        <Circle
          x={0}
          y={0}
          radius={radius}
          fill={active ? "#ffac59" : isHovered ? "#989898" : "#6f6f6f"}
          onPointerEnter={onEnter}
          onPointerLeave={onLeave}
          onPointerDown={onDown}
          onPointerClick={onClick}
        />
      </Group>
    );
  },
);
