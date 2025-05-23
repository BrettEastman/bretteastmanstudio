import { createPocketBaseInstance } from "$lib/pocketbase";
import type { SongList } from "$lib/types";
import type { PageLoad } from "./$types";

export const load: PageLoad = async () => {
  try {
    const pbUser = createPocketBaseInstance();
    const records = await pbUser.collection("songs").getFullList({
      filter: 'instrumentDescription ~ "Bass"',
    });

    const songList: SongList = records.map((record) => ({
      songTitle: record.songTitle,
      instrumentDescription: record.instrumentDescription,
      artistName: record.artistName,
      songPdfLink: record.songPdfLink,
    }));

    return {
      songList: songList.sort((a, b) => a.songTitle.localeCompare(b.songTitle)),
    };
  } catch (err) {
    console.error("Error loading bass data:", err);
    return {
      songList: [],
      error: "Failed to load songs. Please try refreshing the page.",
    };
  }
};
