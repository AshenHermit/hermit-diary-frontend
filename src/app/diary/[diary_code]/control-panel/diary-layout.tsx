"use client";

import { NotesManager } from "@/app/diary/[diary_code]/control-panel/notes-manager";
import { SelectedNotePanel } from "@/app/diary/[diary_code]/control-panel/selected-note-panel";
import { SettingsPanel } from "@/app/diary/[diary_code]/control-panel/settings-panel";
import { useDiaryStore } from "@/app/diary/[diary_code]/diary-store";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/user-store";
import classNames from "classnames";
import {
  CircleDotDashedIcon,
  FolderTreeIcon,
  PanelRightIcon,
  SettingsIcon,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { Suspense } from "react";

const tabsRaw = [
  {
    key: "post",
    name: "post",
    icon: CircleDotDashedIcon,
    writePermission: false,
    content: <SelectedNotePanel />,
  },
  {
    key: "notes",
    name: "notes",
    icon: FolderTreeIcon,
    writePermission: false,
    content: <NotesManager />,
  },
  {
    key: "settings",
    name: "settings",
    icon: SettingsIcon,
    writePermission: true,
    content: <SettingsPanel />,
  },
] as const;
export type TabKey = (typeof tabsRaw)[number]["key"];
export type TabData = {
  key: TabKey;
  name: string;
  icon: (typeof tabsRaw)[0]["icon"];
  writePermission: boolean;
  content: React.ReactElement;
};
const tabs: TabData[] = tabsRaw as any;

function isTabsKey(value: string): value is TabKey {
  return tabs.some((tab) => tab.key === value);
}

export function DiaryLayout({ children }: React.PropsWithChildren) {
  const [isOpen, setIsOpen] = React.useState(true);
  const params = useParams<{ diary_code: string }>();
  const loadDiary = useDiaryStore((state) => state.loadDiary);
  const writePermission = useDiaryStore((state) => state.writePermission);

  const currentTab = useDiaryStore((state) => state.currentTab);
  const setCurrentTab = useDiaryStore((state) => state.setCurrentTab);

  let selectedTabData: TabData | null = null;
  const availableCurrentTabs = tabs.filter((tab) => tab.key == currentTab);
  if (availableCurrentTabs.length > 0)
    selectedTabData = availableCurrentTabs[0];

  React.useEffect(() => {
    setIsOpen(true);
  }, [currentTab]);

  React.useEffect(() => {
    loadDiary(params.diary_code);
  }, [params.diary_code]);

  const availableTabs = tabs.filter(
    (x) => (x.writePermission && writePermission) || !x.writePermission,
  );

  return (
    <div className="grid h-full min-h-0 grid-cols-[auto_auto_1fr] overflow-hidden">
      <Suspense>
        <TabSelector />
      </Suspense>
      <div className="flex flex-col bg-sidebar">
        {availableTabs.map((tab) => (
          <div key={tab.key} className="w-[3.5rem]">
            <TabButton
              onClick={() => setCurrentTab(tab.key)}
              active={currentTab == tab.key}
              tab={tab}
              key={tab.key}
            />
          </div>
        ))}
      </div>
      <main className="grid grid-cols-[auto_1fr]">
        <div
          className={classNames(
            "overflow-x-hidden bg-background transition-all",
            { "w-[300px]": isOpen, "w-0": !isOpen },
          )}
        >
          {availableTabs.map((tab) => (
            <div
              key={tab.key}
              className={classNames("h-full", {
                hidden: selectedTabData?.key != tab.key,
              })}
            >
              {tab.content}
            </div>
          ))}
        </div>
        <div className="relative">
          <Button
            variant={"ghost"}
            className="absolute left-0 top-0 h-10 w-10 p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            <PanelRightIcon />
          </Button>
        </div>
      </main>
    </div>
  );
}

function TabButton({
  tab,
  active,
  ...props
}: React.ComponentProps<typeof Button> & { tab: TabData; active?: boolean }) {
  const [canUnfold, setCanUnfold] = React.useState(true);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const onClick = React.useCallback<NonNullable<typeof props.onClick>>(
    (e) => {
      if (props.onClick) props.onClick(e);
      setCanUnfold(false);
    },
    [setCanUnfold],
  );

  React.useEffect(() => {
    if (!buttonRef.current) return;
    const handler = () => {
      setCanUnfold(true);
    };
    buttonRef.current.addEventListener("mouseleave", handler);
    return () => {
      if (!buttonRef.current) return;
      buttonRef.current.removeEventListener("mouseleave", handler);
    };
  }, []);

  return (
    <Button
      {...props}
      ref={buttonRef}
      onClick={onClick}
      variant="ghost"
      size={"lg"}
      className={classNames(
        "relative z-10 h-[3.5rem] max-w-[3.5rem] justify-start gap-4 overflow-hidden p-4 transition-all",
        { "hover:max-w-48 hover:rounded-md": canUnfold },
        { "rounded-e-none": active },
        { "bg-background": active },
      )}
    >
      <tab.icon className="!size-6" />
      {tab.name}
    </Button>
  );
}

function TabSelector({}: {}) {
  const currentTab = useDiaryStore((state) => state.currentTab);
  const setCurrentTab = useDiaryStore((state) => state.setCurrentTab);

  const tabParamKey = "tab";
  const searchParams = useSearchParams();
  const router = useRouter();

  const writePermission = useDiaryStore((state) => state.writePermission);
  const loaded = useDiaryStore((state) => state.loaded);
  const selectedTab = searchParams.get(tabParamKey);

  function getKeyForReset(): TabKey {
    return tabs.filter((tab) => !tab.writePermission)[0].key;
  }

  React.useEffect(() => {
    if (!loaded) return;
    if (selectedTab) {
      let newSelectedTabKey = getKeyForReset();
      if (isTabsKey(selectedTab)) {
        let selectedTabData = tabs.filter(
          (tab) => tab.key == newSelectedTabKey,
        )[0];
        if (!writePermission && selectedTabData.writePermission) {
        } else {
          newSelectedTabKey = selectedTab;
        }
      }
      console.log(newSelectedTabKey);
      setCurrentTab(newSelectedTabKey);
    }
  }, [selectedTab, setCurrentTab, writePermission]);

  React.useEffect(() => {
    if (!loaded) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set(tabParamKey, currentTab);
    router.push(`?${params.toString()}`);
  }, [currentTab, loaded]);

  return null;
}
