export type Diary = {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  picture: string;
  isPublic: boolean;
};

export type DiaryProperties = {
  accentColor?: string;
};
