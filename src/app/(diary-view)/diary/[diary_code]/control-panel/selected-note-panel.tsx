"use client";

import { DiaryTabPanel } from "@/app/(diary-view)/diary/[diary_code]/control-panel/panel";
import {
  useDiaryNote,
  useDiaryStore,
} from "@/app/(diary-view)/diary/[diary_code]/diary-store";
import { NoteFrame } from "@/components/note-editor/note-frame";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/spinner";
import { DiaryNote, NoteBase } from "@/services/types/notes";
import { LinkIcon } from "lucide-react";
import React from "react";

export function SelectedNotePanel() {
  const loadNotes = useDiaryStore((state) => state.loadNotes);
  const selectedNote = useDiaryStore((state) => state.selectedNote);
  const setSelectedNote = useDiaryStore((state) => state.setSelectedNote);
  const notes = useDiaryStore((state) => state.notes);
  console.log(notes);
  const writePermission = useDiaryStore((state) => state.writePermission);

  const [editMode, setEditMode] = React.useState(false);
  const { note } = useDiaryNote(selectedNote?.id, [notes]);

  if (!selectedNote) {
    return (
      <DiaryTabPanel className="h-full">
        <div className="flex h-full flex-col items-center justify-center">
          no note selected
        </div>
      </DiaryTabPanel>
    );
  }

  if (selectedNote && !note) {
    return (
      <DiaryTabPanel className="h-full">
        <div className="flex h-full flex-col items-center justify-center">
          <LoadingSpinner />
        </div>
      </DiaryTabPanel>
    );
  }

  const onLink = (noteId: number) => {
    const foundNote = notes.filter((x) => x.id == noteId)[0];
    if (foundNote) setSelectedNote(foundNote);
  };

  if (note) {
    return (
      <DiaryTabPanel className="grid h-full grid-rows-[1fr_auto]">
        <NoteFrame
          note={note}
          config={{
            canEdit: writePermission,
            onNoteUpdate: () => loadNotes(),
            editMode,
            defaultEditMode: editMode,
            setEditMode,
            onNoteLinkUsed: onLink,
            classNames: {
              title: "!text-2xl font-bold",
            },
          }}
        />
        <Accordion type="multiple">
          <AccordionItem value="references">
            <AccordionTrigger>
              <LinkIcon /> References
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-2">
              {note.incomingLinks.length > 0 ? (
                <div className="text-white">Incoming links</div>
              ) : null}
              {note.incomingLinks.map((x) => (
                <ReferenceLink
                  key={x.id}
                  note={x}
                  onClick={() => onLink(x.id)}
                />
              ))}
              {note.outcomingLinks.length > 0 ? (
                <div className="text-white">Outcoming links</div>
              ) : null}
              {note.outcomingLinks.map((x) => (
                <ReferenceLink
                  key={x.id}
                  note={x}
                  onClick={() => onLink(x.id)}
                />
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </DiaryTabPanel>
    );
  }

  return null;
}

function ReferenceLink({
  note,
  ...props
}: { note: NoteBase } & React.ComponentProps<typeof Button>) {
  return (
    <Button
      {...props}
      size={"sm"}
      variant={"outline"}
      className="justify-start"
    >
      <LinkIcon />
      {note.name}
    </Button>
  );
}
