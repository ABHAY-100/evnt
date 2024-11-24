export interface CsvRow {
  [key: string]: string;
}

export interface FormData {
  type: "Channel" | "Group";
  name: string;
  description: string;
  members: string[];
}

export interface FormState {
  isChannel: boolean;
  groupName: string;
  groupDescription: string;
  selectedFile: File | null;
  resetFileKey?: number;
}
