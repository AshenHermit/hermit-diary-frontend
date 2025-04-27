export type User = {
  id: number;
  email: string;
  password: string;
  name: string;
  service: "email" | "google" | "vk" | "yandex" | "github";
  picture: string;
};
