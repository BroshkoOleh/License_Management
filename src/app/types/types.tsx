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

export interface Language {
  id: string;
  languageCode: string;
  languageName: string;
}
export interface Feature {
  featureName: string;
  id: string;
  uuid: string;
}
export interface AppType {
  appName: string;
  id: string;
  uuid: string;
}
