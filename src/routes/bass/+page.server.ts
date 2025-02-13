import { pbUser } from "$lib/pocketbase";
import type { SongList } from "$lib/typesAndInterfaces";

export const load = async () => {
  try {
    const records = await pbUser.collection("songs").getFullList({
      filter: 'instrumentDescription ~ "Bass"',
    });

    const songList: SongList = records.map((record) => ({
      songTitle: record.songTitle,
      instrumentDescription: record.instrumentDescription,
      artistName: record.artistName,
      songPdfLink: record.songPdfLink,
    }));

    songList.sort((a, b) => a.songTitle.localeCompare(b.songTitle));

    return { songList };
  } catch (error) {
    console.error("Error fetching songs from PocketBase:", error);
    return { songList: [] };
  }
};
