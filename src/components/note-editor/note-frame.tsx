"use client";

import { NoteContentEditor } from "@/components/note-editor/note-content-editor";
import {
  NoteStoreConfig,
  NoteStoreProvider,
  useNoteStore,
} from "@/components/note-editor/note-store";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRequestHandler } from "@/hooks/use-request-handler";
import { useToast } from "@/hooks/use-toast";
import { updateDiaryNote } from "@/services/methods/user/notes";
import { VerboseNote } from "@/services/types/notes";
import { zodResolver } from "@hookform/resolvers/zod";
import classNames from "classnames";
import debounce from "just-debounce-it";
import { EllipsisVerticalIcon } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export type NoteFramePanelProps = React.ComponentProps<"div">;

export type NoteFrameProps = {
  note: VerboseNote;
  config?: NoteStoreConfig;
  baseProps?: NoteFramePanelProps;
};

export function NoteFrame({ note, config, baseProps }: NoteFrameProps) {
  return (
    <NoteStoreProvider note={note} {...config}>
      <NoteFrameContent {...baseProps} key={note.id} />
    </NoteStoreProvider>
  );
}

export function NoteFrameContent({ ...props }: NoteFramePanelProps) {
  const editMode = useNoteStore((state) => state.editMode);
  if (editMode) return <NoteEditor {...props} />;
  return <NoteViewer {...props} />;
}

export function NoteViewer({ className, ...props }: NoteFramePanelProps) {
  return (
    <div {...props} className={classNames("flex flex-col gap-4", className)}>
      <NoteHeader />
      <NoteContentEditor readOnly />
    </div>
  );
}

export function NoteEditor({ className, ...props }: NoteFramePanelProps) {
  return (
    <div {...props} className={classNames("flex flex-col gap-4", className)}>
      <NoteHeader />
      <NoteContentEditor />
    </div>
  );
}

function NoteHeader() {
  const editMode = useNoteStore((state) => state.editMode);
  const setEditMode = useNoteStore((state) => state.setEditMode);
  const canEdit = useNoteStore((state) => state.canEdit);

  return (
    <div className="flex items-center justify-between">
      <NoteTitle />
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant={"ghost"} className="px-3">
            <EllipsisVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Note</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>asdas</DropdownMenuItem>
            {canEdit ? (
              <DropdownMenuCheckboxItem
                checked={editMode}
                onCheckedChange={setEditMode}
              >
                Edit mode
              </DropdownMenuCheckboxItem>
            ) : null}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

const titleFormSchema = z.object({
  name: z.string().min(1),
});

function NoteTitle() {
  const { toast } = useToast();
  const note = useNoteStore((state) => state.note);
  const editMode = useNoteStore((state) => state.editMode);
  const setNote = useNoteStore((state) => state.setNote);

  const form = useForm<z.infer<typeof titleFormSchema>>({
    resolver: zodResolver(titleFormSchema),
    mode: "all",
    criteriaMode: "all",
    defaultValues: {
      name: note.name,
    },
  });

  if (!editMode) {
    return <div className="text-lg">{note.name}</div>;
  }

  const { loading, error, handleRequest } = useRequestHandler();

  const handleDebounceChange = React.useMemo(
    () =>
      debounce((data: z.infer<typeof titleFormSchema>) => {
        const dataToUpdate = titleFormSchema.parse(data);
        handleRequest(async () => {
          await updateDiaryNote({ id: note.id, ...dataToUpdate });
          let newNote = { ...note, ...dataToUpdate };
          setNote(newNote);
          toast({ title: "Saved!", description: "note saved" });
        });
      }, 500),
    [note],
  );

  const onChange = async () => {
    const data = form.getValues();
    handleDebounceChange(data);
  };

  return (
    <Form {...form}>
      <form onChange={onChange}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  className="border-0 p-0 !text-lg !ring-0"
                  placeholder="type note name"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
