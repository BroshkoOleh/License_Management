export interface User {
  displayName: string;
  role: "Admin" | "Editor" | "Viewer";
  email: string;
}

export interface Group {
  groupName: string;
  userEmails: string[];
  id: string;
}
