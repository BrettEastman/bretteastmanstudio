import type Record from "pocketbase";

export interface RecordMessage extends Record {
  user: string;
  message: string;
  response: string;
  created: string;
  updated: string;
}

export interface ListResult<T> {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  items: T[];
}

export type ResourceInstrument = "Drums" | "Bass" | "Guitar";

export type InstrDescription =
  | "Drums"
  | "Bass-tab"
  | "Bass-score"
  | "Bass-tab-score"
  | "Guitar-tab"
  | "Guitar-score"
  | "Guitar-tab-score"
  | "Guitar-chords"
  | "Guitar-chords-tab";

export interface ResourceItem {
  id: string;
  description: string;
  instrument: ResourceInstrument;
  pdfLink: string;
  pdfFile?: string;
}

export interface SongItem {
  id: string;
  songTitle: string;
  instrumentDescription: InstrDescription;
  artistName: string;
  songPdfLink: string;
  songPdfFile?: string;
}

export type SongList = SongItem[];

export type ResourceList = ResourceItem[];

export interface ChatMessage {
  id: string;
  user: string;
  message: string;
  response: string;
  created: string;
}

export type ContentPart = {
  text: string;
};

export type PrevMessage = {
  role: "user" | "model";
  parts: ContentPart[];
};
