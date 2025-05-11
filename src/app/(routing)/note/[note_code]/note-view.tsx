"use client";

import { NoteFrame } from "@/components/note-editor/note-frame";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { encodeId } from "@/lib/hash-utils";
import {
  getDiaryNote,
  getNoteWritePermission,
} from "@/services/methods/user/notes";
import { NoteBase, VerboseNote } from "@/services/types/notes";
import { LinkIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export function NoteView({
  serverNote,
  noteId,
}: {
  serverNote: VerboseNote | null;
  noteId: number;
}) {
  const [note, setNote] = React.useState(serverNote);
  const [editMode, setEditMode] = React.useState(false);
  const [writePermission, setWritePermission] = React.useState(false);

  const router = useRouter();

  const checkWritePermission = React.useCallback(async () => {
    const permission = await getNoteWritePermission(noteId);
    setWritePermission(permission);
  }, [noteId]);

  const fetchNote = React.useCallback(async () => {
    const note = await getDiaryNote(noteId);
    setNote(note);
  }, [noteId]);

  React.useEffect(() => {
    checkWritePermission();
  }, [checkWritePermission]);

  React.useEffect(() => {
    if (!note) {
      fetchNote();
    }
  }, [fetchNote]);

  const onLink = React.useCallback((linkNoteId: number) => {
    router.push(`/note/${encodeId("note", linkNoteId)}`);
  }, []);

  if (!note) {
    return <div>no such note found</div>;
  }

  return (
    <div>
      <NoteFrame
        note={note}
        config={{
          canEdit: writePermission,
          onNoteUpdate: () => fetchNote(),
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
              <ReferenceLink key={x.id} note={x} onClick={() => onLink(x.id)} />
            ))}
            {note.outcomingLinks.length > 0 ? (
              <div className="text-white">Outcoming links</div>
            ) : null}
            {note.outcomingLinks.map((x) => (
              <ReferenceLink key={x.id} note={x} onClick={() => onLink(x.id)} />
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
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
