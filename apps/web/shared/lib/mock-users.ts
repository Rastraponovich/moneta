import { User } from "@/entities/user";

export const mockUsers: User[] = [
  {
    id: "1",
    email: "demo@example.com",
    name: "Демо Пользователь",
    avatar: null,
  },
];

export const mockUserCredentials = {
  email: "demo@example.com",
  password: "demo123",
};
