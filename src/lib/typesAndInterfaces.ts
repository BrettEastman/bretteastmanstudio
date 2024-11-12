export type ResourceInstrument = "Drums" | "Bass" | "Guitar";

export type InstrumentDescription =
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
  description: string;
  instrument: ResourceInstrument;
  pdfLink: string;
}

export interface SongItem {
  songTitle: string;
  instrumentDescription: InstrumentDescription;
  artistName: string;
  songPdfLink: string;
}

export type SongList = SongItem[];

export type ResourceList = ResourceItem[];
