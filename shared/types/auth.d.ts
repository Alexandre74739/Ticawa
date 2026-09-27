declare module "#auth-utils" {
  interface User {
    id: string;
    email: string;
    prenom: string;
    role: "user" | "admin";
  }
}

export {};
