export type SongList = SongItem[];

export interface SongItem {
  songTitle: string;
  instrumentDescription: InstrumentDescription;
  artistName: string;
  songPdfLink: string;
}

export type InstrumentDescription =
  | "Piano"
  | "Drums"
  | "Bass-tab"
  | "Bass-score"
  | "Bass-tab-score"
  | "Guitar-tab"
  | "Guitar-score"
  | "Guitar-chords"
  | "Guitar-chords-tab";
