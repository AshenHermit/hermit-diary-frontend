"use client";

import { DiaryNote } from "@/services/types/notes";
import Konva from "konva";
import React from "react";
import { Circle, Group, Layer, Stage } from "react-konva";

export type NotesGraphProps = {
  notes: DiaryNote[];
};

export function NotesGraph({ notes }: NotesGraphProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const stageRef = React.useRef<Konva.Stage>(null);

  React.useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver(() => {
      if (!containerRef.current) return;
      if (!stageRef.current) return;
      stageRef.current.width(containerRef.current.clientWidth);
      stageRef.current.height(containerRef.current.clientHeight);
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect(); // clean up
  }, []);

  return (
    <div className="absolute left-0 top-0 h-full w-full" ref={containerRef}>
      <Stage ref={stageRef} width={500} height={500}>
        <Layer>
          {notes.map((note) => (
            <NoteCircle key={note.id} note={note} />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}

function NoteCircle({ note }: { note: DiaryNote }) {
  const groupRef = React.useRef<Konva.Group>(null);

  React.useEffect(() => {
    const animate = () => {
      if (groupRef.current) {
        groupRef.current.x(groupRef.current.x() + 1);
      }
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, []);

  return (
    <Group ref={groupRef} draggable x={200} y={200}>
      <Circle x={0} y={0} radius={50} fill="white" />
    </Group>
  );
}
