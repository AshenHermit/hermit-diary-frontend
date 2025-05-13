"use client";

import {
  NoteCircle,
  NoteCirlceApi,
} from "@/components/visualization/notes-graph/NoteCircle";
import { NoteLinkLine } from "@/components/visualization/notes-graph/NoteLinkLine";
import { DiaryNote, NoteBase } from "@/services/types/notes";
import { link } from "fs";
import React from "react";
import { Line } from "react-konva";

export type NotesGraphWorldProps = {
  children: React.ReactElement<typeof NoteCircle>[];
  updateDeps: any[];
};

export function NotesGraphWorld({
  children,
  updateDeps,
}: NotesGraphWorldProps) {
  const nodeRefs = React.useRef<NoteCirlceApi[]>([]);
  const nodeRefsByNoteId = React.useRef<Record<number, NoteCirlceApi>>({});

  const validChildren = React.Children.toArray(children).filter(
    (child): child is React.ReactElement<typeof NoteCircle> =>
      React.isValidElement(child) && child.type == NoteCircle,
  );

  const [links, setLinks] = React.useState<[NoteCirlceApi, NoteCirlceApi][]>(
    [],
  );

  React.useEffect(() => {
    const linkStrength = 0.01;
    const linkDistance = 100;
    const repulsionStrength = 10000;
    const attractionStrength = 0.2;
    const damping = 0.9;

    const updateLinks = () => {
      if (links.length > 0) return;
      const newlinks: [NoteCirlceApi, NoteCirlceApi][] = [];
      for (let i = 0; i < nodeRefs.current.length; i++) {
        const a = nodeRefs.current[i];
        const note = a.note;
        if (note.outcomingLinks.length > 0) {
          note.outcomingLinks.forEach((otherNote) => {
            const otherCircle = nodeRefsByNoteId.current[otherNote.id];
            newlinks.push([a, otherCircle]);
          });
        }
      }
      if (newlinks.length > 0) {
        setLinks(newlinks);
      }
    };

    function updateForces() {
      // Отталкивание
      for (let i = 0; i < nodeRefs.current.length; i++) {
        const a = nodeRefs.current[i];
        for (let j = i + 1; j < nodeRefs.current.length; j++) {
          const b = nodeRefs.current[j];
          const dx = b.x() - a.x();
          const dy = b.y() - a.y();
          const dist = Math.max(50, Math.hypot(dx, dy));
          const force = repulsionStrength / (dist * dist);
          const fx = (force * dx) / dist;
          const fy = (force * dy) / dist;
          a.vx -= fx;
          a.vy -= fy;
          b.vx += fx;
          b.vy += fy;
        }
      }

      for (const link of links) {
        const dx = link[1].x() - link[0].x();
        const dy = link[1].y() - link[0].y();
        const dist = Math.max(1, Math.hypot(dx, dy));
        const force = (dist - linkDistance) * linkStrength;
        const fx = (force * dx) / dist;
        const fy = (force * dy) / dist;
        link[0].vx += fx;
        link[0].vy += fy;
        link[1].vx -= fx;
        link[1].vy -= fy;
      }

      for (const node of nodeRefs.current) {
        const dx = 0 - node.x();
        const dy = 0 - node.y();
        const dist = Math.max(1, Math.hypot(dx, dy));
        const force = attractionStrength * Math.log(dist + 1);
        const fx = (force * dx) / dist;
        const fy = (force * dy) / dist;
        node.vx += fx;
        node.vy += fy;

        node.vx *= damping;
        node.vy *= damping;
        // node.vx *= Math.min(0.99, damping + Math.abs(node.vx) / 1);
        // node.vy *= Math.min(0.99, damping + Math.abs(node.vy) / 1);
      }
    }
    let animatingState = { animating: true };
    const animate = () => {
      updateLinks();
      updateForces();
      for (let i = 0; i < nodeRefs.current.length; i++) {
        const node = nodeRefs.current[i];
        if (!node.isDragging()) {
          node.x(node.x() + node.vx);
          node.y(node.y() + node.vy);
        }
      }
      if (animatingState.animating) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
    return () => {
      animatingState.animating = false;
    };
  }, [links]);

  React.useEffect(() => {
    setLinks([]);
  }, [updateDeps]);

  return (
    <>
      {links.map((link) => {
        const key = `${link[0].note.id}-${link[1].note.id}`;
        return <NoteLinkLine key={key} from={link[0]} to={link[1]} />;
      })}
      {validChildren.map((child, index) =>
        React.cloneElement(child, {
          ...child.props,
          ref: (el: NoteCirlceApi | null) => {
            if (el) {
              nodeRefs.current[index] = el;
              nodeRefsByNoteId.current[(child.props as any).note.id] = el;
            }
          },
        } as any),
      )}
    </>
  );
}
