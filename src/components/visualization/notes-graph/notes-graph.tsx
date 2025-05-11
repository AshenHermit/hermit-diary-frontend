"use client";

import { NoteCircle } from "@/components/visualization/notes-graph/NoteCircle";
import { NotesGraphWorld } from "@/components/visualization/notes-graph/NotesGraphWorld";
import { DiaryNote } from "@/services/types/notes";
import Konva from "konva";
import React, { forwardRef } from "react";
import { Circle, Group, Layer, Stage, Text } from "react-konva";

export type NotesGraphProps = {
  notes: DiaryNote[];
  onNoteSelected: (note: DiaryNote) => void;
  activeNoteId?: number | null;
};

export function NotesGraph({
  notes,
  onNoteSelected,
  activeNoteId,
}: NotesGraphProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const stageRef = React.useRef<Konva.Stage>(null);

  const stageTransformTarget = React.useRef({ x: 0, y: 0, scale: 1 });

  React.useEffect(() => {
    if (!stageRef.current) return;
    stageTransformTarget.current.x = stageRef.current.width() / 2;
    stageTransformTarget.current.y = stageRef.current.height() / 2;
  }, []);

  React.useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver(() => {
      if (!containerRef.current) return;
      if (!stageRef.current) return;
      if (stageTransformTarget.current) {
        stageTransformTarget.current.x +=
          (containerRef.current.clientWidth - stageRef.current.width()) / 2;
        stageTransformTarget.current.y +=
          (containerRef.current.clientHeight - stageRef.current.height()) / 2;
      }
      stageRef.current.width(containerRef.current.clientWidth);
      stageRef.current.height(containerRef.current.clientHeight);
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect(); // clean up
  }, []);

  React.useEffect(() => {
    if (!containerRef.current) return;

    const state = { middleButtonPressed: false };
    const onDown = (e: MouseEvent) => {
      if (e.button == 1) {
        state.middleButtonPressed = true;
      }
    };
    const onUp = (e: MouseEvent) => {
      if (e.button == 1) {
        state.middleButtonPressed = false;
      }
    };
    const onMove = (e: MouseEvent) => {
      if (state.middleButtonPressed) {
        stageTransformTarget.current.x += e.movementX;
        stageTransformTarget.current.y += e.movementY;
      }
    };

    containerRef.current.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("mousemove", onMove);

    return () => {
      if (!containerRef.current) return;
      containerRef.current.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.addEventListener("mousemove", onMove);
    };
  }, []);

  const onScroll = React.useCallback(
    (e: Konva.KonvaEventObject<WheelEvent>) => {
      const stage = e.target.getStage();
      if (!stage) return;
      const oldScale = stage.scaleX();
      const pointer = stage.getPointerPosition();
      const scaleBy = 1.5;
      if (pointer) {
        const mousePointTo = {
          x: (pointer.x - stage.x()) / oldScale,
          y: (pointer.y - stage.y()) / oldScale,
        };

        let direction = e.evt.deltaY > 0 ? 1 : -1;
        let newScale = direction > 0 ? oldScale / scaleBy : oldScale * scaleBy;

        stageTransformTarget.current.scale = newScale;

        const newPos = {
          x: pointer.x - mousePointTo.x * newScale,
          y: pointer.y - mousePointTo.y * newScale,
        };
        stageTransformTarget.current.x = newPos.x;
        stageTransformTarget.current.y = newPos.y;
      }
    },
    [],
  );

  React.useEffect(() => {
    let animatingState = { animating: true };
    function animate() {
      if (stageRef.current) {
        let newScale =
          stageRef.current.scale().x +
          (stageTransformTarget.current.scale - stageRef.current.scale().x) / 5;
        stageRef.current.scale({ x: newScale, y: newScale });
        let newPos = {
          x:
            stageRef.current.position().x +
            (stageTransformTarget.current.x - stageRef.current.position().x) /
              5,
          y:
            stageRef.current.position().y +
            (stageTransformTarget.current.y - stageRef.current.position().y) /
              5,
        };
        stageRef.current.position(newPos);
      }
      if (animatingState.animating) requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
    return () => {
      animatingState.animating = false;
    };
  });

  return (
    <div className="absolute left-0 top-0 h-full w-full" ref={containerRef}>
      <Stage ref={stageRef} width={500} height={500} onWheel={onScroll}>
        <Layer>
          <NotesGraphWorld updateDeps={notes}>
            {notes.map((note) => (
              <NoteCircle
                key={note.id}
                note={note}
                active={note.id == activeNoteId}
                onSelected={onNoteSelected}
              />
            ))}
          </NotesGraphWorld>
        </Layer>
      </Stage>
    </div>
  );
}
